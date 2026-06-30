const CART_KEY = "bebeb-drinks-cart";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function formatPrice(price) {
  return "€" + price.toFixed(2);
}

function getCartTotals(cart) {
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    totalUnits,
    totalPrice
  };
}

function renderEmptyCheckout() {
  const checkoutContent = document.getElementById("checkoutContent");

  checkoutContent.innerHTML = `
    <section class="empty-box">
      <h2>No hay productos para confirmar</h2>
      <p>
        Tu carrito está vacío en este momento. Antes de iniciar la compra,
        añade al menos una bebida desde la página de productos.
      </p>
      <div class="empty-actions">
        <a href="../../pages/productos/productos.html" class="empty-link">Ver productos</a>
      </div>
    </section>
  `;
}

function renderCheckoutStepOne() {
  const cart = getCart();
  const checkoutContent = document.getElementById("checkoutContent");

  if (cart.length === 0) {
    renderEmptyCheckout();
    return;
  }

  const { totalUnits, totalPrice } = getCartTotals(cart);

  const itemsHTML = cart.map(item => `
    <article class="checkout-item">
      <div class="checkout-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div>
        <h3 class="checkout-item-name">${item.name}</h3>
        <p class="checkout-item-meta">Precio unitario: ${formatPrice(item.price)}</p>
        <p class="checkout-item-qty">Cantidad seleccionada: ${item.quantity}</p>
      </div>

      <div class="checkout-item-total">
        ${formatPrice(item.price * item.quantity)}
      </div>
    </article>
  `).join("");

  checkoutContent.innerHTML = `
    <div class="checkout-layout">
      <section class="panel">
        <h2>Tu pedido</h2>
        <p>
          Este es el resumen previo de tu compra. Si todo está correcto,
          continúa al siguiente paso para introducir tus datos.
        </p>

        <div class="checkout-items">
          ${itemsHTML}
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

          <div class="summary-total">
            <span>Total</span>
            <span>${formatPrice(totalPrice)}</span>
          </div>
        </div>

        <p class="summary-note">
          En el siguiente paso te pediremos los datos necesarios para continuar
          con la compra.
        </p>

        <div class="summary-actions">
          <a href="../checkout-2/checkout-2.html" class="primary-btn">Continuar con tus datos</a>
          <a href="../../pages/carrito/carrito.html" class="secondary-btn">Cancelar y volver</a>
        </div>
      </aside>
    </div>
  `;
}

renderCheckoutStepOne();
