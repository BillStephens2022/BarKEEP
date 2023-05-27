import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import CocktailCard from "../components/CocktailCard";
import CocktailForm from "../components/CocktailForm";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { ADD_COCKTAIL } from "../utils/mutations";
import { Modal } from "react-bootstrap";

const Cocktails = ({ cocktails, setCocktails }) => {
  const [showCocktailForm, setShowCocktailForm] = useState(false);
  const { data, loading, refetch } = useQuery(QUERY_ME);

  useEffect(() => {
    if (data?.me?.cocktails) {
      setCocktails(data?.me?.cocktails);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cocktails-main">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">My Cocktail Recipes</h2>
      <a className="add_cocktail_button" onClick={() => setShowCocktailForm(!showCocktailForm)}>Add Cocktail</a>
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
