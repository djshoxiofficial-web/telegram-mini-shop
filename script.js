// GSAP анимации
gsap.registerPlugin(); // если добавишь плагины позже, регистрируй здесь

// Функция анимации появления страницы
function animatePageIn(pageId) {
  const page = document.getElementById(pageId);

  // Сбрасываем начальное состояние
  gsap.set(page, { x: 50, opacity: 0 });

  // Анимируем вход
  gsap.to(page, {
    duration: 0.6,
    x: 0,
    opacity: 1,
    ease: "power3.out"
  });

  // Специфические анимации по странице
  if (pageId === 'home') {
    gsap.from(".hero", { duration: 1.2, scale: 0.95, opacity: 0, ease: "power3.out" });
    gsap.from(".brand", { duration: 1, y: 40, opacity: 0, ease: "back.out(1.7)", delay: 0.4 });
    gsap.from(".collection", { duration: 0.8, y: 30, opacity: 0, ease: "power2.out", delay: 0.7 });
    gsap.from(".cat-btn", { 
      duration: 0.7, 
      y: 50, 
      opacity: 0, 
      stagger: 0.15, 
      ease: "back.out(1.7)", 
      delay: 1 
    });
  }

  if (pageId === 'catalog') {
    gsap.from(".tab", { duration: 0.6, y: -20, opacity: 0, stagger: 0.1, ease: "power2.out" });
    gsap.from(".product-card", { 
      duration: 0.8, 
      y: 60, 
      opacity: 0, 
      stagger: 0.08, 
      ease: "power3.out", 
      delay: 0.3 
    });
  }

  if (pageId === 'wishlist' || pageId === 'cart') {
    gsap.from(".empty-state .icon", { 
      duration: 1.2, 
      scale: 0.5, 
      opacity: 0, 
      ease: "elastic.out(1, 0.5)" 
    });
    gsap.from(".empty-state h2, .empty-state p", { 
      duration: 0.8, 
      y: 30, 
      opacity: 0, 
      stagger: 0.2, 
      delay: 0.4 
    });
  }

  if (pageId === 'profile') {
    gsap.from(".avatar", { duration: 1, scale: 0, opacity: 0, ease: "back.out(1.7)" });
    gsap.from(".profile-menu li", { 
      duration: 0.6, 
      x: -40, 
      opacity: 0, 
      stagger: 0.08, 
      ease: "power2.out", 
      delay: 0.5 
    });
  }
}

// Показ страницы + анимация
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    if (p.id === pageId) {
      p.classList.add('active');
      animatePageIn(pageId);
    } else {
      p.classList.remove('active');
      gsap.to(p, { duration: 0.4, x: -30, opacity: 0, ease: "power2.in" });
    }
  });

  // Заголовок
  const title = document.querySelector('.page-title');
  if (pageId === 'home') title.textContent = 'WEB SHOP';
  if (pageId === 'catalog') title.textContent = 'Каталог';
  if (pageId === 'wishlist') title.textContent = 'Желаемые товары';
  if (pageId === 'cart') title.textContent = 'Оформление заказа';
  if (pageId === 'profile') title.textContent = 'Кабинет';

  // Active в bottom nav
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

  // Анимация active кнопки в навбаре
  gsap.to(`[data-page="${pageId}"]`, { 
    duration: 0.4, 
    scale: 1.15, 
    y: -8, 
    ease: "back.out(1.7)" 
  });
  gsap.to(`[data-page="${pageId}"]`, { 
    duration: 0.6, 
    scale: 1, 
    y: 0, 
    delay: 0.4, 
    ease: "power2.out" 
  });
}

// Клик по bottom nav
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    showPage(page);
  });
});

// Клик по категориям → каталог
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => showPage('catalog'));
});

// Продукты (с анимацией stagger)
const productsContainer = document.getElementById('products');
const sampleProducts = [
  { name: 'Ботинки Yama Fur', brand: 'Wrangler', price: '8 495₽', inStock: true, img: 'https://via.placeholder.com/300x360/8B4513/fff?text=Yama+Fur' },
  { name: 'Ботинки Высокие Creek Fur', brand: 'Wrangler', price: '8 495₽', inStock: true, img: 'https://via.placeholder.com/300x360/556B2F/fff?text=Creek+Fur' },
  // добавь ещё...
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

// Back button
function goBack() {
  showPage('home');
}

// Инициализация — первая анимация главной
showPage('home');
