const categories = [
    { id: 'all', name: 'Все' },
    { id: 'jeans', name: 'Джинсы' },
    { id: 'jackets', name: 'Куртки' },
    { id: 'shirts', name: 'Рубашки' },
    { id: 'tshirts', name: 'Футболки' },
    { id: 'accessories', name: 'Аксессуары' }
];

const products = [
    { id: 1, name: 'Скинни джинсы чёрные рваные', price: 4590, category: 'jeans', img: 'https://images.unsplash.com/photo-1602293589932-d4d7e968a6a3?w=400' },
    { id: 2, name: 'Джинсовая куртка оверсайз', price: 6890, category: 'jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { id: 3, name: 'Белая футболка базовая', price: 1890, category: 'tshirts', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400' },
    { id: 4, name: 'Рубашка в клетку', price: 3490, category: 'shirts', img: 'https://images.unsplash.com/photo-1600185365926-3a6d3a1b0d9f?w=400' },
    { id: 5, name: 'Мом джинсы светлые', price: 5290, category: 'jeans', img: 'https://images.unsplash.com/photo-1541099649102-63e9671d437e?w=400' },
    { id: 6, name: 'Кепка классическая', price: 1490, category: 'accessories', img: 'https://images.unsplash.com/photo-1576871333932-2a5c530d5e6f?w=400' }
];

let wishlist = JSON.parse(localStorage.getItem('ws-wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('ws-cart')) || [];

const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-btn');

function switchScreen(target) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');

    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`).classList.add('active');

    if (target === 'catalog') renderCatalog();
    if (target === 'wishlist') renderWishlist();
    if (target === 'cart') renderCart();
}

function renderCategories() {
    const container = document.querySelector('.categories');
    container.innerHTML = '';
    categories.forEach((cat, i) => {
        const el = document.createElement('div');
        el.className = 'category' + (i === 0 ? ' active' : '');
        el.textContent = cat.name;
        el.dataset.id = cat.id;
        el.addEventListener('click', () => {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            renderProducts(cat.id);
        });
        container.appendChild(el);
    });
}

function renderProducts(categoryId = 'all') {
    const container = document.querySelector('.products-grid');
    container.innerHTML = '';

    const filtered = categoryId === 'all'
        ? products
        : products.filter(p => p.category === categoryId);

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="actions-row">
                    <button class="btn-icon wish-btn ${wishlist.includes(p.id) ? 'liked' : ''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-icon cart-btn" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 11-8 0"/></svg>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderWishlist() {
    const container = document.querySelector('.wishlist-grid');
    const empty = document.querySelector('.empty-wishlist');
    container.innerHTML = '';

    const items = products.filter(p => wishlist.includes(p.id));

    if (items.length === 0) {
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

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
                    <button class="btn-icon cart-btn" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 11-8 0"/></svg>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderCart() {
    const container = document.querySelector('.cart-grid');
    const empty = document.querySelector('.empty-cart');
    container.innerHTML = '';

    const items = products.filter(p => cart.includes(p.id));

    if (items.length === 0) {
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

    items.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="actions-row">
                    <button class="btn-icon wish-btn ${wishlist.includes(p.id) ? 'liked' : ''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-icon cart-btn" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 11-8 0"/></svg>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateBadges() {
    const wBadge = document.querySelector('.wishlist-badge');
    const cBadge = document.querySelector('.cart-badge');

    wBadge.textContent = wishlist.length;
    wBadge.classList.toggle('hidden', wishlist.length < 1);

    cBadge.textContent = cart.length;
    cBadge.classList.toggle('hidden', cart.length < 1);
}

function toggleWish(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('ws-wishlist', JSON.stringify(wishlist));
    updateBadges();

    // обновляем все сердечки на странице
    document.querySelectorAll(`.wish-btn[data-id="${id}"]`).forEach(el => {
        el.classList.toggle('liked');
    });

    if (document.getElementById('wishlist').classList.contains('active')) {
        renderWishlist();
    }
}

function addToCart(id) {
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('ws-cart', JSON.stringify(cart));
        updateBadges();

        if (document.getElementById('cart').classList.contains('active')) {
            renderCart();
        }
    }
}

document.addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (btn) {
        const target = btn.dataset.target;
        switchScreen(target);
        return;
    }

    const wishBtn = e.target.closest('.wish-btn');
    if (wishBtn) {
        const id = Number(wishBtn.dataset.id);
        toggleWish(id);
        return;
    }

    const cartBtn = e.target.closest('.cart-btn');
    if (cartBtn) {
        const id = Number(cartBtn.dataset.id);
        addToCart(id);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateBadges();
    switchScreen('home');
});
