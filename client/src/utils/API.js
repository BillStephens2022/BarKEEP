const formatCocktailData = (cocktail) => {
  const ingredients = [];
  const tags = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const quantity = cocktail[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({ name: ingredient, quantity: quantity });
      tags.push(ingredient);
    } else {
      break;
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
};

export const searchCocktails = async (query) => {
  try {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const searchResults = await response.json();
    const cocktailData = searchResults.drinks.map(formatCocktailData);
    return cocktailData;
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

    const randomCocktail = await response.json();
    const cocktailData = randomCocktail.drinks.map(formatCocktailData);
    return cocktailData;
  } catch (err) {
    console.error("Error fetching cocktail data: ", err);
    throw err;
  }
};

export const getCocktailsbyIngredient = async (ingredient) => {
  try {
    console.log("searching by ingredient", ingredient);
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const searchResults = await response.json();
    const cocktailData = searchResults.drinks.map(formatCocktailData);
    return cocktailData;
  } catch (err) {
    console.error("Error fetching cocktail data: ", err);
    throw err;
  }
};
