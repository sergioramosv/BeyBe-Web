const CART_KEY = "bebeb-drinks-cart";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function updateCartCount() {
  const cart = getCart();
  const distinctProducts = cart.length;
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = distinctProducts;
  }
}

updateCartCount();
