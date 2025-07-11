class CartBubble extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.updateCartCount();
  }

  updateCartCount() {
    fetch('/?sections=header')
    .then(response => response.json())
    .then(data => {
      const html = data['header'];
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      
      const newBubble = parsed.querySelector('#cart-bubble');
      const currentBubble = this.querySelector('#cart-bubble');

      if (newBubble && currentBubble) {
        currentBubble.innerHTML = newBubble.innerHTML;
      } else {
        console.warn('Cart bubble element not found.');
      }
    })
    .catch(error => {
      console.error('Error updating cart bubble:', error);
    });
  }
}

customElements.define('cart-bubble', CartBubble);