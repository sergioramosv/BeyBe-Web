/* =========================================================
   CLAVE COMPARTIDA DEL CARRITO
   ---------------------------------------------------------
   Esta clave debe ser la misma en todas las páginas para
   que el carrito y su contador funcionen correctamente.
   ========================================================= */
const CART_KEY = "bebeb-drinks-cart";

/* =========================================================
   OBTENER EL CARRITO GUARDADO
   ---------------------------------------------------------
   - Lee la información guardada en localStorage.
   - Si existe, la convierte de texto JSON a array.
   - Si no existe, devuelve un array vacío.
   ========================================================= */
function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

/* =========================================================
   ACTUALIZAR EL CONTADOR DEL CARRITO
   ---------------------------------------------------------
   - Cuenta cuántos productos distintos hay en el carrito.
   - Coloca ese número dentro del span #cartCount.
   ========================================================= */
function updateCartCount() {
  const cart = getCart();
  const totalProducts = cart.length;
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = totalProducts;
  }
}

/* =========================================================
   EJECUCIÓN INICIAL
   ---------------------------------------------------------
   En cuanto la página carga, se actualiza el contador para
   que el número del carrito no desaparezca.
   ========================================================= */
updateCartCount();
