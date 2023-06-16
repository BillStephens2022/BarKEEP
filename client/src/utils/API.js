// make a search to 'TheCocktailDB' api
// url to search for a cocktail by name: www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita
export const searchCocktails = async (query) => {
  console.log(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error('Error fetching cocktail data: ', err);
    throw err;
  }
};