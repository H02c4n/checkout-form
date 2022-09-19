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
    increase: function (key) {
      data.products.forEach((product) => {
        if (product.id == key && data.products[key].quantity >= 0) {
          data.products[key].quantity++;
          //console.log(data.products[key].quantity);
        }
      });
    },
    decrease: function (key) {
      data.products.forEach((product) => {
        if (product.id == key) {
          if (data.products[key].quantity > 0) {
            data.products[key].quantity--;
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
  };

  return {
    getSelectors: function () {
      return Selectors;
    },
    CreateProductList: function (product) {
      product.forEach((p) => {
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
    // inc: function () {
    //   console.log("here");
    // },
    showTotal: function (totalPrice) {
      let html = `
        <ul>
              <li><span>Shipping <span class="free">(free shipping on orders over $300)</span></span><span>$19</span></li>
              <li><span>Total</span><span>$${totalPrice}</span></li>
            </ul>
        `;
      document.querySelector(Selectors.checkout).innerHTML = html;
    },
    updateTotalPrice: function (updateTotal) {
      let html = `
        <ul>
              <li><span>Shipping <span class="free">(free shipping on orders over $300)</span></span><span>$19</span></li>
              <li><span>Total</span><span>$${updateTotal}</span></li>
            </ul>
        `;
      document.querySelector(Selectors.checkout).innerHTML = html;
    },

    updateQuantity: function (key) {
      const products = ProductController.getProducts();
      products.forEach((p) => {
        if (key == p.id) {
          console.log(`key: ${key}, id: ${p.id},Qnty: ${p.quantity},`);
          let item = `

                    <button data-key="${p.id}" class="minus">-</button><span>${p.quantity}</span><button data-key="${p.id}" class="plus">+</button>

              `;
          document.querySelector(Selectors.btnContainer).innerHTML = item;
        }
      });
    },
  };
})();

//App Controller
const App = (function (ProductCtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors();
  const totalPrice = ProductCtrl.getTotal();

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
    ProductCtrl.increase(key);
    UICtrl.updateQuantity(key);
    const updateTotal = ProductCtrl.getTotal();
    UICtrl.updateTotalPrice(updateTotal);

    //console.log(e.target.dataset.key);
  };

  const decQuantity = function (e) {
    const key = e.target.dataset.key;
    ProductCtrl.decrease(key);
    UICtrl.updateQuantity(key);
    const updateTotal = ProductCtrl.getTotal();
    UICtrl.updateTotalPrice(updateTotal);
    //console.log(e.target.dataset.key);
  };

  //   console.log(totalPrice);
  UICtrl.showTotal(totalPrice);

  return {
    init: function () {
      console.log("app is starting..");

      const product = ProductCtrl.getProducts();

      UICtrl.CreateProductList(product);

      LoadEventListeners();
    },
  };
})(ProductController, UIController);

App.init();
