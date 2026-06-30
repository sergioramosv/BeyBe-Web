const CART_KEY = "bebeb-drinks-cart";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
  return "€" + price.toFixed(2);
}

function updateCartCount() {
  const cart = getCart();
  const distinctProducts = cart.length;
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = distinctProducts;
  }
}

function getCartTotals(cart) {
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    totalUnits,
    totalPrice
  };
}

function changeItemQuantity(productId, amount) {
  const cart = getCart();
  const product = cart.find(item => item.id === productId);

  if (!product) return;

  product.quantity += amount;

  if (product.quantity <= 0) {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
  } else {
    saveCart(cart);
  }

  renderCart();
}

function removeItem(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  renderCart();
}

function renderEmptyCart() {
  const cartContent = document.getElementById("cartContent");

  cartContent.innerHTML = `
    <section class="empty-box">
      <h2>Tu carrito está vacío</h2>
      <p>
        Aún no hay productos añadidos. Cuando selecciones bebidas desde la página de productos,
        aparecerán aquí con sus cantidades y su importe correspondiente.
      </p>
      <div class="empty-actions">
        <a href="../productos/productos.html" class="empty-link">Ver productos</a>
      </div>
    </section>
  `;
}

function renderCart() {
  const cart = getCart();
  const cartContent = document.getElementById("cartContent");

  updateCartCount();

  if (cart.length === 0) {
    renderEmptyCart();
    return;
  }

  const { totalUnits, totalPrice } = getCartTotals(cart);

  const cartItemsHTML = cart.map(item => `
    <article class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div>
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-meta">Precio unitario: ${formatPrice(item.price)}</p>
        <p class="cart-item-unit">Precio por lata</p>

        <div class="item-controls">
          <div class="quantity-selector">
            <button type="button" onclick="changeItemQuantity('${item.id}', -1)">−</button>
            <input type="number" value="${item.quantity}" min="1" readonly>
            <button type="button" onclick="changeItemQuantity('${item.id}', 1)">+</button>
          </div>

          <button class="remove-btn" type="button" onclick="removeItem('${item.id}')">
            Eliminar
          </button>
        </div>
      </div>

      <div class="item-total">
        ${formatPrice(item.price * item.quantity)}
      </div>
    </article>
  `).join("");

  cartContent.innerHTML = `
    <div class="cart-layout">
      <section class="cart-box">
        <h2>Productos añadidos:</h2>
        <div class="cart-items">
          ${cartItemsHTML}
        </div>
      </section>

      <aside class="summary-box">
        <h2>Resumen</h2>

        <div class="summary-lines">
          <div class="summary-line">
            <span>Productos distintos</span>
            <span>${cart.length}</span>
          </div>

          <div class="summary-line">
            <span>Unidades totales</span>
            <span>${totalUnits}</span>
          </div>

          <div class="summary-line">
            <span>Precio por lata</span>
            <span>€3.30</span>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>${formatPrice(totalPrice)}</span>
          </div>
        </div>

        <p class="summary-note">
          Todos los productos activos están configurados actualmente a €3.30 por lata.
          Puedes ajustar cantidades antes de pasar a la siguiente fase de compra.
        </p>

        <div class="summary-actions">
          <a href="../../checkout/checkout-1/checkout-1.html" class="primary-btn" style="display:inline-flex;align-items:center;justify-content:center;">
            CONTINUAR
          </a>
          <button class="secondary-btn" type="button" onclick="clearCart()">
            VACIAR CARRITO
          </button>
        </div>
      </aside>
    </div>
  `;
}

renderCart();
