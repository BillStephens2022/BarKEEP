import React, { useEffect, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { ADD_COCKTAIL } from "../utils/mutations";
import { searchCocktails } from "../utils/API";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import CocktailCard from "./CocktailCard";
import "../styles/Home.css";

const SearchCocktailName = () => {
  // create state for holding returned google api data
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");
  const [addedCocktailId, setAddedCocktailId] = useState(null);
  const client = useApolloClient();

  const [addCocktail] = useMutation(ADD_COCKTAIL, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleAddCocktail = async (cocktailData) => {
    setAddedCocktailId(cocktailData._id);
    console.log(addedCocktailId);
    try {
      const { data } = await addCocktail({
        variables: cocktailData,
      });
      console.log("Cocktail added: ", data.addCocktail);

      // Manually update the cache with the newly added cocktail
      const { cocktails } = client.readQuery({ query: QUERY_COCKTAILS }) || { cocktails: [] };
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

  const handleSearchSubmit = async (event) => {
    // add asynchronous function to handle cocktail searches from the API
    console.log(event);
    if (event) {
      event.preventDefault();
    }
    if (!searchInput) {
      return false;
    }

    try {
      let cocktailData = [];
      // searchCocktails is a helper function in utilities folder for API call to TheCocktailDB to search recipes by cocktail name
      const response = await searchCocktails(searchInput);

      if (response.status !== 200) {
        console.log("response: ", response);
        console.log(response.status);
        throw new Error("something went wrong!");
      }

      // will need to map ingredients and quantities from API call into ingredients array.
      setSearchedCocktails(response.cocktailData);
     
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="searchName">
      <form className="searchNameForm" onSubmit={handleSearchSubmit}>
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
      <div className="card_container">
        <CocktailCard
          cocktails={searchedCocktails}
          page="SearchCocktails"
          handleAddCocktail={handleAddCocktail}
          addedCocktailId={addedCocktailId}
        />
      </div>
    </div>
  );
}

export default SearchCocktailName;
