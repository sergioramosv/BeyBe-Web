const CART_KEY = "bebeb-drinks-cart";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function activateTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });

  if (tabId) {
    history.replaceState(null, "", "#" + tabId);
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    activateTab(target);
  });
});

updateCartCount();

const hash = window.location.hash.replace("#", "");
if (hash === "contacto" || hash === "sostenibilidad" || hash === "historia") {
  activateTab(hash);
}
