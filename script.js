gsap.registerPlugin(ScrollTrigger);

// Продукты (с категориями)
const products = [
  { id:1, name:"Джинсы Slim", brand:"Levi's", price:6290, category:"jeans", rating:4.5, discount:10, img:"https://via.placeholder.com/300x390/000/fff?text=Jeans+Slim" },
  { id:2, name:"Джинсы Mom Fit", brand:"Wrangler", price:5490, category:"jeans", rating:4.7, discount:0, img:"https://via.placeholder.com/300x390/8B4513/fff?text=Mom+Fit" },
  { id:3, name:"Футболка Oversize", brand:"Nike", price:2990, category:"tshirts", rating:4.8, discount:15, img:"https://via.placeholder.com/300x390/FF0000/fff?text=Oversize+T" },
  { id:4, name:"Толстовка Hoodie", brand:"Adidas", price:4590, category:"hoodies", rating:4.6, discount:5, img:"https://via.placeholder.com/300x390/000/fff?text=Hoodie" },
  { id:5, name:"Кроссовки Air Max", brand:"Nike", price:11990, category:"sneakers", rating:4.9, discount:0, img:"https://via.placeholder.com/300x390/FFFFFF/000?text=Air+Max" },
  // Добавь свои товары сюда
];

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let viewed = JSON.parse(localStorage.getItem('viewed')) || [];
let priceFrom = 0;
let priceTo = Infinity;
let historyStack = ['home'];

function saveState() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('viewed', JSON.stringify(viewed));
  updateBadges();
}

function updateBadges() {
  document.getElementById('wishlistBadge').textContent = wishlist.length || '';
  document.getElementById('cartBadge').textContent = cart.length || '';
}

function addToViewed(id) {
  if (!viewed.includes(id)) {
    viewed.unshift(id);
    if (viewed.length > 8) viewed.pop();
    localStorage.setItem('viewed', JSON.stringify(viewed));
  }
}

// Счётчики категорий
function updateCategoryCounts() {
  ['jeans', 'tshirts', 'hoodies', 'sneakers'].forEach(cat => {
    const count = products.filter(p => p.category === cat).length;
    const el = document.getElementById(cat + 'Count');
    if (el) el.textContent = count;
  });
}

// Рендер recently viewed
function renderRecentlyViewed() {
  const cont = document.getElementById('recentViewed');
  if (!cont) return;
  cont.innerHTML = '';
  viewed.forEach(id => {
    const p = products.find(pr => pr.id === id);
    if (p) {
      const card = document.createElement('div');
      card.className = 'product-card small';
      card.innerHTML = `
        <img src="${p.img}" class="product-img" alt="${p.name}">
        <div class="product-info">
          <div>${p.name}</div>
          <div class="price">${p.price.toLocaleString()} ₽</div>
          <div class="rating">★★★★★ ${p.rating}</div>
        </div>
      `;
      cont.appendChild(card);
    }
  });
}

// Рендер продуктов (обновлённый)
function renderProducts(filterCategory = 'all', sort = 'default', search = '') {
  const container = document.getElementById('products');
  container.innerHTML = '';

  let filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (p.price < priceFrom || p.price > priceTo) return false;
    return true;
  });

  // Сортировка...

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" class="product-img" alt="${p.name}">
      <div class="product-info">
        <div class="brand">${p.brand}</div>
        <div>${p.name}</div>
        <div class="price">${p.price.toLocaleString()} ₽ ${p.discount ? `<span class="discount">-${p.discount}%</span>` : ''}</div>
        <div class="rating">★★★★★ ${p.rating}</div>
        ${p.inStock ? '<div class="in-stock">В наличии</div>' : ''}
      </div>
      <div class="actions">
        <button class="heart-btn ${wishlist.includes(p.id) ? 'active' : ''}" data-id="${p.id}">♡</button>
        <button class="cart-btn ${cart.some(c => c.id === p.id) ? 'active' : ''}" data-id="${p.id}">🛒</button>
      </div>
    `;
    container.appendChild(card);
  });

  // ScrollTrigger...
}

// ... (остальные функции остаются)

// Инициализация
updateBadges();
updateCategoryCounts();
renderRecentlyViewed();
showPage('home');

// Back button
document.getElementById('backBtn').onclick = () => {
  if (historyStack.length > 1) {
    historyStack.pop();
    showPage(historyStack[historyStack.length - 1]);
  } else {
    showPage('home');
  }
};
