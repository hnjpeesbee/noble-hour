class VariantSelector extends HTMLElement {
    constructor() {
        super();
        this.onVariantChange = this.onVariantChange.bind(this);
    }

    connectedCallback() {
        this.addEventListener("change", this.onVariantChange);
        this.getVariantJSON(); // preload variant JSON
    }

    onVariantChange() {
        this.getSelectedOptions();
        this.getSelectedVariant();

        if (this.currentVariant) {
            this.updateURL();
            this.updateFormID();
            this.updatePrice();
        } else {
            console.warn('Variant not found for selected options:', this.options);
        }
    }

    getSelectedOptions() {
        const inputs = this.querySelectorAll('input[type="radio"]:checked');
        this.options = Array.from(inputs).map(input => input.value);
    }

    getVariantJSON() {
        if (this.variantData) return this.variantData; //if the variant data is already loaded

        const jsonScript = this.querySelector('script[type="application/json"]');
        if (!jsonScript) {
            console.error('Missing <script type="application/json"> inside <variant-selector>');
            return [];
        }

        try {
            this.variantData = JSON.parse(jsonScript.textContent);
        } catch (error) {
            console.error('Error parsing variant JSON:', error);
            this.variantData = [];
        }

        return this.variantData;
    }

    getSelectedVariant() {
        const variantJSON = this.getVariantJSON();

        this.currentVariant = variantJSON.find(variant =>
            variant.options.every(
                (option, index) => 
                this.options[index] === option //this.optios is an array from getSelectedOptions()
            )
        );
    }

    updateURL() {
        if (!this.currentVariant) return;
        const newUrl = `${this.dataset.url}?variant=${this.currentVariant.id}`;
        window.history.replaceState({}, '', newUrl);
    }

    updateFormID() {
        const form = this.closest('form');
        if (!form) return;

        const idInput = form.querySelector('input[name="id"]');
        if (idInput) {
            idInput.value = this.currentVariant.id;
        }
    }

    updatePrice() {
        if (!this.dataset.url || !this.dataset.section || !this.currentVariant?.id) return;

        const url = `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`;

        fetch(url)
        .then(response => response.text())
        .then(htmlText => {
            const html = new DOMParser().parseFromString(htmlText, 'text/html');
            const newPrice = html.getElementById(`price-${this.dataset.section}`);
            const currentPrice = document.getElementById(`price-${this.dataset.section}`);

            if (newPrice && currentPrice) {
                currentPrice.innerHTML = newPrice.innerHTML;
            }
        })
        .catch(err => console.error('Failed to update price section:', err));
    }
}

customElements.define('variant-selector', VariantSelector);
