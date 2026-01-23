gsap.registerPlugin(ScrollTrigger);

// Данные продуктов (можно вынести в JSON позже)
const products = [
  { id:1, name:"Ботинки Yama Fur", brand:"Wrangler", price:8495, gender:"male", inStock:true, img:"https://via.placeholder.com/300x390/8B4513/fff?text=Yama+Fur" },
  { id:2, name:"Ботинки Creek Fur", brand:"Wrangler", price:8495, gender:"male", inStock:true, img:"https://via.placeholder.com/300x390/556B2F/fff?text=Creek+Fur" },
  { id:3, name:"Джинсы Slim Fit", brand:"Levi's", price:6290, gender:"male", inStock:true, img:"https://via.placeholder.com/300x390/000/fff?text=Slim+Fit" },
  { id:4, name:"Худи Oversize", brand:"Nike", price:4290, gender:"female", inStock:true, img:"https://via.placeholder.com/300x390/FF69B4/fff?text=Oversize" },
  { id:5, name:"Платье Midi", brand:"Zara", price:7990, gender:"female", inStock:true, img:"https://via.placeholder.com/300x390/FFB6C1/fff?text=Midi" },
  // Добавь ещё 10–20 для теста скролла
];

// Состояние
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Утилиты
function saveState() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  localStorage.setItem('cart', JSON.stringify(cart));
  updateBadges();
}

function updateBadges() {
  document.getElementById('wishlistBadge').textContent = wishlist.length || '';
  document.getElementById('cartBadge').textContent = cart.length || '';
}

function isInWishlist(id) { return wishlist.includes(id); }
function isInCart(id) { return cart.some(item => item.id === id); }

// Рендер продуктов
function renderProducts(filterTab = 'all', sort = 'default', search = '') {
  const container = document.getElementById('products');
  container.innerHTML = '';

  let filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTab === 'male' && p.gender !== 'male') return false;
    if (filterTab === 'female' && p.gender !== 'female') return false;
    return true;
  });

  if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sort === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" class="product-img" alt="${p.name}">
      <div class="product-info">
        <div class="brand">${p.brand}</div>
        <div>${p.name}</div>
        <div class="price">${p.price.toLocaleString()} ₽</div>
        ${p.inStock ? '<div class="in-stock">В наличии</div>' : ''}
      </div>
      <div class="actions">
        <button class="heart-btn ${isInWishlist(p.id) ? 'active' : ''}" data-id="${p.id}">♡</button>
        <button class="cart-btn" data-id="${p.id}">🛒</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Анимации карточек при скролле
  gsap.utils.toArray(".product-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
      y: 60, opacity: 0, duration: 0.9, ease: "power3.out", delay: i * 0.06
    });
  });

  // Обработчики кнопок
  document.querySelectorAll('.heart-btn').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.dataset.id;
      if (isInWishlist(id)) {
        wishlist = wishlist.filter(i => i !== id);
        btn.classList.remove('active');
      } else {
        wishlist.push(id);
        btn.classList.add('active');
      }
      saveState();
      if (document.getElementById('wishlist').classList.contains('active')) renderWishlist();
    };
  });

  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.dataset.id;
      if (!isInCart(id)) {
        cart.push({ id, qty: 1 });
        alert('Добавлено в корзину!');
      } else {
        alert('Уже в корзине');
      }
      saveState();
      if (document.getElementById('cart').classList.contains('active')) renderCart();
    };
  });
}

// Рендер избранного
function renderWishlist() {
  const cont = document.getElementById('wishlistContent');
  cont.innerHTML = '';
  if (wishlist.length === 0) {
    cont.innerHTML = `<div class="empty-state"><div class="icon heart">♡</div><h2>Список желаний пуст</h2><p>Добавьте товары</p></div>`;
    return;
  }
  const list = document.createElement('div');
  list.className = 'product-grid';
  wishlist.forEach(id => {
    const p = products.find(pr => pr.id === id);
    if (p) {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" class="product-img">
        <div class="product-info">
          <div>${p.name}</div>
          <div class="price">${p.price.toLocaleString()} ₽</div>
        </div>
        <button onclick="removeFromWishlist(${id})" style="margin:8px; color:red;">Удалить</button>
      `;
      list.appendChild(card);
    }
  });
  cont.appendChild(list);
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(i => i !== id);
  saveState();
  renderWishlist();
}

// Рендер корзины
function renderCart() {
  const cont = document.getElementById('cartContent');
  const totalEl = document.getElementById('cartTotal');
  const btn = document.getElementById('checkoutBtn');
  cont.innerHTML = '';

  if (cart.length === 0) {
    cont.innerHTML = `<div class="empty-state"><div class="icon bag">🛍️</div><h2>Корзина пуста</h2><p>Добавьте товары</p></div>`;
    totalEl.style.display = 'none';
    btn.style.display = 'none';
    return;
  }

  let total = 0;
  const list = document.createElement('div');
  list.className = 'product-grid';
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      total += p.price * item.qty;
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" class="product-img">
        <div class="product-info">
          <div>${p.name}</div>
          <div class="price">${p.price.toLocaleString()} ₽ × ${item.qty}</div>
        </div>
        <button onclick="removeFromCart(${item.id})" style="margin:8px; color:red;">Удалить</button>
      `;
      list.appendChild(card);
    }
  });
  cont.appendChild(list);

  totalEl.textContent = `Итого: ${total.toLocaleString()} ₽`;
  totalEl.style.display = 'block';
  btn.style.display = 'block';
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveState();
  renderCart();
}

// Анимация страницы
function animatePageIn(pageId) {
  const page = document.getElementById(pageId);
  gsap.set(page, { x:40, opacity:0 });
  gsap.to(page, { duration:0.6, x:0, opacity:1, ease:"power3.out" });

  if (pageId === 'home') {
    gsap.from(".hero", { duration:1.2, scale:0.94, opacity:0, ease:"power3.out" });
    gsap.from(".brand", { duration:1, y:50, opacity:0, ease:"back.out(1.7)", delay:0.5 });
    gsap.from(".cat-btn", { duration:0.8, y:40, opacity:0, stagger:0.15, ease:"back.out(1.7)", delay:0.9 });
  }
  if (pageId === 'catalog') {
    gsap.from(".tab", { duration:0.6, y:-20, opacity:0, stagger:0.1 });
    ScrollTrigger.refresh();
  }
  if (pageId === 'wishlist' || pageId === 'cart') {
    gsap.from(".empty-state .icon", { duration:1.2, scale:0.4, opacity:0, ease:"elastic.out(1,0.4)" });
  }
}

// Смена страницы
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    if (p.id === pageId) {
      p.classList.add('active');
      animatePageIn(pageId);
    } else {
      p.classList.remove('active');
      gsap.to(p, { duration:0.4, x:-40, opacity:0 });
    }
  });

  const title = document.querySelector('.page-title');
  title.textContent = {
    home: 'WEB SHOP',
    catalog: 'Каталог',
    wishlist: 'Желаемые товары',
    cart: 'Корзина',
    profile: 'Профиль',
    checkout: 'Оформление заказа'
  }[pageId] || 'WEB SHOP';

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${pageId}"]`)?.classList.add('active');

  if (pageId === 'catalog') renderProducts('all');
  if (pageId === 'wishlist') renderWishlist();
  if (pageId === 'cart') renderCart();
}

// Навигация
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => showPage(btn.dataset.page);
});

// Категории → каталог
document.querySelectorAll('.cat-btn').forEach(btn => {
  if (btn.dataset.gender) {
    btn.onclick = () => {
      showPage('catalog');
      // Можно фильтровать сразу по gender, но пока оставляем все
    };
  }
});

// Tabs в каталоге
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderProducts(tab.dataset.tab);
  };
});

// Сортировка и поиск
document.getElementById('sortSelect').onchange = e => renderProducts(document.querySelector('.tab.active').dataset.tab, e.target.value);
document.getElementById('searchInput').oninput = e => renderProducts(document.querySelector('.tab.active').dataset.tab, document.getElementById('sortSelect').value, e.target.value);

// Оформление
document.getElementById('checkoutBtn').onclick = () => showPage('checkout');

document.getElementById('checkoutForm').onsubmit = e => {
  e.preventDefault();
  alert('Заказ оформлен! Спасибо!');
  cart = [];
  saveState();
  showPage('cart');
};

// Профиль
function loadProfile() {
  const name = localStorage.getItem('userName') || 'Гость';
  document.getElementById('userGreeting').textContent = `Здравствуйте, ${name}`;
  document.getElementById('editName').value = name;
}
function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  if (name) {
    localStorage.setItem('userName', name);
    loadProfile();
    alert('Имя сохранено');
  }
}
loadProfile();

// Инициализация
updateBadges();
showPage('home');
