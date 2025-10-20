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
clearCartBtn.addEventListener('click', () => {
  cart = {};
  updateCart();
});

// Checkout via Instagram (abre perfil do Ghostly Chimerical)
checkoutBtn.addEventListener('click', () => {
  window.open("https://instagram.com/ghostly_chimerical", "_blank");
});

// Contato Comercial - abrir Gmail
contactEmailBtn.addEventListener('click', () => {
  window.location.href = "mailto:ghostlychimericalghostly@gmail.com";
});

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

// Carrossel
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const caroTrack = document.getElementById('caroTrack');
let caroWidth = caroTrack.children[0].offsetWidth + 10;

function moveCarrossel() {
  caroTrack.style.transform = `translateX(-${caroIndex * caroWidth}px)`;
}

nextBtn.addEventListener('click', () => {
  if (caroIndex < caroTrack.children.length - Math.floor(caroTrack.parentElement.offsetWidth / caroWidth)) {
    caroIndex++;
    moveCarrossel();
  }
});

prevBtn.addEventListener('click', () => {
  if (caroIndex > 0) {
    caroIndex--;
    moveCarrossel();
  }
});

// Ajustar largura em resize
window.addEventListener('resize', () => {
  caroWidth = caroTrack.children[0].offsetWidth + 10;
  moveCarrossel();
});
