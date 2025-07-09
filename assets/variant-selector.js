class VariantSelector extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("change", this.onVariantChange);
    }
    onVariantChange() {
        this.getSelectedOptions();
        this.getSelectedVariant();

        if(this.currentVariant) {
            this.updateURL();
            this.updateFormID();
            this.updatePrice();
        }
    }

    getSelectedOptions() {
        const inputs = this.querySelectorAll('input[type="radio"]:checked');
        this.options = Array.from(inputs).map(input => input.value);
        console.log(this.options);
    }

    getVariantJSON() {
        const selects = this.querySelector('script[type="application/json"]');
        this.variantData = this.variantData || JSON.parse(selects.textContent);
        return this.variantData;
    }

    getSelectedVariant() {
        const variantJSON = this.getVariantJSON();

        this.currentVariant = variantJSON.find((variant) => {
            // Check if all selected options match the variant options
            return variant.options.every((option, index) => {
                return this.options[index] === option;
            });
        });

        console.log(this.currentVariant);
    }

    updateURL() {
        if(!this.currentVariant) return;
        window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateFormID() {
        const form = document.getElementById("product-form");
        const input = form.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
    }

    updatePrice() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
        .then((response) => response.text())
        .then((responseText) => {
            const id = `price-${this.dataset.section}`;
            const html = new DOMParser().parseFromString(responseText, 'text/html');

            const oldPrice = document.getElementById(id);
            const newPrice = html.getElementById(id);

            if(oldPrice && newPrice) oldPrice.innerHTML = newPrice.innerHTML;
        });
    }
}

customElements.define('variant-selector', VariantSelector);