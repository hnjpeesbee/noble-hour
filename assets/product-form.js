class ProductForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.getMediaIdByVariantId();
    this.selectVariantImage(this.mediaId);

    this.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.triggerCartNotification();
    });
  }

  async triggerCartNotification() {
    const cartNotification = document.querySelector('cart-notification');
    await cartNotification.addToCart();
  }

  getMediaIdByVariantId() {
    const variantSelector = document.querySelector('variant-selector');
    variantSelector.getSelectedOptions(); // Ensure options are set, required for getSelectedVariant()
    const cartItemVariant = variantSelector.getSelectedVariant(); // Ensure options are set

    this.mediaId = cartItemVariant.featured_media?.id || null;
  }

  selectVariantImage(mediaId) {
    const pageMedia = this.querySelector('#product-page-media');

    if (!pageMedia) {
      console.error('Product image element not found');
      return;
    }

    // Hide all media
    const allMedia = pageMedia.querySelectorAll('.product-media');
    allMedia.forEach(el => el.classList.add('hidden'));

    // Show the one that matches
    const activeMedia = pageMedia.querySelector(`[data-media-id="${mediaId}"]`);
    
    if (activeMedia) {
      activeMedia.classList.remove('hidden');
    } else {
      console.warn(`No media found with ID: ${mediaId}`);
    }
  }
}

customElements.define('product-form', ProductForm);