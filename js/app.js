const $section = document.querySelector("section");
const $emptyBasket = document.querySelector(".empty-basket-aside");
const $basketAside = document.querySelector(".basket-aside");
const $basketNumber = document.querySelector(".basket-number");
const basketProducts = document.querySelector(".basket-products");
const $totalOrderPrice = document.querySelector(".total-order-price");
const $basketProducts = document.querySelector(".basket-products");

let quantity = 0;
let currentBasketNumber = 0;

async function getPizzaProduct() {
  const res = await fetch("http://10.59.122.27:3000/products");
  const data = await res.json();

  console.log(data);

  resetSlicePizza();

  const pizzasWrapper = document.createElement("div");
  pizzasWrapper.classList.add("pizzas-wrapper");

  data.forEach((product) => {
    const pizzaCard = createPizzaCard(product);
    pizzasWrapper.appendChild(pizzaCard);

    const $addToCartBtn = pizzaCard.querySelector(".add-to-cart-btn");
    const pizzaNumberQuantity = $addToCartBtn.querySelector(
      ".pizza-number-quantity"
    );

    const addQuantityIcon = document.createElement("img");
    addQuantityIcon.src = "../images/add-icon.svg";
    addQuantityIcon.classList.add("add-quantity-icon");

    const removeQuantityIcon = document.createElement("img");
    removeQuantityIcon.src = "../images/remove-quantity.svg";
    removeQuantityIcon.classList.add("remove-quantity-icon");

    // Add to cart button
    $addToCartBtn.addEventListener("click", (event) => {
      const pizzaCard = event.target.closest(".pizza-item");
      const quantityBtn = document.createElement("span");

      quantityBtn.classList.add("quantity-btn");

      quantity = 1;

      // Masquer le bouton "Ajouter au panier"
      $addToCartBtn.classList.add("hidden");

      quantityBtn.style.backgroundColor = "#C73B0F";
      pizzaNumberQuantity.textContent = quantity;
      pizzaNumberQuantity.classList.remove("hidden");
      pizzaNumberQuantity.style.color = "white";

      quantityBtn.appendChild(removeQuantityIcon);
      quantityBtn.appendChild(pizzaNumberQuantity);
      quantityBtn.appendChild(addQuantityIcon);

      pizzaCard.appendChild(quantityBtn);

      displayBasket();
      addProductToBasket(product.name, product.price, quantity);
    });

    // Ajoute de la quantité
    addQuantityIcon.addEventListener("click", () => {
      console.log("Ma quantité: ", quantity);
      console.log("J'ai:", currentBasketNumber, " produits dans mon panier");

      const basketProductDetailsQuantity = document.querySelector(
        ".basket-product-details-quantity"
      );
      console.log(basketProductDetailsQuantity);

      const basketProductDetailsTotalPrice = document.querySelector(
        ".basket-product-details-total-price"
      );

      basketProductDetailsQuantity.textContent = `${quantity}x`;

      basketProductDetailsTotalPrice.textContent = `$${(
        product.price * quantity
      ).toFixed(2)}`;

      quantity++;

      const currentTotal = parseFloat(
        $totalOrderPrice.textContent.replace("$", "")
      );
      const newTotal = currentTotal + parseFloat(product.price);
      $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

      currentBasketNumber++;
      $basketNumber.textContent = `(${currentBasketNumber})`;

      pizzaNumberQuantity.textContent = quantity;

      // addProductToBasket(product.name, product.price, quantity);
    });

    // Enlève de la quantité
    removeQuantityIcon.addEventListener("click", () => {
      if (quantity > 0) {
        const basketProductDetailsQuantity = document.querySelector(
          ".basket-product-details-quantity"
        );
        console.log(basketProductDetailsQuantity);

        const basketProductDetailsTotalPrice = document.querySelector(
          ".basket-product-details-total-price"
        );
        quantity--;
        currentBasketNumber--;

        pizzaNumberQuantity.textContent = quantity;
        const currentTotal = parseFloat(
          $totalOrderPrice.textContent.replace("$", "")
        );
        const newTotal = currentTotal - parseFloat(product.price);
        $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

        $basketNumber.textContent = `(${currentBasketNumber})`;

        basketProductDetailsQuantity.textContent = `${quantity}x`;

        basketProductDetailsTotalPrice.textContent = `$${(
          product.price * quantity
        ).toFixed(2)}`;
        // addProductToBasket(product.name, product.price, quantity);
      }

      // if (quantity === 0) {
      //   const quantityBtn = pizzaCard.querySelector(".quantity-btn");
      //   const basketProductItem = document.querySelector('.basket-product-item')

      //   $addToCartBtn.classList.remove("hidden");
      //   quantityBtn.classList.add("hidden");
      //   basketProductItem.remove()
      // }
    });
  });

  $section.appendChild(pizzasWrapper);
}

async function createPizzaOrder() {
  const res = await fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()
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

  const basketProductDetailsTotalPrice = document.createElement("span");
  basketProductDetailsTotalPrice.classList.add(
    "basket-product-details-total-price"
  );
  basketProductDetailsTotalPrice.textContent = `$${(
    productPrice * quantity
  ).toFixed(2)}`;

  basketProductDetails.appendChild(basketProductDetailsQuantity);
  basketProductDetails.appendChild(basketProductDetailsTotalPrice);

  basketProductItem.appendChild(basketProductItemName);
  basketProductItem.appendChild(basketProductDetails);

  basketProducts.appendChild(basketProductItem);

  // Mettre à jour le prix total
  const currentTotal = parseFloat(
    $totalOrderPrice.textContent.replace("$", "")
  );
  const newTotal = currentTotal + productPrice * quantity;
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
