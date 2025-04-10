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

      quantity += 1;

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
      addProductToBasket(product.name, product.price, quantity, pizzaCard);
    });

    // Ajoute de la quantité
    addQuantityIcon.addEventListener("click", () => {
      quantity++; // Incrémente la quantité pour ce produit

      // Mettre à jour la quantité et le prix dans le panier
      pizzaCard.basketProductDetailsQuantity.textContent = `${quantity}x`;
      pizzaCard.basketProductDetailsTotalPrice.textContent = `$${(
        product.price * quantity
      ).toFixed(2)}`;

      // Mettre à jour le prix total global
      const currentTotal = parseFloat(
        $totalOrderPrice.textContent.replace("$", "")
      );
      const newTotal = currentTotal + parseFloat(product.price);
      $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

      currentBasketNumber++;
      $basketNumber.textContent = `(${currentBasketNumber})`;

      pizzaNumberQuantity.textContent = quantity;
    });

    // Enlève de la quantité
    removeQuantityIcon.addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;

        // Mettre à jour la quantité et le prix dans le panier
        pizzaCard.basketProductDetailsQuantity.textContent = `${quantity}x`;
        pizzaCard.basketProductDetailsTotalPrice.textContent = `$${(
          product.price * quantity
        ).toFixed(2)}`;

        const currentTotal = parseFloat(
          $totalOrderPrice.textContent.replace("$", "")
        );
        const newTotal = currentTotal - parseFloat(product.price);
        $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

        currentBasketNumber--;
        $basketNumber.textContent = `(${currentBasketNumber})`;

        pizzaNumberQuantity.textContent = quantity;
      }
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

  console.log(data)
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
function addProductToBasket(productName, productPrice, quantity, pizzaCard) {
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

  // Ajouter une référence pour chaque produit
  pizzaCard.basketProductDetailsQuantity = basketProductDetailsQuantity;
  pizzaCard.basketProductDetailsTotalPrice = basketProductDetailsTotalPrice;

  // Mettre à jour le prix total
  const currentTotal = parseFloat(
    $totalOrderPrice.textContent.replace("$", "")
  );
  const newTotal = currentTotal + productPrice * quantity;
  $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

  currentBasketNumber++;
  $basketNumber.textContent = `(${currentBasketNumber})`;
}

function confirmOrder() {
  const orderDetail = document.querySelector('ul')

  const orderDetailsProductItem = document.createElement('li')
  orderDetailsProductItem.classList.add('order-detail-product-item')

  const orderDetailProductImage = document.createElement('img')
  orderDetailProductImage.classList.add('order-detail-product-image')

  const orderDetailProductName = document.createElement('span')
  orderDetailProductName.classList.add('order-detail-product-name')

  const orderDetailProductQuantity = document.createElement('span')
  orderDetailProductQuantity.classList.add('order-detail-product-quantity')

  const orderDetailProductUnitPrice = document.createElement('span')
  orderDetailProductUnitPrice.classList.add('order-detail-product-unit-price')

  const orderDetailProductTotalPrice = document.createElement('span')
  orderDetailProductTotalPrice.classList.add('order-detail-product-total-price')

  const orderDetailTotalPrice = document.createElement('li')
  orderDetailTotalPrice.classList.add('order-detail-total-price')

  const totalOrderTitle = document.createElement('span')
  totalOrderTitle.classList.add('total-order-title')

  const totalOrderPrice = document.createElement('span')
  totalOrderPrice.classList.add('total-order-price')

  orderDetailsProductItem.appendChild(orderDetailProductImage)
  orderDetailsProductItem.appendChild(orderDetailProductName)
  orderDetailsProductItem.appendChild(orderDetailProductQuantity)
  orderDetailsProductItem.appendChild(orderDetailProductUnitPrice)
  orderDetailsProductItem.appendChild(orderDetailProductTotalPrice)

  orderDetailTotalPrice.appendChild(totalOrderTitle)
  orderDetailTotalPrice.appendChild(totalOrderPrice)

  orderDetail.appendChild(orderDetailTotalPrice)
  orderDetail.appendChild(orderDetailsProductItem)
}

confirmOrder()

// Clear le panier
function resetSlicePizza() {
  $basketProducts.textContent = "";
  $totalOrderPrice.textContent = "0$";
}

getPizzaProduct();

createPizzaOrder()
