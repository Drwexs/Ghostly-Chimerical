// Seletores
const addButtons = document.querySelectorAll('.add-btn');
const cartSidebar = document.getElementById('cartSidebar');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItemsWrap = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactEmailBtn = document.getElementById('contactEmail');

let cart = {};
let caroIndex = 0;
let autoplayInterval = null;

// Carrossel elementos
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const caroTrack = document.getElementById('caroTrack');
const carousel = document.getElementById('carousel');
const viewport = document.querySelector('.carousel-viewport');

let caroWidth = 0;
let visibleCount = 1; // quantas imagens cabem na viewport

// Função para formatar valores em R$
function formatBRL(n) {
  return 'R$ ' + Number(n).toFixed(2).replace('.', ',');
}

// Atualiza o carrinho
function updateCart() {
  cartItemsWrap.innerHTML = '';
  let subtotal = 0, count = 0;
  for (let id in cart) {
    const item = cart[id];
    subtotal += item.price * item.quantity;
    count += item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="meta">
        <h5>${item.name}</h5>
        <p>Qtd: ${item.quantity} | ${formatBRL(item.price * item.quantity)}</p>
      </div>
      <button class="remove-btn" data-id="${id}">✕</button>
    `;
    cartItemsWrap.appendChild(div);
  }
  cartCountEl.textContent = count;
  subtotalEl.textContent = formatBRL(subtotal);

  // Remover item
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      delete cart[btn.dataset.id];
      updateCart();
    });
  });
}

// Abrir/fechar carrinho
openCartBtn.addEventListener('click', () => {
  cartSidebar.classList.add('open');
  overlay.classList.add('show');
});
closeCartBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  overlay.classList.remove('show');
});
overlay.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  overlay.classList.remove('show');
});

// Limpar carrinho
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = {};
    updateCart();
  });
}

// Checkout via Instagram (abre perfil do Ghostly Chimerical)
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    window.open("https://instagram.com/ghostly_chimerical", "_blank");
  });
}

// Contato Comercial - abrir Gmail
if (contactEmailBtn) {
  contactEmailBtn.addEventListener('click', (e) => {
    // link mailto está no href no HTML; manter comportamento
  });
}

// Adicionar itens ao carrinho
addButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    if (cart[id]) cart[id].quantity += 1;
    else cart[id] = { name, price, quantity: 1 };
    updateCart();
    cartSidebar.classList.add('open');
    overlay.classList.add('show');
  });
});

/* ----------------------------
   Carrossel: lógica de deslize
   ---------------------------- */

// recalcula dimensões
function recalcSizes() {
  // pega a primeira imagem visível para largura base
  const firstImg = caroTrack.querySelector('img');
  if (!firstImg) return;
  // força layout se as imagens não estiverem carregadas
  caroWidth = firstImg.offsetWidth + 10; // gap = 10
  visibleCount = Math.max(1, Math.floor(viewport.offsetWidth / caroWidth));
  // garante que carroIndex esteja dentro dos limites
  caroIndex = Math.min(caroIndex, Math.max(0, caroTrack.children.length - visibleCount));
  moveCarrossel();
}

// move track
function moveCarrossel() {
  caroTrack.style.transform = `translateX(-${caroIndex * caroWidth}px)`;
}

// next / prev
nextBtn.addEventListener('click', () => {
  if (caroIndex < caroTrack.children.length - visibleCount) {
    caroIndex++;
  } else {
    // loopar para começar
    caroIndex = 0;
  }
  moveCarrossel();
  resetAutoplay();
});
prevBtn.addEventListener('click', () => {
  if (caroIndex > 0) caroIndex--;
  else caroIndex = Math.max(0, caroTrack.children.length - visibleCount); // ir para o final
  moveCarrossel();
  resetAutoplay();
});

// autoplay
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    if (caroIndex < caroTrack.children.length - visibleCount) caroIndex++;
    else caroIndex = 0;
    moveCarrossel();
  }, 4000); // troca a cada 4s
}
function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}
function resetAutoplay() {
  stopAutoplay();
  // reinicia com pequeno delay
  setTimeout(startAutoplay, 2500);
}

// pausa quando hover no carrossel
carousel.addEventListener('mouseenter', () => stopAutoplay());
carousel.addEventListener('mouseleave', () => startAutoplay());

// Ajustar largura em resize
window.addEventListener('resize', () => {
  // recalc após o resize
  recalcSizes();
});

// espera as imagens carregarem para calcular medidas iniciais
window.addEventListener('load', () => {
  // pequenas margens para imagens ainda carregando
  setTimeout(() => {
    recalcSizes();
    startAutoplay();
  }, 80);
});

// caso imagens carreguem depois do load
const images = caroTrack.querySelectorAll('img');
images.forEach(img => {
  img.addEventListener('load', () => {
    recalcSizes();
  });
});

/* Touch support - deslize simples */
let startX = 0;
let isDragging = false;
let currentTranslate = 0;

viewport.addEventListener('touchstart', (e) => {
  stopAutoplay();
  startX = e.touches[0].clientX;
  isDragging = true;
});
viewport.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - startX;
  caroTrack.style.transition = 'none';
  caroTrack.style.transform = `translateX(${ -caroIndex * caroWidth + dx }px)`;
});
viewport.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  const dx = e.changedTouches[0].clientX - startX;
  caroTrack.style.transition = ''; // restaura transição
  if (Math.abs(dx) > 50) {
    if (dx < 0 && caroIndex < caroTrack.children.length - visibleCount) caroIndex++;
    if (dx > 0 && caroIndex > 0) caroIndex--;
  }
  moveCarrossel();
  isDragging = false;
  resetAutoplay();
});
