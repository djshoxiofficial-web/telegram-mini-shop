// ДАННЫЕ
const categories = [
    { id: 'all',     name: 'Все'         },
    { id: 'jeans',   name: 'Джинсы'      },
    { id: 'jackets', name: 'Куртки'      },
    { id: 'shirts',  name: 'Рубашки'     },
    { id: 'tshirts', name: 'Футболки'    },
    { id: 'access',  name: 'Аксессуары'  }
];

const products = [
    { id: 1,  name: 'Скинни джинсы чёрные рваные',      price: 4590, category: 'jeans',   img: 'https://images.unsplash.com/photo-1602293589932-d4d7e968a6a3?w=800' },
    { id: 2,  name: 'Джинсовая куртка оверсайз',        price: 6890, category: 'jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' },
    { id: 3,  name: 'Белая футболка базовая',           price: 1890, category: 'tshirts', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800' },
    { id: 4,  name: 'Рубашка в крупную клетку',         price: 3490, category: 'shirts',  img: 'https://images.unsplash.com/photo-1600185365926-3a6d3a1b0d9f?w=800' },
    { id: 5,  name: 'Мом джинсы светло-голубые',        price: 5290, category: 'jeans',   img: 'https://images.unsplash.com/photo-1541099649102-63e9671d437e?w=800' },
    { id: 6,  name: 'Кепка классическая чёрная',        price: 1490, category: 'access',  img: 'https://images.unsplash.com/photo-1576871333932-2a5c530d5e6f?w=800' }
];

// Хранилище
let wishlist = JSON.parse(localStorage.getItem('webshop-wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('webshop-cart')) || [];

// Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Элементы DOM
const screens     = document.querySelectorAll('.screen');
const navButtons  = document.querySelectorAll('.nav-btn');
const modal       = document.getElementById('product-modal');
const modalImg    = document.getElementById('modal-img');
const modalTitle  = document.getElementById('modal-title');
const modalPrice  = document.getElementById('modal-price');
const modalCartBtn = document.getElementById('modal-cart-btn');
const modalWishBtn = document.getElementById('modal-wish-btn');

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

// Рендер товаров каталога
function renderProducts(catId = 'all') {
    const cont = document.querySelector('#catalog .products-grid');
    cont.innerHTML = '';
    const filtered = catId === 'all' ? products : products.filter(p => p.category === catId);

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.dataset.id = p.id;
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="actions-row">
                    <button class="btn-icon wish-btn ${wishlist.includes(p.id)?'liked':''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button class="btn-icon cart-btn ${cart.some(item => item.id === p.id)?'in-cart':''}" data-id="${p.id}">
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
    const cont = document.querySelector('.wishlist-grid');
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

    items.forEach(p => renderProductCard(cont, p, true, false));
}

// Рендер корзины
function renderCart() {
    const cont = document.querySelector('.cart-grid');
    const empty = document.querySelector('.empty-cart');
    const totalBlock = document.querySelector('.cart-total');
    cont.innerHTML = '';

    if (cart.length === 0) {
        empty.classList.remove('hidden');
        cont.classList.add('hidden');
        totalBlock.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    cont.classList.remove('hidden');
    totalBlock.classList.remove('hidden');

    let sum = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        sum += product.price * item.qty;
        renderProductCard(cont, product, wishlist.includes(item.id), true, item.qty);
    });

    document.getElementById('cart-sum').textContent = sum.toLocaleString() + ' ₽';
}

// Универсальный рендер карточки
function renderProductCard(container, p, isLiked, inCartScreen = false, qty = 1) {
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.id = p.id;
    div.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="product-info">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${p.price} ₽</div>
            ${inCartScreen ? `
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${p.id}">-</button>
                    <span>${qty}</span>
                    <button class="quantity-btn plus" data-id="${p.id}">+</button>
                </div>
            ` : ''}
            <div class="actions-row">
                <button class="btn-icon wish-btn ${isLiked?'liked':''}" data-id="${p.id}">
                    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                ${!inCartScreen ? `
                    <button class="btn-icon cart-btn ${cart.some(c => c.id === p.id)?'in-cart':''}" data-id="${p.id}">
                        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 11-8 0"/></svg>
                    </button>
                ` : `
                    <button class="btn-remove" data-id="${p.id}">Удалить</button>
                `}
            </div>
        </div>
    `;
    container.appendChild(div);
}

// Обновление бейджей
function updateBadges() {
    const wb = document.querySelector('.wishlist-badge');
    const cb = document.querySelector('.cart-badge');

    wb.textContent = wishlist.length;
    wb.classList.toggle('hidden', wishlist.length === 0);

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cb.textContent = cartCount;
    cb.classList.toggle('hidden', cartCount === 0);
}

// Показать модалку товара
function showProductModal(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    modalImg.src = p.img;
    modalTitle.textContent = p.name;
    modalPrice.textContent = p.price + ' ₽';

    const inWish = wishlist.includes(id);
    const inCart = cart.some(item => item.id === id);

    modalWishBtn.classList.toggle('liked', inWish);
    modalCartBtn.textContent = inCart ? 'Уже в корзине' : 'В корзину';

    modal.classList.remove('hidden');
    modal.classList.add('active');
}

// Закрыть модалку
function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
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
    document.querySelectorAll(`.wish-btn[data-id="${id}"]`).forEach(el => el.classList.toggle('liked'));
    if (document.getElementById('wishlist').classList.contains('active')) renderWishlist();
}

// Управление корзиной
function updateCartItem(id, delta) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx === -1) {
        if (delta > 0) {
            cart.push({ id, qty: 1 });
        }
    } else {
        cart[idx].qty = Math.max(1, cart[idx].qty + delta);
        if (cart[idx].qty === 0) cart.splice(idx, 1);
    }
    localStorage.setItem('webshop-cart', JSON.stringify(cart));
    updateBadges();
    if (document.getElementById('cart').classList.contains('active')) renderCart();
}

// Обработчик всех кликов
document.addEventListener('click', e => {
    const t = e.target;

    // Навигация
    if (t.closest('.nav-btn')) {
        const target = t.closest('.nav-btn').dataset.target;
        switchScreen(target);
        return;
    }

    // Сердечко
    if (t.closest('.wish-btn')) {
        const id = Number(t.closest('.wish-btn').dataset.id);
        toggleWish(id);
        return;
    }

    // Кнопка + / − в корзине
    if (t.classList.contains('plus') || t.classList.contains('minus')) {
        const id = Number(t.dataset.id);
        const delta = t.classList.contains('plus') ? 1 : -1;
        updateCartItem(id, delta);
        return;
    }

    // Удалить из корзины / избранного
    if (t.classList.contains('btn-remove')) {
        const id = Number(t.dataset.id);
        const screen = t.closest('.screen').id;
        if (screen === 'cart') {
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('webshop-cart', JSON.stringify(cart));
            renderCart();
        } else if (screen === 'wishlist') {
            wishlist = wishlist.filter(x => x !== id);
            localStorage.setItem('webshop-wishlist', JSON.stringify(wishlist));
            renderWishlist();
        }
        updateBadges();
        return;
    }

    // Открыть карточку товара
    if (t.closest('.product') && !t.closest('.btn-icon') && !t.closest('.btn-remove') && !t.closest('.quantity-btn')) {
        const id = Number(t.closest('.product').dataset.id);
        showProductModal(id);
        return;
    }

    // Закрыть модалку
    if (t.classList.contains('modal-close') || t === modal) {
        closeModal();
        return;
    }

    // Действия в модалке
    if (t.id === 'modal-wish-btn') {
        const id = products.find(p => p.name === modalTitle.textContent)?.id;
        if (id) toggleWish(id);
        modalWishBtn.classList.toggle('liked');
        return;
    }

    if (t.id === 'modal-cart-btn') {
        const id = products.find(p => p.name === modalTitle.textContent)?.id;
        if (id) updateCartItem(id, 1);
        modalCartBtn.textContent = 'Уже в корзине';
        return;
    }

    // Отправить заказ в Telegram
    if (t.id === 'send-order-btn') {
        if (cart.length === 0) return;

        const order = cart.map(item => {
            const p = products.find(prod => prod.id === item.id);
            return `${p.name} × ${item.qty} = ${p.price * item.qty} ₽`;
        }).join('\n');

        const total = cart.reduce((sum, item) => {
            const p = products.find(prod => prod.id === item.id);
            return sum + p.price * item.qty;
        }, 0);

        const message = `Новый заказ!\n\n${order}\n\nИтого: ${total} ₽`;

        tg.sendData(JSON.stringify({
            action: 'new_order',
            items: cart,
            total: total,
            message: message
        }));

        tg.showAlert('Заказ отправлен!', () => {
            cart = [];
            localStorage.setItem('webshop-cart', JSON.stringify(cart));
            renderCart();
            updateBadges();
        });
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateBadges();
    switchScreen('home');

    // Для теста: tg.MainButton.text = "Оформить заказ";
    // tg.MainButton.show();
    // tg.MainButton.onClick(() => document.getElementById('send-order-btn').click());
});
