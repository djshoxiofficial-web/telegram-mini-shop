const categoriesContainer = document.getElementById("categories");
const productsContainer = document.getElementById("products");

let catalogData = {};
let activeCategory = "Все";

fetch("data/catalog.json")
  .then(res => res.json())
  .then(data => {
    catalogData = data;
    renderCategories();
    renderProducts();
  });

function renderCategories() {
  categoriesContainer.innerHTML = "";

  const allBtn = createCategoryButton("Все");
  categoriesContainer.appendChild(allBtn);

  catalogData.categories.forEach(cat => {
    categoriesContainer.appendChild(createCategoryButton(cat));
  });
}

function createCategoryButton(name) {
  const btn = document.createElement("button");
  btn.className = "category-btn";
  btn.textContent = name;

  if (name === activeCategory) btn.classList.add("active");

  btn.onclick = () => {
    activeCategory = name;
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts();
  };

  return btn;
}

function renderProducts() {
  productsContainer.innerHTML = "";

  const filtered =
    activeCategory === "Все"
      ? catalogData.products
      : catalogData.products.filter(p => p.category === activeCategory);

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}" />
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price} ₽</div>
    `;

    productsContainer.appendChild(div);
  });
}
