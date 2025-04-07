const $section = document.querySelector("section");

async function getPizzaProduct() {
  const res = await fetch("http://10.59.122.41:3000/products");
  const data = await res.json();

  resetSlicePizza();

  const pizzasWrapper = document.createElement("div");
  pizzasWrapper.classList.add("pizzas-wrapper");

  data.forEach((product) => {
    const pizzaCard = createPizzaCard(product);
    pizzasWrapper.appendChild(pizzaCard);

    const $addToCardBtn = pizzaCard.querySelector(".add-to-cart-btn");
    $addToCardBtn.addEventListener("click", () => {
      displayBasket();
      addProductToBasket(product.name, product.price);
    });
  });

  validatedOrder();

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

  pizzaAddToCartBtn.addEventListener("mouseover", (event) => {
    const img = event.target.querySelector("img");
    if (img) {
      img.src = "./images/moins-icon.svg";
      console.log("Il y a une image");
    }

    event.target.textContent = "1";
  });

  pizzaAddToCartBtn.addEventListener("mouseout", (event) => {
    event.target.textContent = "Ajouter au panier";
    event.target.src = "../images/carbon_shopping-cart-plus.svg";
  });

  const pizzaBtnImg = document.createElement("img");
  pizzaBtnImg.src = "../images/carbon_shopping-cart-plus.svg";

  pizzaAddToCartBtn.appendChild(pizzaBtnImg);

  pizzaInfos.appendChild(pizzaName);
  pizzaInfos.appendChild(pizzaPrice);
  pizzaCard.appendChild(pizzaImg);
  pizzaCard.appendChild(pizzaAddToCartBtn);
  pizzaCard.appendChild(pizzaInfos);

  return pizzaCard;
}

// Ajoute au panier
function displayBasket(product) {
  const $emptyBasket = document.querySelector(".empty-basket-aside");
  const $basketAside = document.querySelector(".basket-aside");

  $emptyBasket.classList.add("hidden");
  $basketAside.classList.remove("hidden");
}

let currentBasketNumber = 0;
const $basketNumber = document.querySelector(".basket-number");

// Affiche les éléments qu'on a appuyé dans le panier
function addProductToBasket(productName, productPrice) {
  const basketProducts = document.querySelector(".basket-products");
  const $totalOrderPrice = document.querySelector(".total-order-price");
  const $basketProductRemoveIcon = document.querySelector(
    ".basket-product-remove-icon"
  );

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

  const currentTotal = parseFloat(
    $totalOrderPrice.textContent.replace("$", "")
  );
  const newTotal = currentTotal + parseFloat(productPrice);
  $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

  currentBasketNumber++;
  $basketNumber.textContent = `(${currentBasketNumber})`;

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

// function removeProductToBasket() {
//   const basketProductRemoveIcon = document.querySelector(
//     ".basket-product-remove-icon"
//   );

//   basketProductRemoveIcon.addEventListener("click", (event) => {
//     event.target = "";
//     basketProductItem.remove();
//   });
// }

function validatedOrder() {
  const orderDetail = document.querySelector(".order-detail");

  const orderDetailProductItem = document.createElement("li");
  orderDetailProductItem.classList.add("order-detail-product-item");

  const orderDetailProductImage = document.createElement("img");
  orderDetailProductImage.classList.add("order-detail-product-image");

  const orderDetailProductName = document.createElement("span");
  orderDetailProductName.classList.add("order-detail-product-name");

  const orderDetailProductQuantity = document.createElement("span");
  orderDetailProductQuantity.classList.add("order-detail-product-quantity");

  const orderDetailProductUnitPrice = document.createElement("span");
  orderDetailProductUnitPrice.classList.add("order-detail-product-unit-price");

  const orderDetailProductTotalPrice = document.createElement("span");
  orderDetailProductTotalPrice.classList.add(
    "order-detail-product-total-price"
  );

  const orderDetailTotalPrice = document.createElement("li");
  orderDetailTotalPrice.classList.add("order-detail-total-price");

  const totalOrderTitle = document.createElement("span");
  totalOrderTitle.classList.add("total-order-title");

  const totalOrderPrice = document.createElement("span");
  totalOrderPrice.classList.add("total-order-price");

  orderDetailProductItem.appendChild(orderDetailProductImage);
  orderDetailProductItem.appendChild(orderDetailProductName);
  orderDetailProductItem.appendChild(orderDetailProductQuantity);
  orderDetailProductItem.appendChild(orderDetailProductUnitPrice);
  orderDetailProductItem.appendChild(orderDetailProductTotalPrice);

  orderDetail.appendChild(totalOrderTitle);
  orderDetail.appendChild(totalOrderPrice);
  orderDetail.appendChild(orderDetailProductItem);
}

// Clear le panier
function resetSlicePizza() {
  const $basketProducts = document.querySelector(".basket-products");
  const $totalOrderPrice = document.querySelector(".total-order-price");

  $basketProducts.textContent = "";
  $totalOrderPrice.textContent = "0$";
}

getPizzaProduct();
