class SearchView {
  _parentElement = document.querySelector('.search');

  clearSearchValue() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this.clearSearchValue();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
