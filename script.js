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

let cart = {};
let caroIndex = 0;

function formatBRL(n) {
  return 'R$ ' + Number(n).toFixed(2).replace('.', ',');
}

function gerarCodigoPedido() {
  return 'GC-' + Date.now().toString().slice(-5);
}

function updateCart() {
  cartItemsWrap.innerHTML = '';
  let subtotal = 0;
  let count = 0;

  Object.keys(cart).forEach(id => {
    const item = cart[id];
    subtotal += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="meta">
        <h5>${item.name}</h5>
        <p>Qtd: ${item.quantity} • ${formatBRL(item.price * item.quantity)}</p>
      </div>
      <button class="remove-btn" data-id="${id}">✕</button>
    `;
    cartItemsWrap.appendChild(div);
  });

  cartCountEl.textContent = count;
  subtotalEl.textContent = formatBRL(subtotal);

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      delete cart[btn.dataset.id];
      updateCart();
    };
  });
}

openCartBtn.onclick = () => {
  cartSidebar.classList.add('open');
  overlay.classList.add('show');
};

closeCartBtn.onclick = overlay.onclick = () => {
  cartSidebar.classList.remove('open');
  overlay.classList.remove('show');
};

clearCartBtn.onclick = () => {
  cart = {};
  updateCart();
};

addButtons.forEach(btn => {
  btn.onclick = () => {
    const { id, name, price } = btn.dataset;
    cart[id] = cart[id]
      ? { ...cart[id], quantity: cart[id].quantity + 1 }
      : { name, price: Number(price), quantity: 1 };
    updateCart();
    cartSidebar.classList.add('open');
    overlay.classList.add('show');
  };
});

checkoutBtn.onclick = () => {
  if (!Object.keys(cart).length) {
    alert('Seu carrinho está vazio.');
    return;
  }

  const pedidoId = gerarCodigoPedido();
  const data = new Date().toLocaleString('pt-BR');

  let msg = `🕯️ *NOVO PEDIDO — GHOSTLY CHIMERICAL*\n\n`;
  msg += `🆔 Pedido: ${pedidoId}\n📅 Data: ${data}\n\n`;

  let total = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.quantity;
    msg += `• ${item.name}\nQtd: ${item.quantity} — ${formatBRL(item.price * item.quantity)}\n\n`;
  });

  msg += `💰 Total: ${formatBRL(total)}\n\n📍 Origem: Site\n⏳ Aguardando contato`;

  window.open(
    `https://wa.me/5546988135025?text=${encodeURIComponent(msg)}`,
    '_blank'
  );
};
