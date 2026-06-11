// CoreVault — Carrinho compartilhado via localStorage

const CART_KEY = 'corevault_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }
  saveCart(cart);
  updateCartUI();
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  updateCartUI();
  renderCartItems();
}

function getTotalItems() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getTotalPrice() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartUI() {
  const count = getTotalItems();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

function renderCartItems() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    document.getElementById('cart-total-value').textContent = 'R$ 0,00';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.icon || ''}</div>
      <div style="flex:1">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-qty">Qtd: ${item.qty}</div>
      </div>
      <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
      <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')" title="Remover">✕</button>
    </div>
  `).join('');

  const total = getTotalPrice();
  document.getElementById('cart-total-value').textContent =
    'R$ ' + total.toFixed(2).replace('.', ',');
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').classList.add('open');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-sidebar').classList.remove('open');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Modal
let currentProduct = null;
let modalQty = 1;

function openModal(product) {
  currentProduct = product;
  modalQty = 1;
  document.getElementById('modal-qty-value').textContent = 1;
  document.getElementById('modal-product-name').textContent = product.name;
  document.getElementById('modal-product-price').textContent =
    'R$ ' + product.price.toFixed(2).replace('.', ',');
  if (document.getElementById('modal-icon')) {
    document.getElementById('modal-icon').innerHTML = product.icon || '';
  }
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  currentProduct = null;
}

function changeQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modal-qty-value').textContent = modalQty;
}

function confirmPurchase() {
  if (!currentProduct) return;
  addToCart({ ...currentProduct, qty: modalQty });
  closeModal();
  showToast(currentProduct.name + ' adicionado ao carrinho!');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-confirm-btn')?.addEventListener('click', confirmPurchase);
  document.getElementById('qty-minus')?.addEventListener('click', () => changeQty(-1));
  document.getElementById('qty-plus')?.addEventListener('click', () => changeQty(1));
});
