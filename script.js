// Плавная смена страниц
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');
const content = document.getElementById('page-content');

function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  // Обновляем заголовок если нужно
  const title = document.querySelector('.page-title');
  if (pageId === 'home') title.textContent = 'WEB SHOP';
  if (pageId === 'catalog') title.textContent = 'Каталог';
  if (pageId === 'wishlist') title.textContent = 'Желаемые товары';
  if (pageId === 'cart') title.textContent = 'Оформление заказа';
  if (pageId === 'profile') title.textContent = 'Кабинет';

  // Active в bottom nav
  navBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

// Клик по bottom nav
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    showPage(page);
  });
});

// Пример: клик по категориям → каталог
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => showPage('catalog'));
});

// Пример продуктов в каталоге (можно потом заменить на реальные)
const productsContainer = document.getElementById('products');
const sampleProducts = [
  { name: 'Ботинки Yama Fur', brand: 'Wrangler', price: '8 495₽', inStock: true, img: 'https://via.placeholder.com/300x360/8B4513/fff?text=Yama+Fur' },
  { name: 'Ботинки Высокие Creek Fur', brand: 'Wrangler', price: '8 495₽', inStock: true, img: 'https://via.placeholder.com/300x360/556B2F/fff?text=Creek+Fur' },
  // добавь больше...
];

function renderProducts() {
  productsContainer.innerHTML = '';
  sampleProducts.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" class="product-img">
      <div class="product-info">
        <div class="brand">${p.brand}</div>
        <div>${p.name}</div>
        <div class="price">${p.price}</div>
        ${p.inStock ? '<div class="in-stock">В наличии</div>' : ''}
        <button>🛒</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

renderProducts();

// Back button (пока просто на главную)
function goBack() {
  showPage('home');
}

// Инициализация
showPage('home');
