import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import CocktailCard from "../components/CocktailCard";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";

const Cocktails = ({ cocktails, setCocktails }) => {
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
      <a className="add_cocktail_button">Add Cocktail</a>
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
