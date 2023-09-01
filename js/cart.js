class Cart {
    constructor() {
        if (Cart._instance) return Cart._instance;
        Cart._instance = this;
        this.cart = JSON.parse(localStorage.getItem("cart") || "{}");
        this.totalPrice = 0;
        this.cartContainer = document.querySelector(".cart-modal__container");
        this.orderModalContainer = document.querySelector(".order-modal__container");
        this.productsService = new ProductsService();
        this.addEventListeners();
        this.renderCart();
        this.saveCart();
    }

    addEventListeners() {
        document.querySelector(".cart-btn").addEventListener('click', this.showCart.bind(this));
        // document.querySelector(".order-btn").addEventListener('click', this.order.bind(this));
        // document.querySelector(".clear-cart-btn").addEventListener('click', this.clearCart.bind(this));
        document.querySelector(".clear-cart-btn").addEventListener('click', this.clearCartAlert.bind(this));
        this.cartContainer.querySelector(".proceed-to-checkout-btn").addEventListener("click", this.toggleCartAndOrderModals.bind(this));
        this.orderModalContainer.querySelector(".back-btn").addEventListener("click", this.toggleCartAndOrderModals.bind(this));

        this.orderModalContainer.querySelector(".order-btn").addEventListener("click", this.order.bind(this));
    }

    showCart() {
        this.cartContainer.classList.add("active");
        document.body.classList.add("lock");
    }

    hideModal(modal) {
        modal.classList.remove("active");
        document.body.classList.remove("lock");
    }

    async renderCart() {
        let cartDomString = ``;
        // let total = 0;
        this.totalPrice = 0

        let totalProductsAmount = 0;

        const cartModal = this.cartContainer.querySelector(".cart-modal");

        if (Object.keys(this.cart).length === 0) {
            cartDomString = `The cart is empty`;
            this.hideModal(this.cartContainer);
            document.querySelector(".cart-btn__container").classList.remove("active");
        } else {
            for (let productId in this.cart) {
                const product = await this.productsService.getProductById(productId);
                cartDomString += this.createCartProductDomString(product);
                this.totalPrice += this.cart[product.id] * product.price;
                totalProductsAmount = Object.keys(this.cart).length;
            }
            document.querySelector(".cart-btn__container").classList.add("active");
            // document.querySelector(".cart-btn__badge").innerHTML = Object.keys(this.cart).length;
            if (totalProductsAmount <= 9) {
                document.querySelector(".cart-btn__badge").innerHTML = totalProductsAmount;
            } else {
                document.querySelector(".cart-btn__badge").innerHTML = '9+';
            }
        };

        const formatter = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',          
          });

        this.totalPrice = formatter.format(this.totalPrice);

        cartModal.querySelector(".cart-modal__products-container").innerHTML = cartDomString;
        // this.cartContainer.querySelector(".cart-modal__products__bottom__price").innerHTML = `£${total.toFixed(2)}`;
        this.cartContainer.querySelector(".cart-modal__products__bottom__price").innerHTML = `${this.totalPrice}`;

        document.querySelectorAll(".plus-btn").forEach(btn => btn.addEventListener("click", (ev) => this.changeQuantity(ev, this.addProductOperation)));
        document.querySelectorAll(".minus-btn").forEach(btn => btn.addEventListener("click", (ev) => this.changeQuantity(ev, this.deleteProductOperation)));
    }


    createCartProductDomString(product) {
        return `<div class="cart-modal__product cart-row">
                    <div class="cart-modal__product__title cart__title-column">
                        ${product.name}
                    </div>

                    <div class="cart-modal__product__quantity cart__quantity-column">
                        <div class="cart-modal__product__quantity__buttons-container">
                            <button class="plus-btn cart-modal__product__quantity__btn" data-id="${product.id}">+</button>
                            <div>${this.cart[product.id]}</div>
                            <button class="minus-btn cart-modal__product__quantity__btn" data-id="${product.id}">-</button>
                        </div>
                    </div>

                    <div class="cart-modal__product__price cart__price-column">
                        £${(this.cart[product.id] * product.price).toFixed(2)}
                    </div>
                </div>`;
    }

    changeQuantity(ev, operation) {
        ev.preventDeafult;
        operation.call(this, ev.target.dataset.id);
        this.saveCart();
        this.renderCart();
    }

    addProductOperation(id) {
        if (!this.cart[id]) {
            showAlert("success", "Product added to cart");
            this.cart[id] = 1;
        } else {
            ++this.cart[id];
        }

        document.querySelector(".cart-btn__container").classList.add("animate");
        setTimeout(() => document.querySelector(".cart-btn__container").classList.remove("animate"), 300);

    }

    deleteProductOperation(id) {
        if (this.cart[id] > 1) {
            --this.cart[id];
        } else {
            delete this.cart[id];
        }
    }

    addProduct(id) {
        this.addProductOperation(id);
        this.saveCart();
        this.renderCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart))
    }

    clearCart() {
        this.cart = {};
        this.saveCart();
        this.renderCart();
        showAlert("success", "The cart has been cleared");
    }

    clearCartAlert() {
        const alertContainer = document.querySelector(".clear-cart-alert__container");

        alertContainer.querySelectorAll(".btn").forEach(button => button.addEventListener("click", () => {
            alertContainer.classList.remove("active");
            document.body.classList.remove("lock");
        })
        );
        alertContainer.querySelector('.confirm-btn').addEventListener('click', this.clearCart.bind(this));
        alertContainer.classList.add("active");
        document.body.classList.add("lock");
    }

    toggleCartAndOrderModals() {
        this.cartContainer.classList.toggle("active");
        this.orderModalContainer.classList.toggle("active");
    }

    async formatCart() {
        let newCart = {};
        
        for (let key in this.cart) {
            let product = await this.productsService.getProductById(key);
            newCart[product.name] = this.cart[key];
        }

        return newCart;
    }

    async order(event) {
        event.stopPropagation();
        event.preventDefault();

        const form = this.orderModalContainer.querySelector(".order__form");

        if (!form.checkValidity()) {
            return showAlert("error", "Fill form correctly");
        }

        let data = new FormData();

        data.append('Cart', JSON.stringify(await this.formatCart()));
        data.append('Total price', this.totalPrice);
        data.append('Name', form.querySelector(".order__form__name").value);
        data.append('Email', form.querySelector(".order__form__email").value);
        data.append('Phone number', form.querySelector(".order__form__phone-number").value);
        data.append('Comment', form.querySelector(".order__form__comment").value);

        fetch('https://formspree.io/f/mvojobro', {
            method: "POST",
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                form.reset()
                this.cart = {};
                this.saveCart();
                this.renderCart();
                this.hideModal(this.orderModalContainer);
                // generalModalFunction();
                showInfoPopup("succes", "Thanks for your purchase!")
            } else {
                response.json().then(data => {
                    this.hideModal(this.orderModalContainer);
                    showInfoPopup("error", "Oops! Something went wrong. Try again or contact us.")
                })
            }
        }).catch(error => {
            this.hideModal(this.orderModalContainer);
            showInfoPopup("error", "Oops! Something went wrong. Try again or contact us.")
        });
    }
}

new Cart();