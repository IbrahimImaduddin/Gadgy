const productId = new URLSearchParams(window.location.search).get('id');
const categoryId = new URLSearchParams(window.location.search).get(
  'categoryId'
);

document.addEventListener('DOMContentLoaded', () => {
  injectProductDetails();
  injectRelatedProducts();
  updateSeeMore();
});

// getting prod object
const getProductDetails = async () => {
  let url = `http://localhost:3000/products/${productId}`;
  const res = await fetch(url);
  const productDetails = await res.json();
  console.log(productDetails);
  return productDetails;
};

// injecting details into DOM
const injectProductDetails = async () => {
  const product = await getProductDetails();
  const productContainer = document.querySelector('.product > .container');
  removeElement(productContainer);
  let detailTemplate = document.getElementById('productDetail');
  detailTemplate = document.importNode(detailTemplate.content, true);
  const prodImage = detailTemplate.querySelector('.product__image img');
  const prodName = detailTemplate.querySelector('.product__name');
  const prodPrice = detailTemplate.querySelector('.product__price');
  prodImage.src = `${product.imgSrc}.jpg`;
  prodImage.alt = product.imgAlt;
  prodName.appendChild(document.createTextNode(product.name));
  prodPrice.appendChild(
    document.createTextNode(`Rs. ${product.price} / piece`)
  );
  productContainer.appendChild(detailTemplate);
};

// getting all prod of the selected category
const getRelatedProducts = async () => {
  let url = `http://localhost:3000/categories/${categoryId}/products`;
  const res = await fetch(url);
  const products = res.json();
  return products;
};

// injecting similar products into DOM
const injectRelatedProducts = async () => {
  const products = await getRelatedProducts();
  const upperbound = products.length;
  const relatedProductsContainer = document.querySelector(
    '.similar-products .grid'
  );
  removeElement(relatedProductsContainer);
  const cardTemplate = document.getElementById('cardTemplate');

  let tempArr = [];
  for (let i = 0; i < 8; i++) {
    while (true) {
      let j = Math.floor(Math.random() * upperbound);
      if (tempArr.includes(j)) continue;
      tempArr.push(j);
      const card = document.importNode(cardTemplate.content, true);
      const img = card.querySelector('img');
      const productName = card.querySelector('.product-name');
      const productPrice = card.querySelector('.product-price');
      const link = card.querySelector('.btn');
      img.src = `${products[j].imgSrc}.jpg`;
      img.alt = products[j].imgAlt;
      productName.appendChild(
        document.createTextNode(`Product Name: ${products[j].name}`)
      );
      productPrice.appendChild(
        document.createTextNode(`Price: ${products[j].price}`)
      );
      link.href = `./product.html?categoryId=${products[j].categoryId}&id=${products[j].id}`;
      relatedProductsContainer.appendChild(card);
      break;
    }
  }
};

// updating the link of see more button

const updateSeeMore = () => {
  const seeMoreBtn = document.querySelector('.see-more');
  seeMoreBtn.href = `./categories.html?categoryId=${categoryId}`;
};

// empty the container before injecting new elements
removeElement = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};
