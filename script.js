// Данные — редактируй здесь
const categories = [
    { id: 'all',     name: 'Все'         },
    { id: 'jeans',   name: 'Джинсы'      },
    { id: 'jackets', name: 'Куртки'      },
    { id: 'shirts',  name: 'Рубашки'     },
    { id: 'tshirts', name: 'Футболки'    },
    { id: 'access',  name: 'Аксессуары'  }
];

const products = [
    { id: 1,  name: 'Скинни джинсы чёрные рваные',      price: 4590, category: 'jeans',   img: 'https://images.unsplash.com/photo-1602293589932-d4d7e968a6a3?w=400' },
    { id: 2,  name: 'Джинсовая куртка оверсайз',        price: 6890, category: 'jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { id: 3,  name: 'Белая футболка базовая',           price: 1890, category: 'tshirts', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400' },
    { id: 4,  name: 'Рубашка в крупную клетку',         price: 3490, category: 'shirts',  img: 'https://images.unsplash.com/photo-1600185365926-3a6d3a1b0d9f?w=400' },
    { id: 5,  name: 'Мом джинсы светло-голубые',        price: 5290, category: 'jeans',   img: 'https://images.unsplash.com/photo-1541099649102-63e9671d437e?w=400' },
    { id: 6,  name: 'Кепка классическая чёрная',        price: 1490, category: 'access',  img: 'https://images.unsplash.com/photo-1576871333932-2a5c530d5e6f?w=400' },
    { id: 7,  name: 'Кожаная куртка чёрная',            price: 8990, category: 'jackets', img: 'https://images.unsplash.com/photo-1521223341520-5d9d352b31b0?w=400' },
    { id: 8,  name: 'Футболка oversize с принтом',      price: 2290, category: 'tshirts', img: 'https://images.unsplash.com/photo-1521575107034-e0fa0b594529?w=400' },
    { id: 9,  name: 'Рубашка белая slim fit',           price: 2990, category: 'shirts',  img: 'https://images.unsplash.com/photo-1603252109303-533cc7260601?w=400' },
    { id: 10, name: 'Кожаный ремень классический',      price: 1990, category: 'access',  img: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=400' }
];

// Хранилище
let wishlist = JSON.parse(localStorage.getItem('webshop-wishlist')) || [];
let cart     = JSON.parse(localStorage.getItem('webshop-cart'))     || [];

// Элементы
const screens     = document.querySelectorAll('.screen');
const navButtons  = document.querySelectorAll('.nav-btn');

// Переключение экранов
function switchScreen(target) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');

    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`).classList.add('active');

    if (target === 'catalog')   renderProducts();
    if (target === 'wishlist')  renderWishlist();
    if (target === 'cart')      renderCart();
}

// Рендер категорий
function renderCategories() {
    const cont = document.querySelector('.categories');
    cont.innerHTML = '';
    categories.forEach((cat, i) => {
        const el = document.createElement('div');
        el.className = `category${i === 0 ? ' active' : ''}`;
        el.textContent = cat.name;
        el.dataset.id = cat.id;
        el.onclick = () => {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            renderProducts(cat.id);
        };
        cont.appendChild(el);
    });
}

// Рендер товаров (каталог)
function renderProducts(catId = 'all') {
    const cont = document.querySelector('#catalog .products-grid');
    cont.innerHTML = '';

    const filtered = catId === 'all' ? products : products.filter(p => p.category === catId);

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="actions-row">
                    <button class="btn-icon wish-btn ${wishlist.includes(p.id)?'liked':''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-icon cart-btn ${cart.includes(p.id)?'in-cart':''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 11-8 0"/></svg>
                    </button>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
}

// Рендер избранного
function renderWishlist() {
    const cont  = document.querySelector('.wishlist-grid');
    const empty = document.querySelector('.empty-wishlist');
    cont.innerHTML = '';

    const items = products.filter(p => wishlist.includes(p.id));

    if (items.length === 0) {
        empty.classList.remove('hidden');
        cont.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    cont.classList.remove('hidden');

    items.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="actions-row">
                    <button class="btn-icon wish-btn liked" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-remove" data-id="${p.id}">Удалить</button>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
}

// Рендер корзины
function renderCart() {
    const cont  = document.querySelector('.cart-grid');
    const empty = document.querySelector('.empty-cart');
    cont.innerHTML = '';

    const items = products.filter(p => cart.includes(p.id));

    if (items.length === 0) {
        empty.classList.remove('hidden');
        cont.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    cont.classList.remove('hidden');

    items.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="actions-row">
                    <button class="btn-icon wish-btn ${wishlist.includes(p.id)?'liked':''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-remove" data-id="${p.id}">Удалить</button>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
}

// Обновление бейджей
function updateBadges() {
    const wb = document.querySelector('.wishlist-badge');
    const cb = document.querySelector('.cart-badge');

    wb.textContent = wishlist.length;
    wb.classList.toggle('hidden', wishlist.length === 0);

    cb.textContent = cart.length;
    cb.classList.toggle('hidden', cart.length === 0);
}

// Переключение избранного
function toggleWish(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('webshop-wishlist', JSON.stringify(wishlist));
    updateBadges();
    refreshAllWishButtons(id);
    if (document.getElementById('wishlist').classList.contains('active')) renderWishlist();
}

// Переключение корзины
function toggleCart(id) {
    if (cart.includes(id)) {
        cart = cart.filter(x => x !== id);
    } else {
        cart.push(id);
    }
    localStorage.setItem('webshop-cart', JSON.stringify(cart));
    updateBadges();
    refreshAllCartButtons(id);
    if (document.getElementById('cart').classList.contains('active')) renderCart();
}

// Обновить все сердечки на странице
function refreshAllWishButtons(id) {
    document.querySelectorAll(`.wish-btn[data-id="${id}"]`).forEach(el => {
        el.classList.toggle('liked', wishlist.includes(id));
    });
}

// Обновить все кнопки корзины на странице
function refreshAllCartButtons(id) {
    document.querySelectorAll(`.cart-btn[data-id="${id}"]`).forEach(el => {
        el.classList.toggle('in-cart', cart.includes(id));
    });
}

// Удаление из избранного / корзины
function removeFromList(id, listType) {
    if (listType === 'wishlist') {
        wishlist = wishlist.filter(x => x !== id);
        localStorage.setItem('webshop-wishlist', JSON.stringify(wishlist));
        updateBadges();
        renderWishlist();
    } else if (listType === 'cart') {
        cart = cart.filter(x => x !== id);
        localStorage.setItem('webshop-cart', JSON.stringify(cart));
        updateBadges();
        renderCart();
    }
    refreshAllWishButtons(id);
    refreshAllCartButtons(id);
}

// Обработчик кликов
document.addEventListener('click', e => {
    // Навигация
    const nav = e.target.closest('.nav-btn');
    if (nav) {
        switchScreen(nav.dataset.target);
        return;
    }

    // Сердечко
    const wish = e.target.closest('.wish-btn');
    if (wish) {
        toggleWish(Number(wish.dataset.id));
        return;
    }

    // Корзина (добавление/удаление)
    const cartBtn = e.target.closest('.cart-btn');
    if (cartBtn) {
        toggleCart(Number(cartBtn.dataset.id));
        return;
    }

    // Кнопка "Удалить" в wishlist/cart
    const removeBtn = e.target.closest('.btn-remove');
    if (removeBtn) {
        const id = Number(removeBtn.dataset.id);
        const parentScreen = removeBtn.closest('.screen').id;
        const listType = parentScreen === 'wishlist' ? 'wishlist' : 'cart';
        removeFromList(id, listType);
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateBadges();
    switchScreen('home');
});
