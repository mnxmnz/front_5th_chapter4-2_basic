let cachedProducts = null;

async function loadProducts() {
  try {
    if (cachedProducts) {
      displayProducts(cachedProducts);
      return;
    }

    const response = await fetch('https://fakestoreapi.com/products', {
      cache: 'force-cache',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const products = await response.json();

    cachedProducts = products;
    displayProducts(products);
  } catch (error) {
    console.error(error);

    const container = document.querySelector('#all-products .container');

    if (container) {
      container.innerHTML =
        '<p class="error" role="alert">상품을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</p>';
    }
  }
}

function displayProducts(products) {
  const container = document.querySelector('#all-products .container');
  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const productElement = document.createElement('div');

    productElement.classList.add('product');
    productElement.setAttribute('role', 'article');

    const pictureDiv = document.createElement('div');

    pictureDiv.classList.add('product-picture');

    const img = document.createElement('img');

    img.src = product.image;
    img.alt = `${product.title} - ${product.description.substring(0, 100)}...`;
    img.width = 250;
    img.height = 250;
    img.loading = 'lazy';
    img.decoding = 'async';
    pictureDiv.appendChild(img);

    const infoDiv = document.createElement('div');

    infoDiv.classList.add('product-info');

    const category = document.createElement('h5');

    category.classList.add('categories');
    category.textContent = product.category;

    const title = document.createElement('h4');

    title.classList.add('title');
    title.textContent = product.title;

    const price = document.createElement('h3');

    price.classList.add('price');

    const priceSpan = document.createElement('span');

    priceSpan.textContent = `US$ ${product.price}`;
    price.appendChild(priceSpan);

    const button = document.createElement('button');

    button.textContent = 'Add to bag';
    button.setAttribute('aria-label', `Add ${product.title} to shopping bag`);

    infoDiv.appendChild(category);
    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(button);

    productElement.appendChild(pictureDiv);
    productElement.appendChild(infoDiv);

    fragment.appendChild(productElement);
  });

  container.appendChild(fragment);
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadProducts();
        observer.disconnect();
      }
    });
  },
  {
    rootMargin: '100px',
  },
);

const productsSection = document.querySelector('#all-products');

if (productsSection) {
  observer.observe(productsSection);
}
