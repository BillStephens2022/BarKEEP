import React, { useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import { ADD_COCKTAIL } from "../utils/mutations";
import { searchCocktails } from "../utils/API";
import Header from "../components/Header";
import SearchCocktailName from "../components/SearchCocktailName";
import SearchCocktailIngredient from "../components/SearchCocktailIngredient";
import RandomCocktail from "../components/RandomCocktail";
import "../styles/pages/SearchCocktails.css";

const SearchCocktails = () => {
  // State variable to track whether user is searching by name, ingredient, or random
  const [searchBy, setSearchBy] = useState("name");
  const [addedCocktailId, setAddedCocktailId] = useState(null);
  const [cocktailAdded, setCocktailAdded] = useState({});

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
      setCocktailAdded((prev) => ({
        ...prev,
        [cocktailData._id]: true,
      }));
    } catch (error) {
      console.error("Error adding cocktail:", error);
    }
  };

  const renderSearchComponent = () => {
    // Render the appropriate search component based on the selected searchBy value
    switch (searchBy) {
      case "name":
        return (
          <SearchCocktailName
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
            cocktailAdded={cocktailAdded}
          />
        );
      case "ingredient":
        return (
          <SearchCocktailIngredient
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
            cocktailAdded={cocktailAdded}
          />
        );
      case "random":
        return (
          <RandomCocktail
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
            cocktailAdded={cocktailAdded}
          />
        );
      default:
        return null;
    }
  };

  // Highlight the active search button by adding an "active" class
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
    <div className="search-cocktails">
      {/* Display the header */}
      <Header page="search" />
      {/* Search subheadings and buttons */}
      <div className="search-subheadings">
        <h2 className="search-header-1">
          Search{" "}
          <a id="link-opencocktaildb" href="https://www.TheCocktailDB.com">
            'TheCocktailDB'
          </a>{" "}
          API
        </h2>
        <h3 className="search-header-2">
          Search by:{" "}
          <span className="searchBy-text">
            {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
          </span>
        </h3>
        {/* Buttons for different search options */}
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
      {/* Render the selected search component */}
      <div className="div-search-component gradient-background">
        {renderSearchComponent()}
      </div>
    </div>
  );
};

export default SearchCocktails;
