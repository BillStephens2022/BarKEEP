import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CocktailCardLite from "../components/CocktailCardLite";
import CocktailForm from "../components/CocktailForm";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import {
  ADD_COCKTAIL,
  DELETE_COCKTAIL,
  EDIT_COCKTAIL,
} from "../utils/mutations";
import { Modal } from "react-bootstrap";
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

  const { data, loading, refetch } = useQuery(QUERY_ME);

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

  const handleEditCocktail = (cocktail) => {
    setSelectedCocktail(cocktail);
    setShowCocktailForm(true);
    setFormType("edit");
    console.log("editing cocktail: ", cocktail);
  };

  useEffect(() => {
    if (data?.me?.cocktails) {
      setCocktails(data?.me?.cocktails);
    } else {
      console.log(cocktails[0]);
    }
  }, [data, refetch, cocktails, setCocktails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    console.log("no cocktail length!");
    return <h3 className="cocktail_card_error">No cocktails to display yet</h3>;
  }

  return (
    <div className="favorites">
      <div className="favorites-headings">
        <h1 className="title">BarKEEP</h1>
        <h2 className="subtitle">My Cocktail Recipes</h2>
        <button
          className="btn add_cocktail_button"
          onClick={() => {
            setSelectedCocktail(null);
            setShowCocktailForm(!showCocktailForm);
            setFormType("add");
          }}
        >
          Add Your Own Cocktail
        </button>
        <Link to="/searchCocktails" className="btn search_cocktail_button">
          Search for a new Cocktail
        </Link>
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
        <CocktailCardLite
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
