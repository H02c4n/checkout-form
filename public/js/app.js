//Storage Controller
const StorageController = (function () {})();

// Product Controller
const ProductController = (function () {
  const Product = function (id, image, name, newPrice, oldPrice, quantity) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.newPrice = newPrice;
    this.oldPrice = oldPrice;
    this.quantity = quantity;
  };

  const data = {
    products: [
      {
        id: 0,
        image: "./img/photo1.png",
        name: "Vintage Backbag",
        newPrice: 54.99,
        oldPrice: 94.99,
        quantity: 1,
      },
      {
        id: 1,
        image: "./img/photo2.png",
        name: "Levi Shoes",
        newPrice: 74.99,
        oldPrice: 124.99,
        quantity: 1,
      },
      {
        id: 2,
        image: "./img/photo3.jpg",
        name: "Victoria Clock",
        newPrice: 114.99,
        oldPrice: 174.99,
        quantity: 1,
      },
    ],
    shipping: 19,
    totalPrice: 0,
    // totalProductQuantity: function () {
    //   this.products.reduce(acc, p.quantity, i, function () {
    //     acc + p.quantity, 0;
    //     return acc;
    //   });
    // },
  };

  return {
    getData: function () {
      return data;
    },
    getProducts: function () {
      return data.products;
    },
    getTotal: function () {
      let total = 0;
      data.products.forEach((product) => {
        total += product.newPrice * product.quantity;
      });
      data.totalPrice = total.toFixed(2);
      return data.totalPrice;
    },
    getShipping: function () {
      console.log(data.shipping);
      return data.shipping;
    },

    // getTotalProductQuantity: function () {
    //   return data.totalProductQuantity;
    // },

    updateShipping: function () {
      if (data.totalPrice >= 300) {
        data.shipping = 0;
      } else {
        data.shipping = 19;
      }
      //console.log(data.shipping);
      return data.shipping;
    },

    increase: function (key) {
      data.products.forEach((product) => {
        if (product.id == key && data.products[key].quantity >= 0) {
          data.products[key].quantity++;
          this.updateShipping();
          //console.log(data.products[key].quantity);
        }
      });
    },
    decrease: function (key) {
      data.products.forEach((product) => {
        if (product.id == key) {
          if (data.products[key].quantity > 0) {
            data.products[key].quantity--;
            this.updateShipping();
            //console.log(data.products[key].quantity);
          }
        }
      });
    },
  };
})();

//UI Controller
const UIController = (function () {
  const Selectors = {
    productsList: "#products-list",
    checkout: ".checkout",
    minusBtns: ".minus",
    plusBtns: ".plus",
    btnContainer: ".buttons-container",
    cart: ".cart",
  };

  return {
    getSelectors: function () {
      return Selectors;
    },
    createProductList: function (products) {
      products.forEach((p) => {
        let item = `
             <li>
                <div class="img-container">
                  <img class="image" src="${p.image}" alt="${p.name}" />
                </div>
                <div class="p-info">
                  <div>
                    <h3>${p.name}</h3>
                    <p>
                      <span class="currency">$</span
                      ><span class="new-price">${p.newPrice}</span
                      ><span class="old-price">$${p.oldPrice}</span>
                    </p>
                  </div>
                  <div class="buttons-container">
                    <button data-key="${p.id}" class="minus">-</button><span>${p.quantity}</span><button data-key="${p.id}" class="plus">+</button>
                  </div>
                </div>
              </li>
            `;
        document.querySelector(Selectors.productsList).innerHTML += item;
      });
    },

    showTotal: function (totalPrice) {
      let html = `
        <ul>
              <li><span>Shipping <span class="free">(free shipping on orders over $300)</span></span><span>$19</span></li>
              <li><span>Total</span><span>$${totalPrice}</span></li>
            </ul>
        `;
      document.querySelector(Selectors.checkout).innerHTML = html;
    },
    updateTotalPriceAndShipping: function (updateTotal, updateShipping) {
      if (updateTotal >= 300 || updateTotal == 0) {
        updateShipping = 0;
      } else {
        updateShipping = 19;
      }
      let html = `
        <ul>
              <li>
              <span>
                Shipping 
                <span class="free">(free shipping on orders over $300)</span>
              </span>
              <span>$${updateShipping}</span>
              </li>
              <li>
              <span>Total</span><span>$${updateTotal}</span>
              </li>
            </ul>
        `;
      document.querySelector(Selectors.checkout).innerHTML = html;
    },

    increaseQuantity: function (e) {
      e.target.previousElementSibling.textContent++;
    },
    decreaseQuantity: function (e, products) {
      let q = e.target.nextElementSibling.textContent - 1;
      //console.log(q);

      if (q == 0) {
        let confirmResult = confirm(
          `Are you sure to delete ${e.target.parentElement.previousElementSibling.firstElementChild.textContent} ?`
        );

        if (confirmResult == true) {
          e.target.nextElementSibling.textContent--;
          alert(
            `${e.target.parentElement.previousElementSibling.firstElementChild.textContent} is deleted.`
          );
          //Delete from UI
          e.target.parentElement.parentElement.parentElement.remove();

          if (
            document.querySelector(Selectors.productsList).childElementCount ==
            0
          ) {
            console.log(
              document.querySelector(Selectors.productsList).childElementCount
            );
            this.updateTotalPriceAndShipping(0, 0);
            // const span = document.querySelector(Selectors.checkout)
            //   .firstElementChild.firstElementChild.lastElementChild;
            // console.log(span);
            // span.classList.add("delete");
          }
        } else {
          const productId = e.target.getAttribute("data-key");
          //console.log(products[2].quantity, productId);
          products[productId].quantity++;
        }
      } else {
        e.target.nextElementSibling.textContent--;
      }
    },
    // updateCart: function (totalProductQuantity) {
    //   let item = `
    //       <i class="fa-solid fa-cart-shopping fa-2x">
    //       <span class="badge">${totalProductQuantity}</span>
    //       </i>`;
    //   document.querySelector(Selectors.cart).innerHTML = item;
    // },
  };
})();

//App Controller
const App = (function (ProductCtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors();
  const totalPrice = ProductCtrl.getTotal();
  const updateShipping = ProductCtrl.updateShipping();

  //All EventListener Loading....
  const LoadEventListeners = function () {
    //!Increase Quantity
    document.querySelectorAll(UISelectors.plusBtns).forEach((plus) => {
      plus.addEventListener("click", incQuantity);
    });
    //!Decrease Quantity
    document.querySelectorAll(UISelectors.minusBtns).forEach((minus) => {
      minus.addEventListener("click", decQuantity);
    });
  };

  const incQuantity = function (e) {
    const key = e.target.dataset.key;
    const products = ProductCtrl.getProducts();
    const totalProductQuantity = ProductCtrl.getTotalProductQuantity();
    ProductCtrl.increase(key);
    UICtrl.increaseQuantity(e);
    const updateTotal = ProductCtrl.getTotal();
    UICtrl.updateTotalPriceAndShipping(updateTotal, updateShipping);
    UICtrl.updateCart(totalProductQuantity);
  };

  const decQuantity = function (e) {
    const key = e.target.dataset.key;
    const products = ProductCtrl.getProducts();
    const totalProductQuantity = ProductCtrl.getTotalProductQuantity();
    ProductCtrl.decrease(key);
    UICtrl.decreaseQuantity(e, products);
    const updateTotal = ProductCtrl.getTotal();
    UICtrl.updateTotalPriceAndShipping(updateTotal, updateShipping);
    UICtrl.updateCart(totalProductQuantity);
  };

  //   console.log(totalPrice);
  UICtrl.showTotal(totalPrice);

  return {
    init: function () {
      console.log("app is starting..");

      const products = ProductCtrl.getProducts();

      UICtrl.createProductList(products);

      LoadEventListeners();
    },
  };
})(ProductController, UIController);

App.init();
