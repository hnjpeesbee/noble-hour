class productForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this.form);
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Add to cart failed:', error);
      return;
    }

    // Optionally, you can update the cart UI here
  }
}