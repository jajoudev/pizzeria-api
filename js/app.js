const $section = document.querySelector("section");
const $emptyBasket = document.querySelector(".empty-basket-aside");
const $basketAside = document.querySelector(".basket-aside");
const $basketNumber = document.querySelector(".basket-number");
const basketProducts = document.querySelector(".basket-products");
const $totalOrderPrice = document.querySelector(".total-order-price");
const $basketProducts = document.querySelector(".basket-products");

let quantity = 1;
let currentBasketNumber = 0;

async function getPizzaProduct() {
  const res = await fetch("http://10.59.122.150:3000/products");
  const data = await res.json();

  console.log(data);

  resetSlicePizza();

  const pizzasWrapper = document.createElement("div");
  pizzasWrapper.classList.add("pizzas-wrapper");

  data.forEach((product) => {
    const pizzaCard = createPizzaCard(product);
    pizzasWrapper.appendChild(pizzaCard);

    const $addToCartBtn = pizzaCard.querySelector(".add-to-cart-btn");
    const pizzaBtnImg = $addToCartBtn.querySelector(".pizza-btn-img");
    const pizzaNumberQuantity = $addToCartBtn.querySelector(
      ".pizza-number-quantity"
    );
    const $basketProductRemoveIcon = $addToCartBtn.querySelector(
      ".basket-product-remove-icon"
    );
    console.log($basketProductRemoveIcon);

    const addQuantityIcon = document.createElement("img");
    addQuantityIcon.src = "../images/add-icon.svg";
    addQuantityIcon.classList.add("add-quantity-icon");

    const removeQuantityIcon = document.createElement("img");
    removeQuantityIcon.src = "../images/remove-quantity.svg";
    removeQuantityIcon.classList.add("remove-quantity-icon");

    // Ajouter de la quantité
    addQuantityIcon.addEventListener("click", () => {
      quantity++;
      pizzaNumberQuantity.textContent = quantity;
      const currentTotal = parseFloat(
        $totalOrderPrice.textContent.replace("$", "")
      );
      const newTotal = currentTotal + parseFloat(product.price);
      $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

      currentBasketNumber++;
      $basketNumber.textContent = `(${currentBasketNumber})`;
    });

    // Enlever de la quantité
    removeQuantityIcon.addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;
        currentBasketNumber--;
        pizzaNumberQuantity.textContent = quantity;
        const currentTotal = parseFloat(
          $totalOrderPrice.textContent.replace("$", "")
        );
        const newTotal = currentTotal - parseFloat(product.price);
        $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

        currentBasketNumber--;
        $basketNumber.textContent = `(${currentBasketNumber})`;
      }
    });

    $addToCartBtn.addEventListener("click", () => {
      $addToCartBtn.style.backgroundColor = "#C73B0F";

      pizzaNumberQuantity.textContent = quantity;
      pizzaNumberQuantity.classList.remove("hidden");
      pizzaNumberQuantity.style.color = "white";
      pizzaBtnImg.src = "";

      $addToCartBtn.innerHTML = "";

      $addToCartBtn.appendChild(removeQuantityIcon);
      $addToCartBtn.appendChild(pizzaNumberQuantity);
      $addToCartBtn.appendChild(addQuantityIcon);

      displayBasket();
      addProductToBasket(product.name, product.price, quantity);
    });
  });

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
  pizzaBtnImg.classList.add("pizza-btn-img");

  // Faire le bouton de la quantité
  const pizzaNumberQuantity = document.createElement("span");
  pizzaNumberQuantity.textContent = "1";
  pizzaNumberQuantity.classList.add("pizza-number-quantity", "hidden");

  // Ajouter au HTML
  pizzaAddToCartBtn.appendChild(pizzaBtnImg);
  pizzaAddToCartBtn.appendChild(pizzaNumberQuantity);

  pizzaInfos.appendChild(pizzaName);
  pizzaInfos.appendChild(pizzaPrice);
  pizzaCard.appendChild(pizzaImg);
  pizzaCard.appendChild(pizzaAddToCartBtn);
  pizzaCard.appendChild(pizzaInfos);

  return pizzaCard;
}

// Ajoute au panier
function displayBasket() {
  $emptyBasket.classList.add("hidden");
  $basketAside.classList.remove("hidden");
}

// Affiche les produits qu'on a appuyé dans le panier
function addProductToBasket(productName, productPrice, quantity) {
  const basketProductItem = document.createElement("li");
  basketProductItem.classList.add("basket-product-item");

  const basketProductItemName = document.createElement("span");
  basketProductItemName.classList.add("basket-product-item-name");
  basketProductItemName.textContent = productName;

  const basketProductDetails = document.createElement("span");
  basketProductDetails.classList.add("basket-product-details");

  const basketProductDetailsQuantity = document.createElement("span");
  basketProductDetailsQuantity.classList.add("basket-product-details-quantity");
  basketProductDetailsQuantity.textContent = `${quantity}x`;

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

  // Multiplie mon produit avec ma quantité
  const totalProductPrice = parseFloat(productPrice) * quantity;
  basketProductDetailsTotalPrice.textContent = `$${totalProductPrice.toFixed(
    2
  )}`;

  // Le bouton pour enlever un produit
  const basketProductRemoveIcon = document.createElement("img");
  basketProductRemoveIcon.src = "../images/remove-icon.svg";
  basketProductRemoveIcon.classList.add("basket-product-remove-icon");

  // Quand je clique sur le bouton ça m'enlève un produit et ça réduit mon prix
  basketProductRemoveIcon.addEventListener("click", () => {
    console.log("C'est bien cliqué");
    basketProductItem.remove();
    currentBasketNumber--;
    $basketNumber.textContent = `(${currentBasketNumber})`;

    const currentTotal = parseFloat(
      $totalOrderPrice.textContent.replace("$", "")
    );
    const newTotal = currentTotal - totalProductPrice;
    $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;
  });

  basketProductDetails.appendChild(basketProductDetailsQuantity);
  basketProductDetails.appendChild(basketProductDetailsUnitPrice);
  basketProductDetails.appendChild(basketProductDetailsTotalPrice);

  basketProductItem.appendChild(basketProductItemName);
  basketProductItem.appendChild(basketProductDetails);
  basketProductItem.appendChild(basketProductRemoveIcon);

  basketProducts.appendChild(basketProductItem);

  // Le prix total
  const currentTotal = parseFloat(
    $totalOrderPrice.textContent.replace("$", "")
  );
  const newTotal = currentTotal + totalProductPrice;
  $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

  currentBasketNumber++;
  $basketNumber.textContent = `(${currentBasketNumber})`;
}

// Clear le panier
function resetSlicePizza() {
  $basketProducts.textContent = "";
  $totalOrderPrice.textContent = "0$";
}

getPizzaProduct();
