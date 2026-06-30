const CART_KEY = "bebeb-drinks-cart";
const CHECKOUT_DATA_KEY = "bebeb-drinks-checkout-data";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function getSavedCheckoutData() {
  const savedData = localStorage.getItem(CHECKOUT_DATA_KEY);
  return savedData ? JSON.parse(savedData) : {};
}

function saveCheckoutData(data) {
  localStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(data));
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

function renderEmptyCheckout() {
  const checkoutContent = document.getElementById("checkoutContent");

  checkoutContent.innerHTML = `
    <section class="empty-box">
      <h2>No hay productos en tu pedido</h2>
      <p>
        Tu carrito está vacío en este momento. Antes de rellenar tus datos,
        necesitas añadir al menos una bebida al pedido.
      </p>
      <div class="empty-actions">
        <a href="../../pages/productos/productos.html" class="empty-link">Ver productos</a>
      </div>
    </section>
  `;
}

function validateCheckoutForm(data) {
  return (
    data.nombre.trim() !== "" &&
    data.apellidos.trim() !== "" &&
    data.email.trim() !== "" &&
    data.telefono.trim() !== "" &&
    data.direccion.trim() !== "" &&
    data.ciudad.trim() !== "" &&
    data.codigoPostal.trim() !== ""
  );
}

function renderCheckoutStepTwo() {
  const cart = getCart();
  const checkoutContent = document.getElementById("checkoutContent");

  if (!checkoutContent) {
    return;
  }

  if (cart.length === 0) {
    renderEmptyCheckout();
    return;
  }

  const savedData = getSavedCheckoutData();
  const totals = getCartTotals(cart);

  const summaryItemsHTML = cart.map(function(item) {
    return `
      <div class="summary-item">
        <span><strong>${item.name}</strong> × ${item.quantity}</span>
        <span>${formatPrice(item.price * item.quantity)}</span>
      </div>
    `;
  }).join("");

  checkoutContent.innerHTML = `
    <div class="checkout-layout">
      <section class="panel">
        <h2>Información de entrega</h2>
        <p>
          Introduce los datos básicos para continuar con el pedido.
          En el siguiente paso revisaremos el checkout final.
        </p>

        <form id="checkoutForm" class="checkout-form">
          <div class="form-grid">
            <div class="field">
              <label for="nombre">Nombre</label>
              <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" value="${savedData.nombre || ""}">
            </div>

            <div class="field">
              <label for="apellidos">Apellidos</label>
              <input type="text" id="apellidos" name="apellidos" placeholder="Tus apellidos" value="${savedData.apellidos || ""}">
            </div>

            <div class="field">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="ejemplo@email.com" value="${savedData.email || ""}">
            </div>

            <div class="field">
              <label for="telefono">Teléfono</label>
              <input type="tel" id="telefono" name="telefono" placeholder="+34 600 000 000" value="${savedData.telefono || ""}">
            </div>

            <div class="field full">
              <label for="direccion">Dirección</label>
              <input type="text" id="direccion" name="direccion" placeholder="Calle, número, piso..." value="${savedData.direccion || ""}">
            </div>

            <div class="field">
              <label for="ciudad">Ciudad</label>
              <input type="text" id="ciudad" name="ciudad" placeholder="Ciudad" value="${savedData.ciudad || ""}">
            </div>

            <div class="field">
              <label for="codigoPostal">Código postal</label>
              <input type="text" id="codigoPostal" name="codigoPostal" placeholder="28000" value="${savedData.codigoPostal || ""}">
            </div>

            <div class="field full">
              <label for="notas">Notas del pedido (opcional)</label>
              <textarea id="notas" name="notas" placeholder="Añade aquí cualquier indicación extra para el pedido...">${savedData.notas || ""}</textarea>
              <p class="field-note">
                Este campo es opcional. Úsalo solo si necesitas añadir una observación.
              </p>
            </div>
          </div>

          <div id="formError" class="form-error">
            Por favor, completa todos los campos obligatorios antes de continuar.
          </div>

          <div class="form-actions">
            <a href="../checkout-1/checkout-1.html" class="secondary-btn">Volver al paso 1</a>
            <button type="submit" class="primary-btn">Continuar al pago</button>
          </div>
        </form>
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
          Tus datos se guardan en este navegador para que no los pierdas si retrocedes dentro del proceso.
        </p>
      </aside>
    </div>
  `;

  const checkoutForm = document.getElementById("checkoutForm");
  const formError = document.getElementById("formError");

  if (!checkoutForm) {
    return;
  }

  checkoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = {
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      email: document.getElementById("email").value,
      telefono: document.getElementById("telefono").value,
      direccion: document.getElementById("direccion").value,
      ciudad: document.getElementById("ciudad").value,
      codigoPostal: document.getElementById("codigoPostal").value,
      notas: document.getElementById("notas").value
    };

    if (!validateCheckoutForm(formData)) {
      if (formError) {
        formError.classList.add("is-visible");
      }
      return;
    }

    if (formError) {
      formError.classList.remove("is-visible");
    }

    saveCheckoutData(formData);
    window.location.href = "../checkout-3/checkout-3.html";
  });
}

renderCheckoutStepTwo();
