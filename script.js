let tg;
if (window.Telegram && Telegram.WebApp) {
  tg = Telegram.WebApp;
  tg.expand();
} else {
  tg = { showPopup: (opt) => alert(opt.message), showAlert: alert };
  document.body.innerHTML += '<p style="color:red; text-align:center;">Это Telegram Mini App — откройте в Telegram!</p>';
}

const app = document.getElementById('app');
const modal = document.getElementById('modal');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');

const products = [
  {id:1, name:'Смартфон', price:29990, category:'Электроника', img:'https://picsum.photos/300?1', desc:'Современный смартфон'},
  {id:2, name:'Наушники', price:4990, category:'Электроника', img:'https://picsum.photos/300?2', desc:'Беспроводные'},
  {id:3, name:'Ноутбук', price:79990, category:'Электроника', img:'https://picsum.photos/300?3', desc:'Для работы'},
  {id:4, name:'Футболка', price:1990, category:'Одежда', img:'https://picsum.photos/300?4', desc:'Хлопок'},
  {id:5, name:'Куртка', price:9990, category:'Одежда', img:'https://picsum.photos/300?5', desc:'Зимняя'},
  {id:6, name:'Джинсы', price:4590, category:'Одежда', img:'https://picsum.photos/300?6', desc:'Синие'},
  {id:7, name:'Рюкзак', price:3490, category:'Аксессуары', img:'https://picsum.photos/300?7', desc:'Городской'},
  {id:8, name:'Часы', price:8990, category:'Аксессуары', img:'https://picsum.photos/300?8', desc:'Наручные'},
  {id:9, name:'Очки', price:2990, category:'Аксессуары', img:'https://picsum.photos/300?9', desc:'Солнцезащитные'},
  {id:10, name:'Книга JS', price:1590, category:'Книги', img:'https://picsum.photos/300?10', desc:'Для разработчиков'},
  {id:11, name:'Роман', price:990, category:'Книги', img:'https://picsum.photos/300?11', desc:'Бестселлер'},
  {id:12, name:'Комикс', price:1290, category:'Книги', img:'https://picsum.photos/300?12', desc:'Цветной'}
];

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function showCategories() {
  const cats = [...new Set(products.map(p => p.category))];
  app.innerHTML = `
    <div class="grid">
      ${cats.map(c => `
        <button onclick="showProducts('$$   {c.replace(/'/g, "\\'")}')">   $${c}</button>
      `).join('')}
    </div>
  `;
}

function showProducts(cat) {
  const list = products.filter(p => p.category === cat);

  app.innerHTML = `
    <div style="padding:16px;">
      <button onclick="showCategories()">← Назад к категориям</button>
    </div>
    <div class="grid">
      ${list.map(p => `
        <div class="card">
          <img src="$$   {p.img}" alt="   $${p.name}">
          <div class="card-content">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="price">${p.price.toLocaleString('ru-RU')} ₽</div>
            <button onclick="addToCart(${p.id})">В корзину</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();

  tg.showPopup({
    title: 'Добавлено',
    message: 'Товар добавлен в корзину',
    buttons: [{type: 'ok'}]
  });
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty < 1) {
    removeFromCart(id);
    return;
  }

  saveCart();
  showCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();

  if (cart.length === 0) {
    closeModal();
  } else {
    showCart();
  }
}

cartBtn.onclick = showCart;

function showCart() {
  if (cart.length === 0) {
    tg.showAlert('Корзина пуста');
    return;
  }

  modal.classList.remove('hidden');

  let total = 0;

  const itemsHtml = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    const sum = p.price * item.qty;
    total += sum;

    return `
      <div class="cart-item">
        <div>
          <strong>${p.name}</strong><br>
          ${p.price.toLocaleString('ru-RU')} ₽
        </div>
        <div class="cart-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeFromCart(${item.id})">✕</button>
        </div>
        <div><strong>${sum.toLocaleString('ru-RU')} ₽</strong></div>
      </div>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="modal-content">
      <h2>Корзина</h2>
      ${itemsHtml}
      <hr>
      <p style="font-size:1.1rem; text-align:right;"><strong>Итого: ${total.toLocaleString('ru-RU')} ₽</strong></p>
      <button onclick="checkout()">Оформить заказ</button>
      <button onclick="closeModal()">Закрыть</button>
    </div>
  `;
}

function checkout() {
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Оформление заказа</h2>

      <input id="name" placeholder="Имя" required>
      <input id="phone" placeholder="Телефон" type="tel" required>
      <input id="city" placeholder="Город" required>
      <input id="address" placeholder="Адрес" required>
      <input id="date" type="date" required>
      <textarea id="comment" placeholder="Комментарий к заказу (необязательно)"></textarea>

      <button id="payBtn" disabled onclick="pay()">Оплатить</button>
      <button onclick="closeModal()">Отмена</button>
    </div>
  `;

  const inputs = modal.querySelectorAll('input[required]');
  const payBtn = modal.querySelector('#payBtn');

  const checkFields = () => {
    const allFilled = Array.from(inputs).every(i => i.value.trim() !== '');
    payBtn.disabled = !allFilled;
  };

  inputs.forEach(input => input.addEventListener('input', checkFields));
  checkFields();
}

function pay() {
  const requiredInputs = modal.querySelectorAll('input[required]');
  const allFilled = Array.from(requiredInputs).every(i => i.value.trim() !== '');

  if (!allFilled) {
    tg.showAlert('Заполните все обязательные поля');
    return;
  }

  const orderId = Math.floor(Math.random() * 900000) + 100000;

  modal.innerHTML = `
    <div class="modal-content" style="text-align:center;">
      <h2>✅ Заказ оформлен!</h2>
      <p>Номер заказа: <strong>#${orderId}</strong></p>
      <p>Мы свяжемся с вами в ближайшее время</p>
      <button onclick="finish()">Готово</button>
    </div>
  `;

  cart = [];
  saveCart();
}

function closeModal() {
  modal.classList.add('hidden');
}

function finish() {
  closeModal();
  showCategories();
}

modal.addEventListener('click', e => {
  if (e.target === modal) {
    closeModal();
  }
});

try {
  saveCart();
  showCategories();
} catch (e) {
  tg.showAlert('Ошибка в приложении: ' + e.message);
}
