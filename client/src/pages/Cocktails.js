import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CocktailCard from "../components/CocktailCard";
import CocktailForm from "../components/CocktailForm";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import { ADD_COCKTAIL, DELETE_COCKTAIL } from "../utils/mutations";
import { Modal } from "react-bootstrap";
import "../styles/Home.css";


const Cocktails = ({ cocktails, setCocktails }) => {
  
  const [showCocktailForm, setShowCocktailForm] = useState(false);
  const [cocktailFormState, setCocktailFormState] = useState({
    name: "",
    ingredients: [
      {
        name: "",
        quantity: ""
      }
    ],
    imageURL: "",
    glassware: "",
    instructions: "",
    tags: []
  });

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
              cocktails: [addCocktail, ...me.cocktails ],
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
        quantity: ingredient.quantity || undefined
      })), 
      imageURL: cocktailFormState.imageURL || undefined,
      glassware: cocktailFormState.glassware || undefined,
      instructions: cocktailFormState.instructions || undefined,
      tags: cocktailFormState.tags || undefined
    },
    refetchQueries: [{ query: QUERY_COCKTAILS }]
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

  useEffect(() => {
    if (data?.me?.cocktails) {
      setCocktails(data?.me?.cocktails);
    }
  }, [data, refetch]);
  

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="cocktails-main">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">My Cocktail Recipes</h2>
      <button className="btn add_cocktail_button" onClick={() => setShowCocktailForm(!showCocktailForm)}>Add Your Own Cocktail</button>
      <Link to="/searchCocktails" className="btn search_cocktail_button">
        Search for a new Cocktail
      </Link>
      {showCocktailForm && (
          <div className="modal-background">
            <div className="modal">
              <Modal show={true} onHide={() => setShowCocktailForm(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Cocktail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CocktailForm
                    setShowCocktailForm={setShowCocktailForm}
                    addCocktail={addCocktail}
                    cocktails={cocktails}
                    setCocktails={setCocktails}
                    cocktailFormState={cocktailFormState}
                    setCocktailFormState={setCocktailFormState}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        )}
      <div className="card_container">
        <CocktailCard
          data={data}
          loading={loading}
          cocktails={cocktails}
          setCocktails={setCocktails}
          deleteCocktail={deleteCocktail}
          page="Cocktails"
        />
      </div>
    </div>
  );
};

export default Cocktails;
