class FilterDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    document.addEventListener('DOMContentLoaded', () => {
      const filterForm = document.getElementById('filter-form');
      if (!filterForm) return;

      filterForm.addEventListener('change', handleFilterChange);
    });
  }

  getSelectedFilters() {
    const filters = {};
    const selectedInputs = document.querySelectorAll('#filter-form input[type="radio"]:checked');

    selectedInputs.forEach((input) => {
      const name = input.dataset.filterName;
      const value = input.dataset.filterValue;

      if (name && value) {
        filters[name] = value;
      }
    });

    return filters;
  }

  async handleFilterChange() {
    const filters = getSelectedFilters();

    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(filters)) {
      query.append(`filter.${name}`, value);
    }

    // Add pagination params or section ID if needed
    query.append('section_id', 'your-section-id'); // Replace with actual section ID

    const res = await fetch(`${window.location.pathname}?${query.toString()}`);
    const html = await res.text();

    const newDoc = new DOMParser().parseFromString(html, 'text/html');
    const newSection = newDoc.querySelector('#product-list-container');

    const currentSection = document.querySelector('#product-list-container');
    if (newSection && currentSection) {
      currentSection.replaceWith(newSection);
    }
  }
}

customElements.define('filter-drawer', FilterDrawer);