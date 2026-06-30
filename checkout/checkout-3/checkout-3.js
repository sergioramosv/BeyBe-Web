const CART_KEY = "bebeb-drinks-cart";
const CHECKOUT_DATA_KEY = "bebeb-drinks-checkout-data";
const ORDER_CONFIRMED_KEY = "bebeb-drinks-order-confirmed";
const ORDER_NUMBER_KEY = "bebeb-drinks-order-number";
const ORDER_SNAPSHOT_KEY = "bebeb-drinks-order-snapshot";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function getSavedCheckoutData() {
  const savedData = localStorage.getItem(CHECKOUT_DATA_KEY);
  return savedData ? JSON.parse(savedData) : {};
}

function formatPrice(price) {
  return "€" + price.toFixed(2);
}

function getCartTotals(cart) {
  const totalUnits = cart.reduce(function(sum, item) {
    return sum + item.quantity;
  }, 0);

  const totalPrice = cart.reduce(function(sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);

  return {
    totalUnits: totalUnits,
    totalPrice: totalPrice
  };
}

function renderEmptyCheckout(message, linkHref, linkText) {
  const checkoutContent = document.getElementById("checkoutContent");

  if (!checkoutContent) {
    return;
  }

  checkoutContent.innerHTML = `
    <section class="empty-box">
      <h2>No se puede continuar</h2>
      <p>${message}</p>
      <div class="empty-actions">
        <a href="${linkHref}" class="empty-link">${linkText}</a>
      </div>
    </section>
  `;
}

function renderCheckoutStepThree() {
  const cart = getCart();
  const savedData = getSavedCheckoutData();
  const checkoutContent = document.getElementById("checkoutContent");

  if (!checkoutContent) {
    return;
  }

  if (cart.length === 0) {
    renderEmptyCheckout(
      "Tu carrito está vacío. Antes de confirmar un pedido, necesitas añadir productos.",
      "../../pages/productos/productos.html",
      "Ver productos"
    );
    return;
  }

  if (!savedData.nombre || !savedData.email || !savedData.direccion) {
    renderEmptyCheckout(
      "Faltan datos del cliente. Vuelve al paso anterior para completar la información de entrega.",
      "../checkout-2/checkout-2.html",
      "Ir al paso 2"
    );
    return;
  }

  const totals = getCartTotals(cart);

  const summaryItemsHTML = cart.map(function(item) {
    return `
      <div class="summary-item">
        <span><strong>${item.name}</strong> × ${item.quantity}</span>
        <span>${formatPrice(item.price * item.quantity)}</span>
      </div>
    `;
  }).join("");

  const checkoutItemsHTML = cart.map(function(item) {
    return `
      <div class="review-row">
        <span class="review-label">${item.name}</span>
        <span class="review-value">
          ${item.quantity} unidad(es) · ${formatPrice(item.price * item.quantity)}
        </span>
      </div>
    `;
  }).join("");

  checkoutContent.innerHTML = `
    <div class="checkout-layout">
      <section class="panel">
        <div class="review-section">
          <h2>Datos del pedido</h2>
          <p>
            Revisa toda la información antes de confirmar la compra.
            Después pasaremos a la pantalla final de confirmación.
          </p>

          <div class="review-grid">
            ${checkoutItemsHTML}
          </div>
        </div>

        <div class="review-section">
          <h3 class="box-title">Datos de entrega</h3>

          <div class="review-grid">
            <div class="review-row">
              <span class="review-label">Cliente</span>
              <span class="review-value">${savedData.nombre} ${savedData.apellidos || ""}</span>
            </div>

            <div class="review-row">
              <span class="review-label">Correo</span>
              <span class="review-value">${savedData.email}</span>
            </div>

            <div class="review-row">
              <span class="review-label">Teléfono</span>
              <span class="review-value">${savedData.telefono || "-"}</span>
            </div>

            <div class="review-row">
              <span class="review-label">Dirección</span>
              <span class="review-value">
                ${savedData.direccion}<br>
                ${savedData.ciudad || ""} ${savedData.codigoPostal || ""}
              </span>
            </div>

            <div class="review-row">
              <span class="review-label">Notas</span>
              <span class="review-value">${savedData.notas ? savedData.notas : "Sin indicaciones adicionales"}</span>
            </div>
          </div>
        </div>

        <div class="review-section">
          <h3 class="box-title">Pago</h3>
          <p>
            Esta versión muestra un checkout visual estático. Más adelante podrás decidir
            si quieres integrar pago real, transferencia, contacto directo o confirmación manual.
          </p>

          <div class="payment-box">
            <div class="payment-method">
              <span class="payment-name">Tarjeta bancaria</span>
              <span class="payment-badge">Disponible</span>
            </div>

            <div class="payment-method">
              <span class="payment-name">Transferencia bancaria</span>
              <span class="payment-badge">Próximamente</span>
            </div>

            <div class="payment-method">
              <span class="payment-name">Confirmación manual</span>
              <span class="payment-badge">Visual</span>
            </div>
          </div>

          <div class="trust-box">
            <p class="trust-title">Señales de confianza</p>
            <div class="trust-list">
              <p>Resumen claro de productos, cantidades y total.</p>
              <p>Posibilidad de volver atrás y corregir datos.</p>
              <p>Última revisión antes de confirmar el pedido.</p>
            </div>
          </div>
        </div>

        <div class="review-actions">
          <a href="../checkout-2/checkout-2.html" class="secondary-btn">Volver a tus datos</a>
          <button id="confirmOrderBtn" class="primary-btn" type="button">Confirmar pedido</button>
        </div>

        <div class="review-cancel">
          <a href="../../pages/carrito/carrito.html" class="cancel-link">Cancelar compra</a>
        </div>
      </section>

      <aside class="summary-box">
        <h2>Resumen final</h2>

        <div class="summary-lines">
          <div class="summary-line">
            <span>Productos distintos</span>
            <span>${cart.length}</span>
          </div>

          <div class="summary-line">
            <span>Unidades totales</span>
            <span>${totals.totalUnits}</span>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>${formatPrice(totals.totalPrice)}</span>
          </div>
        </div>

        <div class="summary-items">
          ${summaryItemsHTML}
        </div>

        <p class="summary-note">
          Al confirmar, pasarás a la pantalla final del pedido.
        </p>
      </aside>
    </div>
  `;

  const confirmOrderBtn = document.getElementById("confirmOrderBtn");

  if (!confirmOrderBtn) {
    return;
  }

  confirmOrderBtn.addEventListener("click", function() {
    localStorage.removeItem(ORDER_SNAPSHOT_KEY);
    localStorage.removeItem(ORDER_NUMBER_KEY);
    localStorage.setItem(ORDER_CONFIRMED_KEY, "true");
    window.location.href = "../checkout-4/checkout-4.html";
  });
}

renderCheckoutStepThree();
