const categoriesEl = document.getElementById("categories");
const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");

let data;
let cart = [];
let activeCategory = "Все";

fetch("/data/catalog.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    renderCategories();
    renderProducts();
  });

function renderCategories() {
  categoriesEl.innerHTML = "";
  ["Все", ...data.categories].forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    if (cat === activeCategory) btn.classList.add("active");

    btn.onclick = () => {
      activeCategory = cat;
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts();
    };

    categoriesEl.appendChild(btn);
  });
}

function renderProducts() {
  productsEl.innerHTML = "";
  const items = activeCategory === "Все"
    ? data.products
    : data.products.filter(p => p.category === activeCategory);

  items.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    const btn = document.createElement("button");
    btn.textContent = "В корзину";
    btn.onclick = () => addToCart(p);

    div.innerHTML = `
      <img src="${p.image}">
      <div class="product-name">${p.name}</div>
      <div class="product-price">${p.price} ₽</div>
    `;
    div.appendChild(btn);

    productsEl.appendChild(div);
  });
}

function addToCart(product) {
  cart.push(product);
  cartCountEl.textContent = cart.length;
}

function openCart() {
  cartEl.classList.add("open");
  renderCart();
}

function closeCart() {
  cartEl.classList.remove("open");
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} — ${item.price} ₽`;
    cartItemsEl.appendChild(div);
  });
}
