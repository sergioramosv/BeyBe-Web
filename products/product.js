// Página de producto dinámica.
// Lee ?id= de la URL, carga los productos desde Firebase (getProducts, en firebase-init.js)
// y pinta el producto correspondiente.

const CART_KEY = "bebeb-drinks-cart";
const DISPLAY_PREFIX = "../";    // product.html vive en /products/  -> imágenes en /images/
const CART_PREFIX = "../../";    // carrito y checkout viven dos niveles abajo

let CURRENT = null;

/* ------------------------- Carrito ------------------------- */
function getCart() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = cart.length;
}

function addProductToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
  updateCartCount();
}

/* ------------------------- Utilidades ------------------------- */
function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function getProductId() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

function changeImage(src) {
  document.getElementById("mainProductImage").src = src;
}

function setPackQuantity(amount) {
  document.getElementById("quantity").value = amount;
  updateCalculatedPrice();
}

function changeQty(amount) {
  const input = document.getElementById("quantity");
  let value = (parseInt(input.value) || 1) + amount;
  if (value < 1) value = 1;
  input.value = value;
  updateCalculatedPrice();
}

function updateCalculatedPrice() {
  const input = document.getElementById("quantity");
  const out = document.getElementById("calculatedPrice");
  if (!input || !out || !CURRENT) return;
  const quantity = Math.max(1, parseInt(input.value) || 1);
  out.textContent = formatPrice(CURRENT.price * quantity);
}

/* ------------------------- Render ------------------------- */
function renderProduct(p) {
  CURRENT = p;
  document.title = p.pageTitle || (p.title + " | Be&Be Drinks Spain");
  document.getElementById("breadcrumbCurrent").textContent = p.title;

  // Galería
  const main = document.getElementById("mainProductImage");
  main.src = DISPLAY_PREFIX + p.mainImage;
  main.alt = p.title;

  const thumbs = document.getElementById("thumbs");
  thumbs.innerHTML = (p.thumbs || []).map(t => `
    <button class="thumb" type="button" data-src="${DISPLAY_PREFIX + t.src}">
      <img src="${DISPLAY_PREFIX + t.src}" alt="${t.alt}">
    </button>`).join("");

  // Información
  const meta = (p.meta || []).map(m => `<span>${m}</span>`).join("");
  const packs = (p.packOptions || []).map(n =>
    `<button type="button" class="pack-btn" data-qty="${n}">Pack de ${n}</button>`).join("");
  const desc = (p.description || []).map(d => `<p>${d}</p>`).join("");
  const details = (p.details || []).map(s => `
    <div class="details-section">
      <h3>${s.heading}</h3>
      ${(s.paragraphs || []).map(par => `<p>${par}</p>`).join("")}
    </div>`).join("");

  document.getElementById("productInfo").innerHTML = `
    <p class="product-tag">${p.tag}</p>
    <h1 class="product-title">${p.title}</h1>
    <p class="product-flavor">${p.flavor}</p>

    <div class="product-meta">${meta}</div>

    <div class="product-price-block">
      <div class="product-price">
        ${formatPrice(p.price)}
        <span class="product-price-unit">${p.priceUnit}</span>
      </div>
    </div>

    <div class="buy-box">
      <label class="quantity-label">Elige tu pack</label>
      <div class="pack-options">${packs}</div>

      <label class="quantity-label quantity-label-center" for="quantity">O elige una cantidad manual</label>
      <div class="quantity-selector-wrap">
        <div class="quantity-selector">
          <button type="button" id="qtyMinus">−</button>
          <input id="quantity" type="number" value="1" min="1">
          <button type="button" id="qtyPlus">+</button>
        </div>
      </div>

      <div class="calculated-price">
        <span class="calculated-price-label">Precio total</span>
        <span id="calculatedPrice" class="calculated-price-value">${formatPrice(p.price)}</span>
      </div>

      <button class="add-cart-btn" id="addToCartBtn" type="button">Añadir al carrito</button>
      <p class="buy-note">${p.buyNote}</p>
      <p id="cartFeedback" class="cart-feedback">Producto añadido al carrito.</p>
    </div>

    <div class="product-description-below">${desc}</div>

    <div class="product-details">
      <button id="detailsToggle" class="details-toggle" type="button" aria-expanded="false">
        <h2>Detalles del producto</h2>
        <span class="details-icon">+</span>
      </button>
      <div id="detailsContent" class="details-content">${details}</div>
    </div>

    <a class="back-link" href="../pages/productos/productos.html">← Volver a productos</a>
  `;

  wireUpEvents();
  updateCalculatedPrice();
}

function wireUpEvents() {
  document.querySelectorAll(".thumb").forEach(btn =>
    btn.addEventListener("click", () => changeImage(btn.dataset.src)));

  document.querySelectorAll(".pack-btn").forEach(btn =>
    btn.addEventListener("click", () => setPackQuantity(parseInt(btn.dataset.qty))));

  document.getElementById("qtyMinus").addEventListener("click", () => changeQty(-1));
  document.getElementById("qtyPlus").addEventListener("click", () => changeQty(1));

  document.getElementById("quantity").addEventListener("input", function () {
    if ((parseInt(this.value) || 1) < 1) this.value = 1;
    updateCalculatedPrice();
  });

  document.getElementById("addToCartBtn").addEventListener("click", function () {
    const quantity = Math.max(1, parseInt(document.getElementById("quantity").value) || 1);
    addProductToCart({
      id: CURRENT.cartId || CURRENT.id,
      name: CURRENT.title,
      price: CURRENT.price,
      quantity: quantity,
      image: CART_PREFIX + CURRENT.mainImage
    });
    const feedback = document.getElementById("cartFeedback");
    feedback.classList.add("show");
    setTimeout(() => feedback.classList.remove("show"), 2200);
  });

  const detailsToggle = document.getElementById("detailsToggle");
  const detailsContent = document.getElementById("detailsContent");
  detailsToggle.addEventListener("click", function () {
    const isOpen = detailsContent.classList.contains("open");
    detailsContent.classList.toggle("open");
    detailsToggle.classList.toggle("active");
    detailsToggle.setAttribute("aria-expanded", String(!isOpen));
  });
}

function renderError() {
  document.getElementById("productInfo").innerHTML =
    `<p class="product-tag">Producto no encontrado.</p>
     <h1 class="product-title">Vaya…</h1>
     <p class="product-flavor">El producto que buscas no está disponible.</p>
     <a class="back-link" href="../pages/productos/productos.html">← Volver a productos</a>`;
}

/* ------------------------- Init ------------------------- */
// getProducts() está definida globalmente en firebase-init.js (lee de Realtime Database).
updateCartCount();

getProducts()
  .then(list => {
    const id = getProductId();
    const product = list.find(p => p.id === id) || (!id ? list[0] : null);
    if (product) {
      renderProduct(product);
    } else {
      renderError();
    }
  })
  .catch(err => {
    console.error("No se pudieron cargar los productos:", err);
    renderError();
  });
