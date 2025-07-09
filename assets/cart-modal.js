document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.getElementById('cart-modal-close');
    const itemsContainer = document.getElementById('cart-modal-items');

    
    async function setLatestCartKey(key) { //storing the key of latest cart added 
        const formData = new FormData();
        formData.append('attributes[latest_key]', key);

        await fetch('/cart/update.js', {
            method: 'POST',
            body: formData
        });
    }

    function showCartModal() {
        fetch('/?sections=cart-modal')
            .then(res => res.json())
            .then(data => {
                const html = data['cart-modal'];
                const dom = new DOMParser().parseFromString(html, 'text/html');
                const rawItems = dom.querySelectorAll('[data-cart-item]');
                itemsContainer.innerHTML = '';

                if (rawItems.length === 0) {
                    itemsContainer.innerHTML = '<p class="text-sm text-gray-500">Your cart is empty.</p>';
                } else {
                    rawItems.forEach(el => {
                        const itemHTML = `
              <div class="flex items-center gap-4 border-b pb-4">
                <img src="${el.dataset.image}" alt="${el.dataset.title}" class="w-16 h-16 object-cover rounded border">
                <div class="flex-1">
                  <h3 class="text-sm font-medium">${el.dataset.title}</h3>
                  <p class="text-sm text-gray-500">Qty: ${el.dataset.quantity}</p>
                  <p class="text-sm font-semibold">${el.dataset.price}</p>
                </div>
              </div>
            `;
                        itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
                    });
                }

                modal.classList.remove('hidden');
                modal.classList.add('flex');

            });
    }

    const productForms = document.querySelectorAll('form[action="/cart/add"]');
    productForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData
            });

            const json = await response.json();

            await setLatestCartKey(json.key); // for the latest product added

            showCartModal();
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});