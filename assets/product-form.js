class ProductForm extends HTMLElement {
  constructor() {
    super();
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