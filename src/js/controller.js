import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_TIMEOUT } from './config.js';
import * as model from './model.js';
import RecipeView from './view/recipeView.js';
import SearchView from './view/searchView.js';
import ResultView from './view/resultView.js';
import BookmarkView from './view/bookmarkView.js';
import PaginationView from './view/paginationView';
import AddRecipeView from './view/addRecipeView.js';
import addRecipeView from './view/addRecipeView.js';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
const handleFetchApi = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    RecipeView.renderSpinner();
    ResultView.update(model.getResultPage());
    // debugger;
    BookmarkView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    // console.log(model.state.recipe);
    RecipeView.render(model.state.recipe);
  } catch (err) {
    // console.error('err', err);
    RecipeView.renderError(err);
  }
};

const handleSearchResults = async function () {
  try {
    ResultView.renderSpinner();
    const query = SearchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    // console.log('result', model.state.search.results);
    // ResultView.render(model.state.search.results);
    ResultView.render(model.getResultPage());
    PaginationView.render(model.state.search);
  } catch (error) {
    // console.log(error);
    ResultView.renderError(error);
  }
};
const paginationController = function (nextPage) {
  // console.log('page', nextPage);
  ResultView.render(model.getResultPage(nextPage));
  PaginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // console.log('bookmark', model.state.recipe);
  RecipeView.update(model.state.recipe);
  BookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  BookmarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    RecipeView.render(model.state.recipe);
    BookmarkView.render(model.state.bookmarks);
    AddRecipeView.renderMessage();
    // setTimeout(() => {
    //   AddRecipeView.toogle();
    // }, MODAL_CLOSE_TIMEOUT);
  } catch (err) {
    // console.log(err.message);
    AddRecipeView.renderError(err.message);
  }
};
export const clearStorage = function () {
  localStorage.removeItem('bookmark');
};
const init = function () {
  BookmarkView.addHandlerRender(controlBookmark);
  AddRecipeView.addHandlerUpload(controlUploadRecipe);
  RecipeView.addHandler(handleFetchApi);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(handleSearchResults);
  PaginationView.addHandlerPagination(paginationController);
};
init();
