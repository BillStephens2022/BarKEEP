import React, { useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import { ADD_COCKTAIL } from "../utils/mutations";
import { searchCocktails } from "../utils/API"
import SearchCocktailName from "../components/SearchCocktailName";
import SearchCocktailIngredient from "../components/SearchCocktailIngredient";
import RandomCocktail from "../components/RandomCocktail";
import "../styles/SearchCocktails.css";

const SearchCocktails = () => {
  // state variable will drive which component is shown on the screen depending on whether user chooses
  // to search by cocktail name or ingredient
  const [searchBy, setSearchBy] = useState("");
  const [addedCocktailId, setAddedCocktailId] = useState(null);

  const client = useApolloClient();

  const [addCocktail] = useMutation(ADD_COCKTAIL, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  useEffect(() => {
    console.log(addedCocktailId);
  }, [addedCocktailId]);

  const handleAddCocktail = async (cocktailData) => {
    
    console.log(cocktailData._id);
    
    if (!cocktailData.ingredients.length) {
      const searchData = await searchCocktails(cocktailData.name);
      cocktailData = searchData[0];
      setAddedCocktailId(cocktailData._id);
    }
    setAddedCocktailId(cocktailData._id);
    console.log(addedCocktailId);
    console.log("Cocktail data:", cocktailData);
    try {
      const { data } = await addCocktail({
        variables: cocktailData,
      });
      console.log("Cocktail added: ", data.addCocktail);

      // Manually update the cache with the newly added cocktail
      const { cocktails } = client.readQuery({ query: QUERY_COCKTAILS }) || {
        cocktails: [],
      };
      client.writeQuery({
        query: QUERY_COCKTAILS,
        data: { cocktails: [data.addCocktail, ...cocktails] },
      });
    } catch (error) {
      console.error("Error adding cocktail:", error);
    }
  };

  const renderSearchComponent = () => {
    switch (searchBy) {
      case "name":
        return (
          <SearchCocktailName
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
          />
        );
      case "ingredient":
        return (
          <SearchCocktailIngredient
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
          />
        );
      case "random":
        return (
          <RandomCocktail
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
          />
        );
      default:
        return null;
    }
  };

  var buttons = document.getElementsByClassName("btn-search");

  // determines which button is active and uses the active class to change styling when
  // button is active.
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      // Remove the active class from the previously active button
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }
      // Add the active class to the clicked button
      this.className += " active";
    });
  }

  return (
    <div className="searchCocktails">
    <div className="search-headings">
      <h1 className="title">BarKEEP</h1>
      <h2 className="search-header">
        Search by:{" "}
        <span className="searchBy-text">
          {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
        </span>
      </h2>
      <div className="div-search-btn">
        <button
          className="btn btn-search btn-searchByName"
          onClick={() => setSearchBy("name")}
        >
          Name
        </button>
        <button
          className="btn btn-search btn-searchByIngredient"
          onClick={() => setSearchBy("ingredient")}
        >
          Ingredient
        </button>
        <button
          className="btn btn-search btn-searchByRandom"
          onClick={() => setSearchBy("random")}
        >
          Random
        </button>
      </div>
      </div>
      <div className="div-search-component">{renderSearchComponent()}</div>
    </div>
  );
};

export default SearchCocktails;
