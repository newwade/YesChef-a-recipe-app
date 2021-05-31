import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.RESULT_PER_PAGE
    );
    if (currPage === 1 && numPages > 1) {
      return `
      <button data-goto=${
        currPage + 1
      } class="btn--inline pagination__btn--next">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            <span>Page ${currPage + 1}</span>
        </button>
      `;
    }
    if (currPage === numPages && numPages > 1) {
      return `<button data-goto=${
        currPage - 1
      } class="btn--inline pagination__btn--prev">
            <span>Page ${currPage - 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
          </button>`;
    }
    if (currPage < numPages) {
      return `
       <button data-goto=${
         currPage + 1
       } class="btn--inline pagination__btn--next">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            <span>Page ${currPage + 1}</span>
        </button>

      <button data-goto=${
        currPage - 1
      } class="btn--inline pagination__btn--prev">
            <span>Page ${currPage - 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
          </button>`;
    }
    return '';
  }
}

export default new PaginationView();
