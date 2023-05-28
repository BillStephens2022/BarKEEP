// make a search to 'TheCocktailDB' api
// url to search for a cocktail by name: www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita
export const searchCocktails = (query) => {
    return fetch(`www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
};