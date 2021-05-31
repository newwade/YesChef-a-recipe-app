import View from './View';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe uploaded successfully';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  _addHandlerShowWindow = function () {
    this._btnOpen.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  };

  _addHandlerHideWindow = function () {
    this._btnClose.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
    this._overlay.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  };

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
