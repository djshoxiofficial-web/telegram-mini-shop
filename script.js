// Данные
const categories = [
    { id: 'all', name: 'Все' },
    { id: 'monobukety', name: 'Монобукеты' },
    { id: 'sbornye', name: 'Сборные букеты' },
    { id: 'kompozicii-v-korzine', name: 'Композиции в корзине' },
    { id: 'ekzoticheskie-ohapki', name: 'Экзотические охапки' },
    { id: 'banchi', name: 'Банчи' },
    { id: 'svadebnye', name: 'Свадебные букеты' }
];

const products = [
    { id: 1, name: 'Нежный пионный монобукет', price: 4500, category: 'monobukety', img: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800' },
    { id: 2, name: 'Сборный микс роз и эвкалипта', price: 7800, category: 'sbornye', img: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=800' },
    { id: 3, name: 'Белая композиция в корзине', price: 9200, category: 'kompozicii-v-korzine', img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d26?w=800' },
    { id: 4, name: 'Экзотическая охапка протеи и орхидей', price: 13500, category: 'ekzoticheskie-ohapki', img: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800' },
    { id: 5, name: 'Банчи пастельных оттенков', price: 6800, category: 'banchi', img: 'https://images.unsplash.com/photo-1591883151848-5b2c6e3c0b3e?w=800' },
    { id: 6, name: 'Свадебный каскад из пионов и роз', price: 18500, category: 'svadebnye', img: 'https://images.unsplash.com/photo-1519227355832-2b7a8c0d8d3a?w=800' },
    { id: 7, name: 'Монобукет полевых цветов', price: 3800, category: 'monobukety', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800' }
];

let wishlist = JSON.parse(localStorage.getItem('bm-wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('bm-cart')) || [];

// Элементы
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-btn');
const orderModal = document.getElementById('order-modal');

// Переключение экранов
function switchScreen(target) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');

    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`).classList.add('active');

    if (target === 'catalog') renderProducts();
    if (target === 'wishlist') renderWishlist();
    if (target === 'cart') renderCart();
}

// Рендер категорий
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

// Применение фильтров
function applyFilters() {
    const priceMax = document.getElementById('price-range').value;
    const gamma = document.getElementById('gamma-filter').value;
    const type = document.getElementById('type-filter').value;

    document.getElementById('price-value').textContent = `до ${Number(priceMax).toLocaleString()} ₽`;

    renderProducts('all', priceMax, gamma, type);
}

// Рендер товаров
function renderProducts(catId = 'all', priceMax = 30000, gamma = 'all', type = 'all') {
    const cont = document.querySelector('#catalog .products-grid');
    cont.innerHTML = '';

    let filtered = products;

    if (catId !== 'all') filtered = filtered.filter(p => p.category === catId);
    filtered = filtered.filter(p => p.price <= priceMax);
    if (type !== 'all') filtered = filtered.filter(p => p.category === type);

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price.toLocaleString()} ₽</div>
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

// Рендер корзины с количеством и суммой
function renderCart() {
    const cont = document.querySelector('.cart-grid');
    const empty = document.querySelector('.empty-cart');
    const totalBlock = document.querySelector('.cart-total');
    cont.innerHTML = '';

    if (cart.length === 0) {
        empty.classList.remove('hidden');
        totalBlock.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    totalBlock.classList.remove('hidden');

    let total = 0;

    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        if (!p) return;
        total += p.price * item.qty;

        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price.toLocaleString()} ₽</div>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${p.id}">-</button>
                    <span>${item.qty}</span>
                    <button class="quantity-btn plus" data-id="${p.id}">+</button>
                </div>
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

    document.getElementById('cart-sum').textContent = total.toLocaleString() + ' ₽';
}

// Обновление бейджей
function updateBadges() {
    const w = document.querySelector('.wishlist-badge');
    const c = document.querySelector('.cart-badge');

    w.textContent = wishlist.length;
    w.classList.toggle('hidden', wishlist.length === 0);

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    c.textContent = cartCount;
    c.classList.toggle('hidden', cartCount === 0);
}

// Переключение избранного
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

// Управление корзиной
function updateCartItem(id, delta) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx === -1) {
        if (delta > 0) cart.push({ id, qty: 1 });
    } else {
        cart[idx].qty = Math.max(1, cart[idx].qty + delta);
        if (cart[idx].qty === 0) cart.splice(idx, 1);
    }
    localStorage.setItem('bm-cart', JSON.stringify(cart));
    updateBadges();
    if (document.getElementById('cart').classList.contains('active')) renderCart();
}

// Открыть модалку заказа
function openOrderModal() {
    orderModal.classList.remove('hidden');
    orderModal.classList.add('active');
}

// Закрыть модалку
function closeOrderModal() {
    orderModal.classList.remove('active');
    setTimeout(() => orderModal.classList.add('hidden'), 300);
}

// Отправка формы (имитация)
function submitOrder(e) {
    e.preventDefault();
    alert('Заказ отправлен! Менеджер свяжется с вами в ближайшее время.');
    closeOrderModal();
    // здесь можно добавить tg.sendData или очистку корзины
    cart = [];
    localStorage.setItem('bm-cart', JSON.stringify(cart));
    renderCart();
    updateBadges();
}

// Обработчик кликов
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
        updateCartItem(Number(cartBtn.dataset.id), 1);
        return;
    }

    const minus = e.target.closest('.minus');
    if (minus) {
        updateCartItem(Number(minus.dataset.id), -1);
        return;
    }

    const plus = e.target.closest('.plus');
    if (plus) {
        updateCartItem(Number(plus.dataset.id), 1);
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
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('bm-cart', JSON.stringify(cart));
            renderCart();
        }
        updateBadges();
    }

    if (e.target.classList.contains('btn-checkout')) {
        openOrderModal();
        return;
    }

    if (e.target.classList.contains('modal-close') || e.target === orderModal) {
        closeOrderModal();
        return;
    }
});

document.getElementById('order-form').addEventListener('submit', submitOrder);

// события фильтров
document.addEventListener('input', e => {
    if (e.target.id === 'price-range') applyFilters();
});

document.addEventListener('change', e => {
    if (e.target.id === 'gamma-filter' || e.target.id === 'type-filter') applyFilters();
});

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateBadges();
    switchScreen('home');
});
