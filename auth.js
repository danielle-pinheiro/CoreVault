// CoreVault — Sessão simulada via localStorage

const USER_KEY = 'corevault_user';

function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.href = 'index.html';
}

// Renderiza o header de acordo com a sessão
function renderAuthHeader() {
  const user = getUser();
  // Encontra todos os containers de ações do header nesta página
  document.querySelectorAll('.header-actions').forEach(container => {
    const loginBtn = container.querySelector('.login-btn');
    if (!loginBtn) return; // ex: já foi substituído

    if (user) {
      // Substitui o botão Entrar por saudação + logout
      const firstName = user.nome ? user.nome.split(' ')[0] : user.email;
      const greeting = document.createElement('div');
      greeting.className = 'user-greeting';
      greeting.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Olá, ${firstName}
      `;
      loginBtn.replaceWith(greeting);

      // Botão sair — pequeno, logo após a saudação
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Sair';
      logoutBtn.onclick = logout;
      greeting.insertAdjacentElement('afterend', logoutBtn);
    }
  });

  // Atualiza botão "Finalizar compra" do carrinho sidebar
  const checkoutBtn = document.querySelector('.cart-footer .btn-primary');
  if (checkoutBtn) {
    if (getUser()) {
      checkoutBtn.onclick = () => {
        closeCart();
        showToast('Compra finalizada! Obrigado, ' + getUser().nome.split(' ')[0] + '.');
        // Limpa carrinho após "finalizar"
        setTimeout(() => {
          localStorage.removeItem('corevault_cart');
          updateCartUI();
        }, 500);
      };
    } else {
      checkoutBtn.onclick = () => { window.location.href = 'login.html'; };
    }
  }
}

// Inicializa hamburger menu mobile
function initHamburger() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const hamburger = header.querySelector('.hamburger-btn');
  if (!hamburger) return;

  // Cria o mobile-nav clonando links da nav desktop
  let mobileNav = document.querySelector('.mobile-nav');
  if (!mobileNav) {
    mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    const desktopLinks = document.querySelectorAll('.site-nav a');
    desktopLinks.forEach(link => {
      const clone = link.cloneNode(true);
      mobileNav.appendChild(clone);
    });
    header.insertAdjacentElement('afterend', mobileNav);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Fecha ao clicar em um link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

// Inicializa ocultamento de SVG placeholder quando imagem carrega
function initProductImages() {
  document.querySelectorAll('.product-image').forEach(container => {
    const img = container.querySelector('img.product-img');
    const svg = container.querySelector('svg');
    if (!img || !svg) return;

    svg.classList.add('placeholder-svg');

    const hide = () => {
      container.classList.add('has-img');
    };

    if (img.complete && img.naturalWidth > 0) {
      hide();
    } else {
      img.addEventListener('load', hide);
      img.addEventListener('error', () => {
        // imagem não encontrada — mantém SVG visível
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAuthHeader();
  initHamburger();
  initProductImages();
});
