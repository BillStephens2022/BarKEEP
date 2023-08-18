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
import { Auth } from "../utils/auth";
import CocktailCard from "./CocktailCard";
import CocktailForm from "./CocktailForm";
import ShareRecipeForm from "./ShareRecipeForm";
import ShimmerLoader from "./ShimmerLoader";
import "../styles/pages/Favorites.css";

const MyFavorites = () => {
  // state for managing favorited cocktail recipes
  const [cocktails, setCocktails] = useState([]);
  // State for managing the display of cocktail form
  const [showCocktailForm, setShowCocktailForm] = useState(false);
  // State for managing the display of share recipe form
  const [showShareRecipeForm, setShowShareRecipeForm] = useState(false);
  // State for the selected cocktail for editing or sharing
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  // State for cocktail form data
  const [cocktailFormState, setCocktailFormState] = useState({
    // Initial cocktail form data
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
  // State for share recipe form data
  const [shareRecipeFormState, setShareRecipeFormState] = useState({
    postTitle: "",
    postContent: "",
    postImageURL: "",
    recipe: "",
  });
  // State to indicate whether it's an "add" or "edit" form
  const [formType, setFormType] = useState("add");
  // State to manage profile photo editing
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [uploadedProfilePhotoUrl, setUploadedProfilePhotoUrl] = useState(null);
   // Fetch user data from query
  const { data, loading, refetch } = useQuery(QUERY_ME);
  const { me } = data || {};

  // Mutation for adding a cocktail recipe
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
  // Mutation for deleting a cocktail recipe
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
    },
  });
  // Mutation for editing a cocktail recipe
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
  // Mutation for editing the user's profile photo
  const [editProfilePhoto] = useMutation(EDIT_PROFILE_PHOTO, {
    onCompleted(data) {
      console.log("Profile photo updated:", data);
    },
    onError(error) {
      console.error("Profile photo update failed:", error);
    },
  });
  // Function to handle editing a cocktail
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
  // Function to handle a successful image upload for profile photo
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
  // Function to handle deleting a cocktail recipe
  const handleDeleteCocktail = async (cocktailId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    console.log("deleting cocktail!");
    try {
      const { data } = await deleteCocktail({
        variables: { cocktailId },
      });
      if (!data) {
        throw new Error("something went wrong!");
      }
      console.log("done!");
      setCocktails((prevCocktails) =>
        prevCocktails.filter((cocktail) => cocktail._id !== cocktailId)
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };
  // Function to handle sharing a cocktail recipe
  const handleShareRecipe = (selectedCocktail) => {
    setSelectedCocktail(selectedCocktail);
    console.log("selected cocktail: ", selectedCocktail);
    setShowShareRecipeForm(true);
    return;
  }

  // Fetch and set cocktails when data or cocktails change
  useEffect(() => {
    if (data?.me?.cocktails) {
      setCocktails(data?.me?.cocktails);
    } else {
      console.log(cocktails[0]);
    }
  }, [data, refetch, cocktails, setCocktails]);

  // Update profile photo when uploadedProfilePhotoUrl changes
  useEffect(() => {
    handleProfilePhotoUpdate(uploadedProfilePhotoUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedProfilePhotoUrl]);

  // Render the ShimmerLoader when data is still loading
  if (loading) {
    return <ShimmerLoader />;
  }
  // Render message if no cocktails are available
  if (!cocktails.length) {
    return <h3 className="cocktail_card_error">No cocktails to display yet</h3>;
  }
  // Render MyFavorites component
  return (
    <div className="favorites">
    <div className="gradient-background">
      {/* Buttons to add a cocktail and search for a new cocktail */}
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
      {/* Modal for adding/editing a cocktail */}
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
      {/* Modal for sharing a cocktail recipe */}
      {showShareRecipeForm && (
        <div className="modal-background">
          <div className="modal">
            <Modal show={true} onHide={() => setShowShareRecipeForm(false)}>
              <Modal.Header className="modal-title">
                <Modal.Title>Share Cocktail</Modal.Title>
                <button
                  className="modal-close-button"
                  onClick={() => setShowShareRecipeForm(false)}
                >
                  &times;
                </button>
              </Modal.Header>
              <Modal.Body className="modal-body">
                <ShareRecipeForm
                  showShareRecipeForm={showShareRecipeForm}
                  setShowShareRecipeForm={setShowShareRecipeForm}
                  shareRecipeFormState={shareRecipeFormState}
                  setShareRecipeFormState={setShareRecipeFormState}
                  selectedCocktail={selectedCocktail}
                />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
      {/* Display cocktail cards */}
      <div className="card-container">
        <CocktailCard
          loading={loading}
          cocktails={cocktails}
          setCocktails={setCocktails}
          handleEditCocktail={handleEditCocktail}
          handleDeleteCocktail={handleDeleteCocktail}
          handleShareRecipe={handleShareRecipe}
          cocktailAdded={{}}
          page="Favorites"
        />
      </div>
      </div>
    </div>
  );
};

export default MyFavorites;
