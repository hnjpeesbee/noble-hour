class FilterGrid extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.searchPage = this.hasAttribute('data-search');

    this.addEventListener('filters:changed', e => {
      const formData = e.detail.formData;
      this.handleFilterChange(formData);
    });

    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      this.queryInput = urlParams.get('q');
    });
  }

  async handleFilterChange(formData) {
    const params = new URLSearchParams(formData);

    const sectionId = this.dataset.sectionId;
    params.set('section_id', sectionId);
    
    const url = this.getUrl(window.location.pathname, params);
    
    try {
      const response = await fetch(url);
      const text = await response.text();

      const newDocument = new DOMParser().parseFromString(text, 'text/html');
      const newGridList = newDocument.querySelector('#product-list-container');
      const currentGridList = this.querySelector('#product-list-container');
      
      if (newGridList && currentGridList) {
        currentGridList.replaceWith(newGridList);
      }

      //for applying the correct url and when a user bookmarked it, it will be saved as they filtered.
      const uiUrlParams = new URLSearchParams(params);
      uiUrlParams.delete('section_id'); // the original url is only for section rendering, when accidentally reload, the ui breaks

      const uiUrl = this.getUrl(window.location.pathname, uiUrlParams);
      window.history.replaceState({}, '', uiUrl);
    } catch (error) {
      console.error('Filter fetch failed:', error);
    }
  }

  getUrl(path, params) {
    let url = `${path}?${params.toString()}`;

    if (this.searchPage) {
      url = `${path}?q=${this.queryInput}&${params.toString()}`;
    }

    return url;
  }
}

customElements.define('filter-grid', FilterGrid);