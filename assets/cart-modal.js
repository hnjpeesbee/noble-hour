function showCartModal() {
  fetch('/?sections=cart-modal')
    .then(res => res.json()) // ← PARSE JSON!
    .then(data => {
      const html = data['cart-modal']; // ← Extract HTML string
      const dom = new DOMParser().parseFromString(html, 'text/html');
      const rawItems = dom.querySelectorAll('[data-cart-item]');
      const itemsContainer = document.getElementById('cart-modal-items');
      const modal = document.getElementById('cart-modal');

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