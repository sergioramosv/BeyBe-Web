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

function generateOrderNumber() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return "BB-" + randomNumber;
}

function createFreshOrderSnapshot(cart, customerData) {
  const totals = getCartTotals(cart);
  const orderNumber = generateOrderNumber();

  const snapshot = {
    orderNumber: orderNumber,
    cart: cart,
    customerData: customerData,
    totalUnits: totals.totalUnits,
    totalPrice: totals.totalPrice
  };

  localStorage.setItem(ORDER_NUMBER_KEY, orderNumber);
  localStorage.setItem(ORDER_SNAPSHOT_KEY, JSON.stringify(snapshot));

  return snapshot;
}

function clearCartAfterConfirmation() {
  localStorage.removeItem(CART_KEY);
}

function renderInvalidAccess() {
  const confirmationContent = document.getElementById("confirmationContent");

  if (!confirmationContent) {
    return;
  }

  confirmationContent.innerHTML = `
    <section class="empty-box">
      <h2>No hay una confirmación disponible</h2>
      <p>
        Esta página se muestra después de confirmar un pedido.
        Vuelve a la tienda para continuar con la compra.
      </p>
      <div class="empty-actions">
        <a href="../../pages/productos/productos.html" class="empty-link">Ir a productos</a>
      </div>
    </section>
  `;
}

function renderCheckoutStepFour() {
  const confirmationContent = document.getElementById("confirmationContent");
  const isConfirmed = localStorage.getItem(ORDER_CONFIRMED_KEY);
  const cart = getCart();
  const customerData = getSavedCheckoutData();
  const storedSnapshot = localStorage.getItem(ORDER_SNAPSHOT_KEY);

  let snapshot = null;

  if (!confirmationContent) {
    return;
  }

  if (isConfirmed === "true") {
    if (cart.length === 0) {
      renderInvalidAccess();
      return;
    }

    snapshot = createFreshOrderSnapshot(cart, customerData);
    clearCartAfterConfirmation();
    localStorage.removeItem(ORDER_CONFIRMED_KEY);
  } else if (storedSnapshot) {
    snapshot = JSON.parse(storedSnapshot);
  } else {
    renderInvalidAccess();
    return;
  }

  const customerEmail = snapshot.customerData && snapshot.customerData.email
    ? snapshot.customerData.email
    : "tu correo electrónico";

  const customerName = snapshot.customerData
    ? ((snapshot.customerData.nombre || "") + " " + (snapshot.customerData.apellidos || "")).trim()
    : "";

  const customerAddress = snapshot.customerData && snapshot.customerData.direccion
    ? snapshot.customerData.direccion
    : "-";

  const customerCity = snapshot.customerData && snapshot.customerData.ciudad
    ? snapshot.customerData.ciudad
    : "";

  const customerPostal = snapshot.customerData && snapshot.customerData.codigoPostal
    ? snapshot.customerData.codigoPostal
    : "";

  const customerPhone = snapshot.customerData && snapshot.customerData.telefono
    ? snapshot.customerData.telefono
    : "-";

  const summaryItemsHTML = snapshot.cart.map(function(item) {
    return `
      <div class="summary-item">
        <div class="summary-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>

        <div class="summary-item-info">
          <strong>${item.name}</strong>
          <span class="summary-item-meta">Cantidad: ${item.quantity}</span>
        </div>

        <div class="summary-item-price">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `;
  }).join("");

  confirmationContent.innerHTML = `
    <section class="confirmation-card">
      <div class="confirmation-head">
        <p class="eyebrow">Pedido completado</p>
        <h1 class="title">Gracias por tu compra</h1>
        <p class="intro">
          Hemos recibido correctamente tu pedido. En breve recibirás un correo de confirmación
          en <strong>${customerEmail}</strong> con el resumen de la compra.
        </p>
      </div>

      <div class="success-box">
        <div class="success-icon">✓</div>

        <div class="success-text">
          <h2>Pedido confirmado</h2>
          <p>
            Tu pedido ha quedado registrado con el número
            <strong>${snapshot.orderNumber}</strong>. Conserva esta referencia por si necesitas consultarnos algo más adelante.
          </p>
        </div>
      </div>

      <div class="confirmation-layout">
        <section class="panel">
          <h3>Detalles del pedido</h3>
          <p>
            Este es el resumen final de la compra y los datos principales asociados al pedido.
          </p>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Número de pedido</span>
              <span class="info-value">${snapshot.orderNumber}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Cliente</span>
              <span class="info-value">${customerName || "-"}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Correo</span>
              <span class="info-value">${customerEmail}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Teléfono</span>
              <span class="info-value">${customerPhone}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Entrega</span>
              <span class="info-value">
                ${customerAddress}<br>
                ${customerCity} ${customerPostal}
              </span>
            </div>

            <div class="info-row">
              <span class="info-label">Siguiente paso</span>
              <span class="info-value">
                Recibirás un correo de confirmación y, más adelante, la información del envío.
              </span>
            </div>
          </div>

          <div class="final-actions">
            <a href="../../index.html" class="primary-btn">Volver al inicio</a>
            <a href="../../pages/productos/productos.html" class="secondary-btn">Seguir comprando</a>
          </div>
        </section>

        <aside class="summary-box">
          <h3>Resumen final</h3>

          <div class="summary-lines">
            <div class="summary-line">
              <span>Productos distintos</span>
              <span>${snapshot.cart.length}</span>
            </div>

            <div class="summary-line">
              <span>Unidades totales</span>
              <span>${snapshot.totalUnits}</span>
            </div>

            <div class="summary-total">
              <span>Total</span>
              <span>${formatPrice(snapshot.totalPrice)}</span>
            </div>
          </div>

          <div class="summary-items">
            ${summaryItemsHTML}
          </div>

          <p class="summary-note">
            Esta pantalla sirve como cierre visual del pedido. Más adelante podrás conectar
            el envío real del correo y la confirmación de pago automática.
          </p>
        </aside>
      </div>
    </section>
  `;
}

renderCheckoutStepFour();
