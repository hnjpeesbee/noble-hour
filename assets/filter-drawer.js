class FilterDrawer extends HTMLElement {
  constructor() {
    super();
    this.debounceTimer = null;
  }

  connectedCallback() {
    this.form = this.querySelector('#filter-drawer-form');
    this.detailGroups = this.querySelectorAll('details');

    this.addEventListener('change', (event) => {
      if (event.target.matches('.filter-check')) {
        this.dispatchFilterChange();
      }
    });

    this.addEventListener('click', (event) => {
      if (event.target.matches('.clear-filter')) {
        this.clearAllFilters();
      }

        this.dispatchFilterChange();
    });

    this.form.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.dispatchFilterChange();
        }, 400);
      });
    });
  }

  dispatchFilterChange() {
    const formData = new FormData(this.form);
    
    this.dispatchEvent(new CustomEvent('filters:changed', {
      bubbles: true,
      detail: { formData }
    }));
    
    this.applyFilterBubble();
  }

  clearAllFilters() {
    this.form.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
      input.checked = false;
      // Remove filter bubble if it exists
      const bubble = input.querySelector('.filter-bubble');
      if (bubble) bubble.remove();
    });
  }

  applyFilterBubble() {

    this.detailGroups.forEach(detail => {
      const checkedCount = detail.querySelectorAll('input[type="checkbox"]:checked').length;
      const bubble = detail.querySelector('.filter-bubble');
      const labelContainer = detail.querySelector('.filter-label')?.parentElement;

      if (checkedCount > 0) {
        if (bubble) {
          bubble.textContent = checkedCount;
        } else if (labelContainer) {
          const span = document.createElement('span');
          span.className = 'filter-bubble text-xs bg-black text-white rounded-full px-2 py-0.5';
          span.textContent = checkedCount;
          labelContainer.appendChild(span);
        }
      } else if (bubble) {
        bubble.remove();
      }
    });
  }

}

customElements.define('filter-drawer', FilterDrawer);