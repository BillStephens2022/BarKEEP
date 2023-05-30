import React, { useState } from "react";
import "../styles/Home.css";
import CocktailCard from "../components/CocktailCard";
import CocktailForm from "../components/CocktailForm";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import { ADD_COCKTAIL } from "../utils/mutations";
import { Modal } from "react-bootstrap";


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

  const { data, loading } = useQuery(QUERY_ME);
  
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
      name: cocktailFormState.name,
      ingredients: cocktailFormState.ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity
      })), 
      imageURL: cocktailFormState.imageURL,
      glassware: cocktailFormState.glassware,
      instructions: cocktailFormState.instructions,
      tags: cocktailFormState.tags
    },
  });

  // useEffect(() => {
  //   if (data?.me?.cocktails) {
  //     setCocktails(data?.me?.cocktails);
  //   }
  // }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="cocktails-main">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">My Cocktail Recipes</h2>
      <button className="btn add_cocktail_button" onClick={() => setShowCocktailForm(!showCocktailForm)}>Add Your Own Cocktail</button>
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
        />
      </div>
    </div>
  );
};

export default Cocktails;
