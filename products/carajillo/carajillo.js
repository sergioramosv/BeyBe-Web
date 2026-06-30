const CART_KEY = "bebeb-drinks-cart";
const UNIT_PRICE = 3.30;

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const distinctProducts = cart.length;
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = distinctProducts;
  }
}

function addProductToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();
}

function changeImage(newSrc) {
  document.getElementById("mainProductImage").src = newSrc;
}

function setPackQuantity(amount) {
  document.getElementById("quantity").value = amount;
  updateCalculatedPrice();
}

function changeQty(amount) {
  const input = document.getElementById("quantity");
  let currentValue = parseInt(input.value) || 1;
  currentValue += amount;

  if (currentValue < 1) {
    currentValue = 1;
  }

  input.value = currentValue;
  updateCalculatedPrice();
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function updateCalculatedPrice() {
  const quantityInput = document.getElementById("quantity");
  const calculatedPrice = document.getElementById("calculatedPrice");
  const quantity = Math.max(1, parseInt(quantityInput.value) || 1);
  const total = UNIT_PRICE * quantity;

  if (calculatedPrice) {
    calculatedPrice.textContent = formatPrice(total);
  }
}

document.getElementById("quantity").addEventListener("input", function () {
  const currentValue = parseInt(this.value) || 1;
  if (currentValue < 1) this.value = 1;
  updateCalculatedPrice();
});

document.getElementById("addToCartBtn").addEventListener("click", function () {
  const quantityInput = document.getElementById("quantity");
  const quantity = Math.max(1, parseInt(quantityInput.value) || 1);

  const product = {
    id: "carajillo",
    name: "Carajillo del Tío Pío",
    price: UNIT_PRICE,
    quantity: quantity,
    image: "../../images/CARAJILLO.jpeg"
  };

  addProductToCart(product);

  const feedback = document.getElementById("cartFeedback");
  feedback.classList.add("show");

  setTimeout(() => {
    feedback.classList.remove("show");
  }, 2200);
});

const detailsToggle = document.getElementById("detailsToggle");
const detailsContent = document.getElementById("detailsContent");

detailsToggle.addEventListener("click", function () {
  const isOpen = detailsContent.classList.contains("open");

  detailsContent.classList.toggle("open");
  detailsToggle.classList.toggle("active");
  detailsToggle.setAttribute("aria-expanded", String(!isOpen));
});

updateCartCount();
updateCalculatedPrice();
