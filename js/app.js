const $section = document.querySelector("section");


async function getPizzaProduct() {
  const res = await fetch("http://10.59.122.41:3000/products");
  const data = await res.json();

    resetBasket()

    const pizzasWrapper = document.createElement("div");
    pizzasWrapper.classList.add("pizzas-wrapper");
    
    data.forEach(product => {
        const pizzaCard = createPizzaCard(product)
        pizzasWrapper.appendChild(pizzaCard);

        const $addToCardBtn = pizzaCard.querySelector(".add-to-cart-btn")
        $addToCardBtn.addEventListener("click", () => {
            displayBasket();
            addProductToBasket(product.name, product.price)
        });
    })

    $section.appendChild(pizzasWrapper);
}


// Affiche les pizzas
function createPizzaCard(product) {
    const pizzaCard = document.createElement("div");
    pizzaCard.classList.add("pizza-item");

    const pizzaImg = document.createElement("img");
    pizzaImg.src = product.image;
    pizzaImg.classList.add("pizza-picture");

    const pizzaInfos = document.createElement("ul");
    pizzaInfos.classList.add("pizza-infos");

    const pizzaName = document.createElement("li");
    pizzaName.textContent = product.name;
    pizzaName.classList.add("pizza-name");

    const pizzaPrice = document.createElement("li");
    pizzaPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;
    pizzaPrice.classList.add("pizza-price");

    const pizzaAddToCartBtn = document.createElement("span");
    pizzaAddToCartBtn.textContent = "Ajouter au panier";
    pizzaAddToCartBtn.classList.add("add-to-cart-btn");

    const pizzaBtnImg = document.createElement("img");
    pizzaBtnImg.src = "../images/carbon_shopping-cart-plus.svg";

    pizzaAddToCartBtn.appendChild(pizzaBtnImg);

    pizzaInfos.appendChild(pizzaName);
    pizzaInfos.appendChild(pizzaPrice);
    pizzaCard.appendChild(pizzaImg);
    pizzaCard.appendChild(pizzaAddToCartBtn);
    pizzaCard.appendChild(pizzaInfos);

    return pizzaCard
}

// Ajoute au panier
function displayBasket(product) {
  const $emptyBasket = document.querySelector(".empty-basket-aside");
  const $basketAside = document.querySelector(".basket-aside");

  $emptyBasket.classList.add("hidden");
  $basketAside.classList.remove("hidden");
}

// Affiche les éléments qu'on a appuyé dans le panier
function addProductToBasket(productName, productPrice) {
  const basketProducts = document.querySelector(".basket-products");

  const basketProductItem = document.createElement("li");
  basketProductItem.classList.add("basket-product-item");

  const basketProductItemName = document.createElement("span");
  basketProductItemName.classList.add("basket-product-item-name");
  basketProductItemName.textContent = productName;

  const basketProductDetails = document.createElement("span");
  basketProductDetails.classList.add("basket-product-details");

  const basketProductDetailsQuantity = document.createElement("span");
  basketProductDetailsQuantity.classList.add("basket-product-details-quantity");
  basketProductDetailsQuantity.textContent = "1x";

  const basketProductDetailsUnitPrice = document.createElement("span");
  basketProductDetailsUnitPrice.classList.add(
    "basket-product-details-unit-price"
  );
  basketProductDetailsUnitPrice.textContent = `$${parseFloat(
    productPrice
  ).toFixed(2)}`;

  const basketProductDetailsTotalPrice = document.createElement("span");
  basketProductDetailsTotalPrice.classList.add(
    "basket-product-details-total-price"
  );
  basketProductDetailsTotalPrice.textContent = `$${parseFloat(
    productPrice
  ).toFixed(2)}`;

  const basketProductRemoveIcon = document.createElement("img");
  basketProductRemoveIcon.src = "../images/remove-icon.svg";
  basketProductRemoveIcon.classList.add("basket-product-remove-icon");

  basketProductDetails.appendChild(basketProductDetailsQuantity);
  basketProductDetails.appendChild(basketProductDetailsUnitPrice);
  basketProductDetails.appendChild(basketProductDetailsTotalPrice);

  basketProductItem.appendChild(basketProductItemName);
  basketProductItem.appendChild(basketProductDetails);
  basketProductItem.appendChild(basketProductRemoveIcon);

  basketProducts.appendChild(basketProductItem);
}

// Clear le panier
function resetBasket() {
  const $basketProducts = document.querySelector(".basket-products");
  const $totalOrderPrice = document.querySelector(".total-order-price");

  $basketProducts.textContent = "";
  $totalOrderPrice.textContent = "0$";
}

getPizzaProduct();
