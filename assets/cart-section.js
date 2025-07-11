class CartSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.delegateEvents();
    this.cartBubble = document.querySelector('cart-bubble');
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

    await fetch('/cart/update.js', {
      method: 'POST',
      body: formData,
    });

    const currentCartSection = document.querySelector('cart-section');

    const response = await fetch('/?sections=template-cart');
    const data = await response.json();

    const newCartDOM = new DOMParser().parseFromString(data['template-cart'], 'text/html');
    const newCartSection = newCartDOM.querySelector('cart-section');
    const emptyCartFallback = newCartDOM.querySelector('[data-cart-empty]');

    if (newCartSection) {
      currentCartSection.replaceWith(newCartSection);

      // Re-upgrade to attach JS behavior again after replaceWith
      customElements.upgrade(newCartSection);
    } else if (emptyCartFallback) {
      currentCartSection.replaceWith(emptyCartFallback);
    } else {
      console.warn('⚠️ Could not find cart-section or empty fallback in new HTML.');
    }

    // Update cart bubble after rendering
    this.cartBubble?.updateCartCount();
  }



}

customElements.define('cart-section', CartSection);
