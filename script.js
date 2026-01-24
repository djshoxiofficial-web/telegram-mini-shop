gsap.registerPlugin(ScrollTrigger);

const products = [
  { id:1, name:"Джинсы Slim", brand:"Levi's", price:6290, gender:"male", img:"https://via.placeholder.com/300x390/000/fff?text=Jeans" },
  { id:2, name:"Джинсы Mom Fit", brand:"Wrangler", price:5490, gender:"female", img:"https://via.placeholder.com/300x390/8B4513/fff?text=Mom+Fit" },
  { id:3, name:"Футболка Oversize", brand:"Nike", price:2990, gender:"unisex", img:"https://via.placeholder.com/300x390/FF0000/fff?text=Oversize" },
  { id:4, name:"Худи Logo", brand:"Adidas", price:4590, gender:"unisex", img:"https://via.placeholder.com/300x390/000/fff?text=Hoodie" },
  { id:5, name:"Кроссовки Air Max", brand:"Nike", price:11990, gender:"unisex", img:"https://via.placeholder.com/300x390/FFFFFF/000?text=Air+Max" }
];

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let priceFrom = 0;
let priceTo = Infinity;

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

function renderProducts(filter = 'all', sort = 'default', search = '') {
  const container = document.getElementById('products');
  container.innerHTML = '';

  let filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'all' && p.gender !== filter) return false;
    if (p.price < priceFrom || p.price > priceTo) return false;
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
      </div>
      <div class="actions">
        <button class="heart-btn ${isInWishlist(p.id) ? 'active' : ''}" data-id="${p.id}"></button>
        <button class="cart-btn ${isInCart(p.id) ? 'active' : ''}" data-id="${p.id}"></button>
      </div>
    `;
    container.appendChild(card);
  });

  gsap.utils.toArray(".product-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 85%" },
      y: 60, opacity: 0, duration: 0.8, ease: "power3.out", delay: i * 0.1
    });
  });

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
    };
  });

  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.dataset.id;
      if (!isInCart(id)) {
        cart.push({ id, qty: 1 });
        btn.classList.add('active');
      }
      saveState();
      updateBadges();
    };
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${pageId}"]`)?.classList.add('active');

  if (pageId === 'catalog') renderProducts();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => showPage(btn.dataset.page);
});

document.querySelectorAll('.cat-btn[data-gender]').forEach(btn => {
  btn.onclick = () => showPage('catalog');
});

updateBadges();
showPage('home');
