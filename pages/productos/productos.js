const CART_KEY = "bebeb-drinks-cart";
// productos.html vive en /pages/productos/ -> las imágenes están dos niveles arriba.
const IMG_PREFIX = "../../";
function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}
function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = cart.length;
}
// Pinta las tarjetas del listado a partir de los productos de Firebase.
function renderProducts(products) {
  const container = document.getElementById("productsList");
  if (!container) return;
  if (!products || !products.length) {
    container.innerHTML = `<p class="intro">No hay productos disponibles ahora mismo.</p>`;
    return;
  }
  container.innerHTML = products.map((p) => {
    const card = p.card || {};
    return `
    <a href="../../products/product.html?id=${p.id}" class="product-link">
      <article class="product-row">
        <div class="product-image-box">
          <img src="${IMG_PREFIX + p.mainImage}" alt="${card.title || p.title}">
        </div>
        <div class="product-info">
          <h2>${card.title || p.title}</h2>
          <p class="product-subtitle">${card.subtitle || p.flavor || ""}</p>
          <p class="product-text">${card.text || ""}</p>
        </div>
      </article>
    </a>`;
  }).join("");
}
// getProducts() está definida globalmente en firebase-init.js (lee de Realtime Database).
async function loadProducts() {
  const products = await getProducts();
  renderProducts(products);
}
updateCartCount();
loadProducts();