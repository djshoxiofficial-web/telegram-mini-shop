const tg = Telegram.WebApp;
tg.expand();

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
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function showCategories() {
  const cats = [...new Set(products.map(p=>p.category))];
  app.innerHTML = `
    <div class="grid">
      ${cats.map(c=>`
        <button onclick="showProducts('${c}')">${c}</button>
      `).join('')}
    </div>`;
}

function showProducts(cat) {
  const list = products.filter(p=>p.category===cat);
  app.innerHTML = `
    <div class="grid">
      ${list.map(p=>`
        <div class="card">
          <img src="${p.img}">
          <div class="card-content">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="price">${p.price} ₽</div>
            <button onclick="addToCart(${p.id})">В корзину</button>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function addToCart(id) {
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else cart.push({id, qty:1});
  saveCart();
}

cartBtn.onclick = showCart;

function showCart() {
  if(cart.length===0) return alert('Корзина пуста');
  modal.classList.remove('hidden');
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Корзина</h2>
      ${cart.map(i=>{
        const p = products.find(x=>x.id===i.id);
        return `<p>${p.name} × ${i.qty} — ${p.price*i.qty} ₽</p>`;
      }).join('')}
      <button onclick="checkout()">Оформить заказ</button>
      <button onclick="closeModal()">Закрыть</button>
    </div>`;
}

function checkout() {
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Доставка</h2>
      <input placeholder="Имя">
      <input placeholder="Телефон">
      <input placeholder="Город">
      <input placeholder="Адрес">
      <input placeholder="Дата / время">
      <button onclick="pay()">Оплатить</button>
    </div>`;
}

function pay() {
  modal.innerHTML = `
    <div class="modal-content">
      <h2>✅ Спасибо за заказ!</h2>
      <p>Номер заказа: #${Math.floor(Math.random()*100000)}</p>
      <button onclick="finish()">Закрыть</button>
    </div>`;
  cart = [];
  saveCart();
}

function finish() {
  closeModal();
  showCategories();
}

function closeModal() {
  modal.classList.add('hidden');
}

saveCart();
showCategories();
