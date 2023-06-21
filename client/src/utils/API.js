// make a search to 'TheCocktailDB' api
// url to search for a cocktail by name: www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita
export const searchCocktails = async (query) => {
  console.log(
    `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
  );
  try {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (err) {
    console.error("Error fetching cocktail data: ", err);
    throw err;
  }
};

export const getRandomCocktail = async () => {
  try {
    const response = await fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (err) {
    console.error("Error fetching cocktail data: ", err);
    throw err;
  }
};

export const getCocktailsbyIngredient = async (ingredient) => {
  try {
    console.log('searching by ingredient', ingredient);
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    // const searchResults = await response.json();
    // console.log(searchResults.drinks[0]);

    return response;
  } catch (err) {
    console.error("Error fetching cocktail data: ", err);
    throw err;
  }
};
