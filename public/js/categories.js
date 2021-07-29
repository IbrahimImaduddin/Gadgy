const categoryId = new URLSearchParams(window.location.search).get(
  'categoryId'
);

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  selectCategory();
});

const getCategoriesFromDb = async () => {
  let url = 'http://localhost:3000/categories';
  let res = await fetch(url);
  let categories = await res.json();
  return categories;
};

// Populating Categories
const populateCategories = async () => {
  const categories = await getCategoriesFromDb();
  const categoryList = document.querySelector('.category-list');
  removeElements(categoryList);
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.setAttribute('data-id', category.id);
    li.appendChild(document.createTextNode(category.name));
    categoryList.appendChild(li);
  });
  if (categoryId) {
    const lis = Array.from(categoryList.children);
    const targetElementId = lis.findIndex((li) => {
      return li.getAttribute('data-id') == categoryId;
    });
    console.log(targetElementId);
    lis[targetElementId].classList.add('selected');
  } else {
    categoryList.querySelector('li').classList.add('selected');
  }
  updateBrands();
  updateProducts();
};

// Select Category
const selectCategory = async () => {
  const categoryList = document.querySelector('.category-list');
  categoryList.addEventListener('click', (e) => {
    const targetElement = e.target.closest('li');
    if (!targetElement) return;
    categoryList.querySelector('.selected').classList.remove('selected');
    targetElement.classList.add('selected');
    updateBrands();
    updateProducts();
    updateFilterBar();
  });
};

// Populating Brands for Each Category
const updateBrands = async () => {
  const selectedCategory = document.querySelector(
    '.category-list > *.selected'
  );
  const selectedCategoryId = selectedCategory.getAttribute('data-id');
  const brandsContainer = document.getElementById('brands');
  removeElements(brandsContainer);

  // setting default option [Select Brand]
  const defaultOption = document.createElement('option');
  defaultOption.setAttribute('value', null);
  defaultOption.setAttribute('selected', '');
  defaultOption.setAttribute('disabled', '');
  // defaultOption.setAttribute('hidden', '');
  defaultOption.appendChild(document.createTextNode('Please Choose...'));
  brandsContainer.appendChild(defaultOption);
  // set

  let url = `http://localhost:3000/categories/${selectedCategoryId}/brands`;
  const res = await fetch(url);
  const brands = await res.json();
  brands[0].brandList.forEach((brand) => {
    const optionItem = document.createElement('option');
    optionItem.setAttribute('value', brand);
    optionItem.appendChild(document.createTextNode(brand));
    brandsContainer.appendChild(optionItem);
  });
};

// update products
const updateProducts = async (brandName = null) => {
  // grabbing the card and card container
  const productContainer = document.querySelector('.products');
  const cardTemplate = document.getElementById('card-template');
  removeElements(productContainer);
  // getting the selected category
  const selectedCategory = document.querySelector(
    '.category-list > *.selected'
  );
  const selectedCategoryId = selectedCategory.getAttribute('data-id');
  let url = `http://localhost:3000/categories/${selectedCategoryId}/products`;
  const res = await fetch(url);
  let products = await res.json();
  if (brandName) {
    console.log('i am here');
    console.log(brandName);
    products = products.filter((product) => product.brandName === brandName);
    console.log(products);
  }
  products.forEach((product) => {
    const card = document.importNode(cardTemplate.content, true);
    const img = card.querySelector('img');
    const productName = card.querySelector('.product-name');
    const productPrice = card.querySelector('.product-price');
    const link = card.querySelector('.btn');
    img.src = `${product.imgSrc}.jpg`;
    img.alt = product.imgAlt;
    productName.appendChild(
      document.createTextNode(`Product Name: ${product.name}`)
    );
    productPrice.appendChild(
      document.createTextNode(`Price: ${product.price}`)
    );
    link.href = `./product.html?categoryId=${product.categoryId}&id=${product.id}`;
    productContainer.appendChild(card);
  });
};

// filter by brands
const brandFilter = document.getElementById('brands');
brandFilter.addEventListener('change', (e) => {
  const brandName = brandFilter.value;
  const oldSelectedOption = document.querySelector('#brands > *');
  oldSelectedOption.removeAttribute('selected');
  updateProducts(brandName);
  updateFilterBar(brandName);
});

const updateFilterBar = (brandName = null) => {
  const filterContainer = document.querySelector('.filters');
  removeElements(filterContainer);
  if (!brandName) return;
  const element = document.createElement('div');
  element.classList.add('clear-brand-filter');
  const clrBtn = document.createElement('span');
  clrBtn.classList.add('cross');
  const title = document.createElement('p');
  title.appendChild(document.createTextNode(`Brand: ${brandName}`));
  element.appendChild(clrBtn);
  element.appendChild(title);
  filterContainer.appendChild(element);
};

const removeFilter = document.querySelector('.filters');
removeFilter.addEventListener('click', (e) => {
  const target = e.target.closest('.clear-brand-filter');
  if (!target) return;
  updateProducts(null);
  updateFilterBar();
  // revert the selection
  const option = document.querySelector('#brands option');
  option.setAttribute('selected', '');
});

// empty container before injecting other things
const removeElements = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};
