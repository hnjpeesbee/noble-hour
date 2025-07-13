class FilterGrid extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('filters:changed', e => {
      const formData = e.detail.formData;
      this.handleFilterChange(formData);
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

      const uiUrlParams = new URLSearchParams(params);
      uiUrlParams.delete('section_id'); // the original url is only for section rendering, when accidentally reload, the ui breaks

      const uiUrl = this.getUrl(window.location.pathname, uiUrlParams);
      window.history.replaceState({}, '', uiUrl);
    } catch (error) {
      console.error('Filter fetch failed:', error);
    }
  }

  getUrl(path, params) {
    const url = `${path}?${params.toString()}`;
    return url;
  }
}

customElements.define('filter-grid', FilterGrid);