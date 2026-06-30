const tabBtns = document.querySelectorAll('.tab-btn');
const tabSections = document.querySelectorAll('.legal-section');

function activateTab(tabId, updateHash = true) {
  const validIds = ['aviso', 'terminos', 'privacidad', 'cookies'];
  const finalTab = validIds.includes(tabId) ? tabId : 'aviso';

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === finalTab);
  });

  tabSections.forEach(section => {
    section.classList.toggle('active', section.id === finalTab);
  });

  if (updateHash) {
    history.replaceState(null, '', '#' + finalTab);
  }
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activateTab(btn.dataset.tab, true);
  });
});

function activateTabFromHash() {
  const hash = window.location.hash.replace('#', '');
  activateTab(hash || 'aviso', false);
}

window.addEventListener('hashchange', activateTabFromHash);
activateTabFromHash();

const CART_KEY = "bebeb-drinks-cart";

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = getCart().length;
}

updateCartCount();
