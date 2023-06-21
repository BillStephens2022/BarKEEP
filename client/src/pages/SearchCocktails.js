import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { ADD_COCKTAIL } from "../utils/mutations";
import { searchCocktails, getCocktailsbyIngredient } from "../utils/API";
import CocktailCard from "../components/CocktailCard";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import "../styles/Home.css";

const SearchCocktails = () => {
  // create state for holding returned google api data
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState();

  const client = useApolloClient();
  const [addCocktail] = useMutation(ADD_COCKTAIL, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleIngredientChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIngredient(selectedValue);
    setSearchInput("");
  };

 

  const handleAddCocktail = async (cocktailData) => {
    try {
      const { data } = await addCocktail({
        variables: cocktailData,
      });
      console.log("Cocktail added: ", data.addCocktail);

      // Manually update the cache with the newly added cocktail
      const { cocktails } = client.readQuery({ query: QUERY_COCKTAILS });
      client.writeQuery({
        query: QUERY_COCKTAILS,
        data: { cocktails: [data.addCocktail, ...cocktails] },
      });
    } catch (error) {
      console.error("Error adding cocktail:", error);
    }
  };

  // create state to hold saved bookId values in local storage - need to add function in utils folder
  // const [savedCocktailIds, setSavedCocktailIds] = useState(getSavedCocktailIds());

  const handleSearchSubmit = useCallback(async (event) => {
    // add asynchronous function to handle cocktail searches from the API

    if (!searchInput && !selectedIngredient) {
      return false;
    }

    if (event) {
      event.preventDefault();
    }

    try {
      let cocktailData = [];
      let response = false;
      if (searchInput) {
        // searchCocktails is a helper function in utilities folder for API call to TheCocktailDB to search recipes by cocktail name
        response = await searchCocktails(searchInput);
      } else if (selectedIngredient) {
        // getCocktailsByIngredient is a helper function in utilities folder for API call to CocktailDB to search recipes by ingredient
        console.log("thanks for selecting an ingredient: ", selectedIngredient);
        response = await getCocktailsbyIngredient(selectedIngredient);
      }

      if (response) {
        if (response.status !== 200) {
          console.log("response: ", response);
          console.log(response.status);
          throw new Error("something went wrong!");
        }
        const searchResults = await response.json();
        cocktailData = searchResults.drinks.map((cocktail) => {
          const ingredients = [];
          const tags = [];
          for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const quantity = cocktail[`strMeasure${i}`];
            if (ingredient) {
              ingredients.push({ name: ingredient, quantity: quantity });
              tags.push(ingredient);
            } else {
              break; // stop iterating if no more ingredients are found
            }
          }
          return {
            _id: cocktail.idDrink,
            name: cocktail.strDrink,
            imageURL: cocktail.strDrinkThumb,
            instructions: cocktail.strInstructions,
            glassware: cocktail.strGlass,
            ingredients: ingredients,
            tags: tags,
          };
        });

        // will need to map ingredients and quantities from API call into ingredients array.
        setSearchedCocktails(cocktailData);

        setSelectedIngredient("");
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchInput, selectedIngredient]);
  
  useEffect(() => {
    handleSearchSubmit();
  }, [selectedIngredient, handleSearchSubmit]);

  return (
    <div>
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Search for a Cocktail by Name</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="input_search_cocktails"
          placeholder="Search for a cocktail..."
          value={searchInput}
          name="searchInput"
          onChange={(e) => setSearchInput(e.target.value)}
        ></input>
        <button className="btn button_search_cocktails" type="submit">
          Go!
        </button>
      </form>
      <h2 className="subtitle">Search for Cocktails by Ingredient</h2>
      <select
        className="ingredient_dropdown"
        value={selectedIngredient}
        onChange={handleIngredientChange}
      >
        <option value="">Select an Ingredient</option>
        <option value="gin">Gin</option>
        <option value="rum">Rum</option>
        <option value="tequila">Tequila</option>
        <option value="vodka">Vodka</option>
        <option value="whiskey">Whiskey</option>
      </select>
      <div className="card_container">
        <CocktailCard
          cocktails={searchedCocktails}
          page="SearchCocktails"
          handleAddCocktail={handleAddCocktail}
        />
      </div>
    </div>
  );
};

export default SearchCocktails;
