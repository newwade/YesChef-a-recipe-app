import { model } from 'mongoose';
import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './handler';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    RESULT_PER_PAGE: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

export const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = recipe;
    // console.log(state.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes;
    state.search.page = 1;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

export const getResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RESULT_PER_PAGE;
  const end = page * RESULT_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * servings) / state.recipe.servings)
  );
  state.recipe.servings = servings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format ,Please follow the ingredient format.'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };
    state.recipe = recipe;
    addBookmark(state.recipe);
    // const data = await sendJSON(`${API_URL}`, recipe);
  } catch (err) {
    throw err;
  }
};

export const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
