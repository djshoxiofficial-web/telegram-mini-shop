// Данные — редактируй здесь
const categories = [
    { id: 'all', name: 'Все' },
    { id: 'monobuket', name: 'Монобукеты' },
    { id: 'sborny', name: 'Сборные' },
    { id: 'v-korzine', name: 'В корзине' },
    { id: 'exotic', name: 'Экзотические охапки' },
    { id: 'banchi', name: 'Банчи' },
    { id: 'svadebnye', name: 'Свадебные' }
];

const products = [
    { id: 1, name: 'Нежный пион и роза', price: 4500, category: 'monobuket', img: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800' },
    { id: 2, name: 'Сборный микс сезонный', price: 7800, category: 'sborny', img: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=800' },
    { id: 3, name: 'Белоснежный в корзине', price: 9200, category: 'v-korzine', img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d26?w=800' },
    { id: 4, name: 'Экзотическая охапка', price: 13500, category: 'exotic', img: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800' },
    { id: 5, name: 'Банчи нежный', price: 6800, category: 'banchi', img: 'https://images.unsplash.com/photo-1591883151848-5b2c6e3c0b3e?w=800' },
    { id: 6, name: 'Свадебный каскад', price: 18500, category: 'svadebnye', img: 'https://images.unsplash.com/photo-1519227355832-2b7a8c0d8d3a?w=800' }
];

let wishlist = JSON.parse(localStorage.getItem('bm-wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('bm-cart')) || [];

const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-btn');

function switchScreen(target) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');

    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`).classList.add('active');

    if (target === 'catalog') renderProducts();
    if (target === 'wishlist') renderWishlist();
    if (target === 'cart') renderCart();
}

function renderCategories() {
    const cont = document.querySelector('.categories');
    cont.innerHTML = '';
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
        cont.appendChild(el);
    });
}

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
                    <button class="btn-icon wish-btn ${wishlist.includes(p.id) ? 'liked' : ''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-icon cart-btn" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 11-8 0"/></svg>
                    </button>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
}

function renderWishlist() {
    const cont = document.querySelector('.wishlist-grid');
    const empty = document.querySelector('.empty-wishlist');
    cont.innerHTML = '';

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
                    <button class="btn-remove" data-id="${p.id}">Удалить</button>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
}

function renderCart() {
    const cont = document.querySelector('.cart-grid');
    const empty = document.querySelector('.empty-cart');
    cont.innerHTML = '';

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
                    <button class="btn-remove" data-id="${p.id}">Удалить</button>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
}

function updateBadges() {
    const w = document.querySelector('.wishlist-badge');
    const c = document.querySelector('.cart-badge');

    w.textContent = wishlist.length;
    w.classList.toggle('hidden', wishlist.length === 0);

    c.textContent = cart.length;
    c.classList.toggle('hidden', cart.length === 0);
}

function toggleWish(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('bm-wishlist', JSON.stringify(wishlist));
    updateBadges();

    document.querySelectorAll(`.wish-btn[data-id="${id}"]`).forEach(el => {
        el.classList.toggle('liked', wishlist.includes(id));
    });

    if (document.getElementById('wishlist').classList.contains('active')) renderWishlist();
}

function addToCart(id) {
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('bm-cart', JSON.stringify(cart));
        updateBadges();

        if (document.getElementById('cart').classList.contains('active')) renderCart();
    }
}

document.addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (btn) {
        switchScreen(btn.dataset.target);
        return;
    }

    const wish = e.target.closest('.wish-btn');
    if (wish) {
        toggleWish(Number(wish.dataset.id));
        return;
    }

    const cartBtn = e.target.closest('.cart-btn');
    if (cartBtn) {
        addToCart(Number(cartBtn.dataset.id));
        return;
    }

    const remove = e.target.closest('.btn-remove');
    if (remove) {
        const id = Number(remove.dataset.id);
        const screen = remove.closest('.screen').id;
        if (screen === 'wishlist') {
            wishlist = wishlist.filter(x => x !== id);
            localStorage.setItem('bm-wishlist', JSON.stringify(wishlist));
            renderWishlist();
        } else if (screen === 'cart') {
            cart = cart.filter(x => x !== id);
            localStorage.setItem('bm-cart', JSON.stringify(cart));
            renderCart();
        }
        updateBadges();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateBadges();
    switchScreen('home');
});
