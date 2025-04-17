const $section = document.querySelector("section");
const $emptyBasket = document.querySelector(".empty-basket-aside");
const $basketAside = document.querySelector(".basket-aside");
const $basketNumber = document.querySelector(".basket-number");
const basketProducts = document.querySelector(".basket-products");
const $totalOrderPrice = document.querySelector(".total-order-price");
const $basketProducts = document.querySelector(".basket-products");

let currentBasketNumber = 0;
let orders = [];

async function getPizzaProduct() {
  const res = await fetch("https://prime-garfish-currently.ngrok-free.app/products", {
    headers: {
      "ngrok-skip-browser-warning": "1",
      "Content-Type": "application/json",
    }
  });
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
      quantityBtn.classList.add("quantity-btn", 'active');

      const uuid = event.currentTarget.getAttribute("data-uuid");
      console.log("UUID du produit cliqué :", uuid);


      document.querySelectorAll('.quantity-btn.active').forEach((btn) => {
        btn.classList.remove('active')
      });

      if (!pizzaCard.quantity) {
        pizzaCard.quantity = 1;
      }

      $addToCartBtn.classList.add("hidden");

      quantityBtn.style.backgroundColor = "#C73B0F";
      pizzaNumberQuantity.textContent = pizzaCard.quantity;
      pizzaNumberQuantity.classList.remove("hidden");
      pizzaNumberQuantity.style.color = "white";

      quantityBtn.appendChild(removeQuantityIcon);
      quantityBtn.appendChild(pizzaNumberQuantity);
      quantityBtn.appendChild(addQuantityIcon);

      pizzaCard.appendChild(quantityBtn);

      displayBasket();
      addProductToBasket(product.id, product.name, product.price, pizzaCard.quantity, pizzaCard);
    });

    // ++ la quantité
    addQuantityIcon.addEventListener("click", () => {
      pizzaCard.quantity++;

      // Màj la quantité et le prix dans le panier
      pizzaCard.basketProductDetailsQuantity.textContent = `${pizzaCard.quantity}x`;
      pizzaCard.basketProductDetailsTotalPrice.textContent = `$${(
        product.price * pizzaCard.quantity
      ).toFixed(2)}`;

      // Màj du prix total
      const currentTotal = parseFloat(
        $totalOrderPrice.textContent.replace("$", "")
      );
      const newTotal = currentTotal + parseFloat(product.price);
      $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

      currentBasketNumber++;
      $basketNumber.textContent = `(${currentBasketNumber})`;

      pizzaNumberQuantity.textContent = pizzaCard.quantity;

      orders.forEach(order => {
        if (order.uuid === product.id) {
          order.quantity = pizzaCard.quantity;
        }
      });
    });

    // Enlever de la quantité
    removeQuantityIcon.addEventListener("click", () => {
      if (pizzaCard.quantity > 0) {
        pizzaCard.quantity--;

        // Màj du prix et de la quantité dans le panier
        pizzaCard.basketProductDetailsQuantity.textContent = `${pizzaCard.quantity}x`;
        pizzaCard.basketProductDetailsTotalPrice.textContent = `$${(
          product.price * pizzaCard.quantity
        ).toFixed(2)}`;

        const currentTotal = parseFloat(
          $totalOrderPrice.textContent.replace("$", "")
        );
        const newTotal = currentTotal - parseFloat(product.price);
        $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

        currentBasketNumber--;
        $basketNumber.textContent = `(${currentBasketNumber})`;

        pizzaNumberQuantity.textContent = pizzaCard.quantity;

        orders.forEach(order => {
          if (order.uuid === product.id) {
            order.quantity = pizzaCard.quantity;
          }
        });
      }
    });
  });

  $section.appendChild(pizzasWrapper);
}

async function createPizzaOrder() {
  const res = await fetch('https://prime-garfish-currently.ngrok-free.app/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "products": orders
    })
  });

  const data = await res.json();
  console.log(data);

  displayOrder(data);
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
  pizzaCard.setAttribute("data-uuid", product.id);
  pizzaAddToCartBtn.setAttribute("data-uuid", product.id);

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

// Afficher le panier
function displayBasket() {
  $emptyBasket.classList.add("hidden");
  $basketAside.classList.remove("hidden");
}

// Fonction pour ajouter un produit au panier
function addProductToBasket(productId, productName, productPrice, quantity, pizzaCard) {
  const basketProductItem = document.createElement("li");
  basketProductItem.classList.add("basket-product-item");

  const basketProductItemName = document.createElement("span");
  basketProductItemName.classList.add("basket-product-item-name");
  basketProductItemName.textContent = productName;

  const basketProductDetails = document.createElement("span");
  basketProductDetails.classList.add("basket-product-details");

  const basketProductRemoveIcon = document.createElement('img');
  basketProductRemoveIcon.src = "../images/remove-icon.svg";
  basketProductRemoveIcon.classList.add('basket-product-remove-icon');

  basketProductRemoveIcon.addEventListener('click', () => {
    basketProductItem.remove();

    if (pizzaCard.quantity > 0) {
      pizzaCard.quantity--;
      pizzaNumberQuantity.textContent = pizzaCard.quantity;

      const currentTotal = parseFloat($totalOrderPrice.textContent.replace('$', ''));
      const newTotal = currentTotal - parseFloat(pizzaCard.price);
      $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

      currentBasketNumber--;
      $basketNumber.textContent = `(${currentBasketNumber})`;

      if (pizzaCard.quantity === 0) {
        const quantityBtn = pizzaCard.querySelector('.quantity-btn');
        if (quantityBtn) {
          quantityBtn.remove();
        }

        const addToCartBtn = pizzaCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
          addToCartBtn.classList.remove('hidden');
        }
      }
    }
  });

  const basketProductDetailsQuantity = document.createElement("span");
  basketProductDetailsQuantity.classList.add("basket-product-details-quantity");
  basketProductDetailsQuantity.textContent = `${pizzaCard.quantity}x`;

  const basketProductDetailsTotalPrice = document.createElement("span");
  basketProductDetailsTotalPrice.classList.add("basket-product-details-total-price");
  basketProductDetailsTotalPrice.textContent = `$${(productPrice * pizzaCard.quantity).toFixed(2)}`;

  basketProductDetails.appendChild(basketProductDetailsQuantity);
  basketProductDetails.appendChild(basketProductDetailsTotalPrice);

  basketProductItem.appendChild(basketProductItemName);
  basketProductItem.appendChild(basketProductDetails);
  basketProductItem.appendChild(basketProductRemoveIcon);

  basketProducts.appendChild(basketProductItem);

  pizzaCard.basketProductDetailsQuantity = basketProductDetailsQuantity;
  pizzaCard.basketProductDetailsTotalPrice = basketProductDetailsTotalPrice;

  const currentTotal = parseFloat($totalOrderPrice.textContent.replace("$", ""));
  const newTotal = currentTotal + productPrice * pizzaCard.quantity;
  $totalOrderPrice.textContent = `$${newTotal.toFixed(2)}`;

  currentBasketNumber++;
  $basketNumber.textContent = `(${currentBasketNumber})`;

  console.log("Product added:", { uuid: productId, quantity: quantity })
  orders.push({
    uuid: productId,
    quantity: pizzaCard.quantity
  });
}


function displayOrder(order) {
  const $orderModal = document.querySelector('.order-modal-wrapper');
  const $confirmOrder = document.querySelector('.confirm-order-btn');
  const $orderDetailList = document.querySelector('.order-detail');
  const $newOrderBtn = document.querySelector('.new-order-btn');

  let totalPrice = 0;

  // Ajoute chaque produit séparément
  order.products.forEach(item => {
    const product = item.product;
    const orderDetailsProductItem = document.createElement('li');
    orderDetailsProductItem.classList.add('order-detail-product-item');

    const orderDetailProductImage = document.createElement('img');
    orderDetailProductImage.classList.add('order-detail-product-image');
    orderDetailProductImage.src = product.image;

    const orderDetailProductName = document.createElement('span');
    orderDetailProductName.classList.add('order-detail-product-name');
    orderDetailProductName.textContent = product.name;

    const orderDetailProductQuantity = document.createElement('span');
    orderDetailProductQuantity.classList.add('order-detail-product-quantity');
    orderDetailProductQuantity.textContent = `Quantity: ${item.quantity}`;

    const orderDetailProductUnitPrice = document.createElement('span');
    orderDetailProductUnitPrice.classList.add('order-detail-product-unit-price');
    orderDetailProductUnitPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;

    const orderDetailProductTotalPrice = document.createElement('span');
    orderDetailProductTotalPrice.classList.add('order-detail-product-total-price');
    const productTotalPrice = item.quantity * product.price;
    orderDetailProductTotalPrice.textContent = `$${productTotalPrice.toFixed(2)}`;

    // Ajoute le prix total du produit au total
    totalPrice += productTotalPrice;

    orderDetailsProductItem.appendChild(orderDetailProductImage);
    orderDetailsProductItem.appendChild(orderDetailProductName);
    orderDetailsProductItem.appendChild(orderDetailProductQuantity);
    orderDetailsProductItem.appendChild(orderDetailProductUnitPrice);
    orderDetailsProductItem.appendChild(orderDetailProductTotalPrice);

    $orderDetailList.appendChild(orderDetailsProductItem);
  });

  // Affiche le prix total de la commande
  const orderDetailTotalPrice = document.createElement('li');
  orderDetailTotalPrice.classList.add('order-detail-total-price');

  const totalOrderTitle = document.createElement('span');
  totalOrderTitle.classList.add('total-order-title');
  totalOrderTitle.textContent = 'Total Order Price:';

  const totalOrderPrice = document.createElement('span');
  totalOrderPrice.classList.add('total-order-price');
  totalOrderPrice.textContent = `$${totalPrice.toFixed(2)}`;

  $confirmOrder.addEventListener('click', async () => {
    await createPizzaOrder()
    $orderModal.classList.remove('hidden');
  });

    $newOrderBtn.addEventListener('click', () => {
      $orderModal.classList.add('hidden');
      $emptyBasket.classList.remove("hidden");
      $basketAside.classList.add('hidden');
      resetSlicePizza();

      $orderDetailList.innerHTML = ""
    });

  orderDetailTotalPrice.appendChild(totalOrderTitle);
  orderDetailTotalPrice.appendChild(totalOrderPrice);

  $orderDetailList.appendChild(orderDetailTotalPrice);
}

function resetSlicePizza() {
  currentBasketNumber = 0;
  $basketProducts.textContent = "";
  $totalOrderPrice.textContent = "$0";
  $basketNumber.textContent = "(0)";
  orders = [];

  const allPizzaCards = document.querySelectorAll('.pizza-item');
  allPizzaCards.forEach((card) => {
    card.quantity = 0;

    const quantityBtn = card.querySelector('.quantity-btn');
    if (quantityBtn) {
      quantityBtn.remove();
    }

    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.classList.remove('hidden');
    }

    const quantitySpan = card.querySelector('.pizza-number-quantity');
    if (quantitySpan) {
      quantitySpan.textContent = "1";
      quantitySpan.classList.add("hidden");
    }
  })
}

getPizzaProduct();
createPizzaOrder();
