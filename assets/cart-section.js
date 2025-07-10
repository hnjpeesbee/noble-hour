class CartSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.delegateEvents();
  }

  delegateEvents() {
    this.addEventListener('change', (e) => {
      if (e.target.matches('.cart-update-qty')) {
        const key = e.target.dataset.key;
        const quantity = e.target.value;
        this.updateCart(key, quantity);
      }
    });

    this.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('.qty-btn');
      if (qtyBtn) {
        const direction = qtyBtn.dataset.direction;
        const input = this.querySelector(`#${qtyBtn.dataset.inputId}`);
        if (!input) return;

        if (direction === 'up') input.stepUp();
        if (direction === 'down') input.stepDown();

        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const removeBtn = e.target.closest('.cart-remove');
      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.dataset.key;
        this.updateCart(key, 0);
      }
    });
  }

  async updateCart(itemKey, quantity) {
    const formData = new FormData();
    formData.append(`updates[${itemKey}]`, quantity);

    const response = await fetch('/cart/update.js', {
      method: 'POST',
      body: formData,
    });
    // const url = `${this.dataset.url}?section_id=${this.dataset.section}`; //test for dynamic section implementation
    // console.log('Updating cart with URL:', url); //test for dynamic section implementation
    // const sections = await fetch(url); //test for dynamic section implementation
    const sections = await fetch('/?sections=template-cart,header');
    const html = await sections.json();

    const newCartSection = new DOMParser().parseFromString(html['template-cart'], 'text/html');

    const newTableBody = newCartSection.querySelector('#cart-table-body');
    const newSubtotal = newCartSection.querySelector('#cart-subtotal');

    const currentTableBody = this.querySelector('#cart-table-body');
    const currentSubtotal = this.querySelector('#cart-subtotal');
    console.log('Updating cart section:', currentTableBody, newTableBody);
    if (newTableBody && currentTableBody) {
      currentTableBody.innerHTML = newTableBody.innerHTML;
    }

    if (newSubtotal && currentSubtotal) {
      currentSubtotal.innerHTML = newSubtotal.innerHTML;
    }

    // REPLACE THIS WITH THE CART BUBBLE COMPONENT
    const newHeader = new DOMParser()
      .parseFromString(html['header'], 'text/html');

    const newBubble = newHeader.querySelector('[data-cart-bubble]');
    const currentBubble = document.querySelector('[data-cart-bubble]');

    if (newBubble && currentBubble) {
      currentBubble.innerHTML = newBubble.innerHTML;
      currentBubble.className = newBubble.className;
    }
  }

}

customElements.define('cart-section', CartSection);
