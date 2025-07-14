class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.debounceTimer = null;
  }

  connectedCallback() {
    this.input = this.querySelector('input[name="q"]');
    this.resultsContainer = document.querySelector('#product-list-container');

    this.input.addEventListener('keyup', (event) => {
      event.preventDefault();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performSearch(this.input.value.trim());
      }, 300); // Debounce to prevent rapid firing
    });
  }

  async performSearch(query) {
    if (!query) return;

    const params = new URLSearchParams({
      q: query,
      section_id: 'main-search-results'
    });

    const filterComponent = document.querySelector('filter-grid');
    const url = `${window.location.pathname}?${params}`;

    try {
      const response = await fetch(url);
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const newResults = doc.querySelector('#product-list-container');

      const uiUrl = new URLSearchParams(params);
      uiUrl.delete('section_id');
      window.history.replaceState({}, '', `${window.location.pathname}?${uiUrl}`);

      if (newResults && this.resultsContainer) {
        this.resultsContainer.replaceWith(newResults);
        this.resultsContainer = newResults; // update reference
      }
    } catch (error) {
      console.error('Live search failed:', error);
    }
  }

}

customElements.define('search-form', SearchForm);