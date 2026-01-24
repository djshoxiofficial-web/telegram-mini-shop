const categories = [
    { id: 'all', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'books', name: 'Books' }
];

const products = [
    { id: 1, name: 'Product 1', price: 10, category: 'electronics', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 20, category: 'clothing', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: 30, category: 'books', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', price: 40, category: 'electronics', image: 'https://via.placeholder.com/150' }
];

let currentScreen = 'home';
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCategories() {
    const categoriesContainer = document.querySelector('#catalog-screen .categories');
    categoriesContainer.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('div');
        btn.classList.add('category');
        btn.textContent = cat.name;
        btn.dataset.category = cat.id;
        btn.addEventListener('click', () => filterProducts(cat.id));
        categoriesContainer.appendChild(btn);
    });
    categoriesContainer.querySelector('.category:first-child').classList.add('active');
}

function renderProducts(container, items, isWishlist = false, isCart = false) {
    container.innerHTML = '';
    items.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button class="wish-btn ${wishlist.includes(product.id) ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"/>
                    <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"/>
                </svg>
            </button>
            <button class="cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"/>
                </svg>
            </button>
        `;
        card.querySelector('.wish-btn').addEventListener('click', () => toggleWishlist(product.id));
        card.querySelector('.cart-btn').addEventListener('click', () => addToCart(product.id));
        container.appendChild(card);
    });
}

function filterProducts(category) {
    const buttons = document.querySelectorAll('.category');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.category[data-category="${category}"]`).classList.add('active');

    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(document.querySelector('#catalog-screen .products'), filtered);
}

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(w => w !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateBadges();
    if (currentScreen === 'wishlist') {
        renderWishlist();
    }
    // Update button state in all visible cards
    document.querySelectorAll('.wish-btn').forEach(btn => {
        const card = btn.closest('.product-card');
        if (card) {
            const prodId = products.find(p => p.name === card.querySelector('h3').textContent).id;
            btn.classList.toggle('active', wishlist.includes(prodId));
        }
    });
}

function addToCart(id) {
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateBadges();
        if (currentScreen === 'cart') {
            renderCart();
        }
    }
}

function renderWishlist() {
    const container = document.querySelector('#wishlist-screen .products');
    const empty = document.querySelector('#wishlist-screen .empty-state');
    const items = products.filter(p => wishlist.includes(p.id));
    if (items.length === 0) {
        container.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        container.classList.remove('hidden');
        empty.classList.add('hidden');
        renderProducts(container, items, true);
    }
}

function renderCart() {
    const container = document.querySelector('#cart-screen .products');
    const empty = document.querySelector('#cart-screen .empty-state');
    const items = products.filter(p => cart.includes(p.id));
    if (items.length === 0) {
        container.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        container.classList.remove('hidden');
        empty.classList.add('hidden');
        renderProducts(container, items, false, true);
    }
}

function updateBadges() {
    document.querySelector('[data-screen="wishlist"] .badge').textContent = wishlist.length;
    document.querySelector('[data-screen="wishlist"] .badge').classList.toggle('hidden', wishlist.length === 0);
    document.querySelector('[data-screen="cart"] .badge').textContent = cart.length;
    document.querySelector('[data-screen="cart"] .badge').classList.toggle('hidden', cart.length === 0);
}

function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.querySelector(`#${screen}-screen`);
    target.classList.remove('hidden');
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-screen="${screen}"]`).classList.add('active');

    if (screen === 'catalog') {
        filterProducts('all');
    } else if (screen === 'wishlist') {
        renderWishlist();
    } else if (screen === 'cart') {
        renderCart();
    }

    currentScreen = screen;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts(document.querySelector('#catalog-screen .products'), products);
    updateBadges();
    switchScreen('home');

    document.querySelectorAll('.bottom-nav button').forEach(btn => {
        btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
    });
});
