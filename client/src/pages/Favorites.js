import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import {
  ADD_COCKTAIL,
  DELETE_COCKTAIL,
  EDIT_COCKTAIL,
  EDIT_PROFILE_PHOTO,
} from "../utils/mutations";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { GoPencil } from "react-icons/go";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import UploadWidget from "../components/UploadWidget";
import CocktailCard from "../components/CocktailCard";
import CocktailForm from "../components/CocktailForm";
import ProfilePhoto from "../components/ProfilePhoto";
import "../styles/Favorites.css";

const Favorites = ({ cocktails, setCocktails }) => {
  const [showCocktailForm, setShowCocktailForm] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [cocktailFormState, setCocktailFormState] = useState({
    name: "",
    ingredients: [
      {
        name: "",
        quantity: "",
      },
    ],
    imageURL: "",
    glassware: "",
    instructions: "",
    tags: [],
  });
  const [formType, setFormType] = useState("add");
  // State to manage profile photo editing
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [uploadedProfilePhotoUrl, setUploadedProfilePhotoUrl] = useState(null);

  const { data, loading, refetch } = useQuery(QUERY_ME);
  const { me } = data || {};

  const [addCocktail] = useMutation(ADD_COCKTAIL, {
    update(cache, { data: { addCocktail } }) {
      try {
        const { cocktails } = cache.readQuery({
          query: QUERY_COCKTAILS,
        }) ?? { cocktails: [] };

        cache.writeQuery({
          query: QUERY_COCKTAILS,
          data: { cocktails: [addCocktail, ...cocktails] },
        });

        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              cocktails: [addCocktail, ...me.cocktails],
            },
          },
        });
      } catch (e) {
        console.log("error with mutation!");
        console.error(e);
      }
      console.log("updated cache:", cache.data.data);
    },
    variables: {
      name: cocktailFormState.name || undefined,
      ingredients: cocktailFormState.ingredients.map((ingredient) => ({
        name: ingredient.name || undefined,
        quantity: ingredient.quantity || undefined,
      })),
      imageURL: cocktailFormState.imageURL || undefined,
      glassware: cocktailFormState.glassware || undefined,
      instructions: cocktailFormState.instructions || undefined,
      tags: cocktailFormState.tags || undefined,
    },
    refetchQueries: [{ query: QUERY_COCKTAILS }],
  });

  const [deleteCocktail] = useMutation(DELETE_COCKTAIL, {
    update(cache, { data: { deleteCocktail } }) {
      try {
        const { cocktails } = cache.readQuery({
          query: QUERY_COCKTAILS,
        }) ?? { cocktails: [] };

        const updatedCocktails = cocktails.filter(
          (cocktail) => cocktail._id !== deleteCocktail._id
        );

        cache.writeQuery({
          query: QUERY_COCKTAILS,
          data: { cocktails: updatedCocktails },
        });

        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              cocktails: updatedCocktails,
            },
          },
        });
      } catch (e) {
        console.log("error with mutation!");
        console.error(e);
      }

      console.log("updated cache:", cache.data.data);
      refetch();
    },
  });

  const [editCocktail] = useMutation(EDIT_COCKTAIL, {
    update(cache, { data: { editCocktail } }) {
      try {
        const { cocktails } = cache.readQuery({
          query: QUERY_COCKTAILS,
        }) ?? { cocktails: [] };

        const updatedCocktails = cocktails.map((cocktail) => {
          if (cocktail._id === editCocktail._id) {
            return {
              ...cocktail,
              name: cocktailFormState.name || cocktail.name,
              ingredients: cocktailFormState.ingredients.map(
                (ingredient, index) => ({
                  name: ingredient.name || cocktail.ingredients[index].name,
                  quantity:
                    ingredient.quantity || cocktail.ingredients[index].quantity,
                })
              ),
              imageURL: cocktailFormState.imageURL || cocktail.imageURL,
              glassware: cocktailFormState.glassware || cocktail.glassware,
              instructions:
                cocktailFormState.instructions || cocktail.instructions,
              tags: cocktailFormState.tags || cocktail.tags,
            };
          } else {
            return cocktail;
          }
        });

        cache.writeQuery({
          query: QUERY_COCKTAILS,
          data: { cocktails: updatedCocktails },
        });

        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              cocktails: updatedCocktails,
            },
          },
        });
      } catch (e) {
        console.log("error with mutation!");
        console.error(e);
      }

      console.log("updated cache:", cache.data.data);
    },
    refetchQueries: [{ query: QUERY_COCKTAILS }],
  });

  const [editProfilePhoto] = useMutation(EDIT_PROFILE_PHOTO, {
    onCompleted(data) {
      console.log("Profile photo updated:", data);
    },
    onError(error) {
      console.error("Profile photo update failed:", error);
    },
  });

  const handleEditCocktail = (cocktail) => {
    setSelectedCocktail(cocktail);
    setShowCocktailForm(true);
    setFormType("edit");
    console.log("editing cocktail: ", cocktail);
  };

  // Function to toggle the editing state
  const toggleEditingProfilePhoto = () => {
    setEditingProfilePhoto((prevState) => !prevState);
  };

  const handleSuccessfulUpload = (result) => {
    // When the upload is successful, Cloudinary returns the secure_url in the result
    if (result && result.info.secure_url) {
      const convertedUrl = result.info.secure_url.replace(/\.heic$/, ".jpg");
      console.log("converted URL: ", convertedUrl);
      setUploadedProfilePhotoUrl(convertedUrl);
      console.log("uploaded profile photo url: ", uploadedProfilePhotoUrl);
      handleProfilePhotoUpdate(uploadedProfilePhotoUrl);
    }
  };

  // Function to handle the profile photo update
  const handleProfilePhotoUpdate = async (uploadedProfilePhotoUrl) => {
    // Call the mutation to update the profile photo with the new secure_url
    if (uploadedProfilePhotoUrl) {
      try {
        editProfilePhoto({
          variables: {
            profilePhoto: uploadedProfilePhotoUrl,
          },
        });

        // Reset the uploadedProfilePhotoUrl and toggle editing state
        setUploadedProfilePhotoUrl(null);
        toggleEditingProfilePhoto();
      } catch (error) {
        console.error("Profile photo update failed:", error);
      }
    }
  };

  useEffect(() => {
    if (data?.me?.cocktails) {
      setCocktails(data?.me?.cocktails);
    } else {
      console.log(cocktails[0]);
    }
  }, [data, refetch, cocktails, setCocktails]);

  useEffect(() => {
    console.log("uploaded profile photo url: ", uploadedProfilePhotoUrl);
    handleProfilePhotoUpdate(uploadedProfilePhotoUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedProfilePhotoUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3 className="cocktail_card_error">No cocktails to display yet</h3>;
  }

  return (
    <div className="favorites">
      <div className="favorites-headings">
        <div className="user-heading">
          <div className="user-profile">
            <ProfilePhoto
              imageUrl={
                me.profilePhoto
                  ? me.profilePhoto
                  : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
              }
              size={64}
            />
            {editingProfilePhoto ? (
              <div className="upload-widget-edit-profile-photo">
                {/* Conditionally render the UploadWidget when editingProfilePhoto is true */}
                <UploadWidget onSuccess={handleSuccessfulUpload} />
              </div>
            ) : (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Edit Profile Photo</Tooltip>}
              >
              <i className="edit-photo-icon">
                
                <GoPencil
                  className="edit-photo-icon-pencil"
                  onClick={toggleEditingProfilePhoto}
                />
                </i>
              </OverlayTrigger>
            )}
          </div>
          <h3 className="favorites-username">{me.username}</h3>
        </div>
        <h1 className="favorites-title">BarKEEP</h1>
        <h2 className="favorites-subtitle">My Cocktail Recipes</h2>
        <div className="favorites-buttons-div">
          <button
            className="btn add-cocktail-button"
            onClick={() => {
              setSelectedCocktail(null);
              setShowCocktailForm(!showCocktailForm);
              setFormType("add");
            }}
          >
            Add Your Own Cocktail
          </button>

          <Link to="/searchCocktails" className="btn search-cocktail-button">
            Search for a new Cocktail
          </Link>
        </div>
        {showCocktailForm && (
          <div className="modal-background">
            <div className="modal">
              <Modal show={true} onHide={() => setShowCocktailForm(false)}>
                <Modal.Header className="modal-title">
                  <Modal.Title>
                    {formType.charAt(0).toUpperCase() + formType.slice(1)}{" "}
                    Cocktail
                  </Modal.Title>
                  <button
                    className="modal-close-button"
                    onClick={() => setShowCocktailForm(false)}
                  >
                    &times;
                  </button>
                </Modal.Header>
                <Modal.Body className="modal-body">
                  <CocktailForm
                    setShowCocktailForm={setShowCocktailForm}
                    addCocktail={addCocktail}
                    editCocktail={editCocktail}
                    cocktails={cocktails}
                    setCocktails={setCocktails}
                    cocktailFormState={cocktailFormState}
                    setCocktailFormState={setCocktailFormState}
                    selectedCocktail={selectedCocktail}
                    formType={formType}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        )}
      </div>
      <div className="card-container">
        <CocktailCard
          data={data}
          loading={loading}
          cocktails={cocktails}
          setCocktails={setCocktails}
          deleteCocktail={deleteCocktail}
          handleEditCocktail={handleEditCocktail}
          selectedCocktail={selectedCocktail}
          page="Favorites"
        />
      </div>
    </div>
  );
};

export default Favorites;
