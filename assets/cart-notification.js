class CartNotification extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.modal = this.querySelector('#cart-modal');
        this.closeBtn = this.querySelector('#cart-modal-close');
        this.itemsContainer = this.querySelector('#cart-modal-items');

        this.productForms = document.querySelectorAll('form[action="/cart/add"]');

        this.productForms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(form);

                const response = await fetch('/cart/add.js', {
                    method: 'POST',
                    body: formData
                });

                const json = await response.json();

                this.updateCartBubbleAndModal(json.key);
            });
        });

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.modal.classList.add('hidden');
            });
        }
    }

    updateCartBubbleAndModal(key) {
        fetch('/?sections=cart-notification,header')
        .then(response => response.json())
        .then(data => {
            // Update modal
            const html = data['cart-notification'];
            const dom = new DOMParser().parseFromString(html, 'text/html');
            const rawItems = dom.querySelectorAll('[data-cart-item]');
            this.itemsContainer.innerHTML = '';

            if (rawItems.length === 0) {
                this.itemsContainer.innerHTML = '<p class="text-sm text-gray-500">Your cart is empty.</p>';
            } else {
                rawItems.forEach(el => {
                    const itemKey = el.dataset.key;

                    if (itemKey === key) {
                        const itemHTML = `
                            <div class="flex items-center gap-4 border-b pb-4">
                                <img src="${el.dataset.image}" alt="${el.dataset.title}" class="w-16 h-16 object-cover rounded border">
                                <div class="flex-1">
                                <h3 class="text-sm font-medium">${el.dataset.title}</h3>
                                <p class="text-sm text-gray-500">${el.dataset.variant}</p>
                                <p class="text-sm text-gray-500">Qty: ${el.dataset.quantity}</p>
                                <p class="text-sm font-semibold">${el.dataset.price}</p>
                                </div>
                            </div>
                        `;
                        this.itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
                    }
                });
            }

            this.modal.classList.remove('hidden');
            this.modal.classList.add('flex');

            // Update cart bubble
            const headerHTML = data['header'];
            const headerDOM = new DOMParser().parseFromString(headerHTML, 'text/html');
            const newBubble = headerDOM.querySelector('[data-cart-bubble]');
            const currentBubble = this.querySelector('[data-cart-bubble]');
            if (newBubble && currentBubble) {
                currentBubble.innerHTML = newBubble.innerHTML;
            }

            setTimeout(() => {
                this.modal.classList.add('hidden');
            }, 5000);
        });
    }
}

customElements.define('cart-notification', CartNotification);
