class ProductsList {

    constructor() {
        this.productsContainer = document.querySelector(".products-container");
        this.productsService = new ProductsService();
        this.renderProducts();
    }
    
    async renderProducts() {
        
        let productsListDomString = ``;
        const products = await this.productsService.getProducts();
        products.forEach(product => {
            productsListDomString += this.createProductCard(product);
        });
        
        this.productsContainer.innerHTML = productsListDomString;
        this.addEventListeners();
    }

    createProductCard(product) {
        return `<div class="product-card">    
        <div class="product-card__image-container">
            <img class="product-card__image"  data-id=${product.id} src="img/products/${product.image}" alt="${product.title}">
        </div>

        <div class="product-card__main">
            <p class="product-card__name">
                ${product.title}
            </p>
        </div>

        <div class="product-card__footer">
            <p class="product-card__price">
                £${product.price}
            </p>
            
            <div class="product-card__buttons-container">
                <button class="product-card__info-btn btn" data-id=${product.id}>
                    Info
                </button>
            
                <button class="buy-btn product-card__buy-btn btn" data-id=${product.id}>
                    Buy
                </button>
            </div>
        </div>
    </div>`;
    }

    addEventListeners() {
        document.querySelectorAll(".product-card__info-btn").forEach(btn => btn.addEventListener("click", this.showProductInfo.bind(this)));
        document.querySelectorAll(".product-card__image").forEach(img => img.addEventListener("click", this.showProductInfo.bind(this)));
        document.querySelectorAll(".buy-btn").forEach( btn => btn.addEventListener('click', this.addProductToCart));
        document.querySelector(".product-info-modal .buy-btn").addEventListener('click', this.closeInfoModal);
    }

    addProductToCart(ev) {
        const cart = new Cart();
        cart.addProduct(ev.target.dataset.id);
    }

    activateInfoModal() {
        document.querySelector(".product-info-modal__container").classList.add("active");
        document.body.classList.add("lock");
    }

    closeInfoModal() {
        document.querySelector(".product-info-modal__container").classList.remove("active");
        document.body.classList.remove("lock");
    }

    async showProductInfo(event) {
        const elementId = event.target.dataset.id;
        const product = await this.productsService.getProductById(elementId);
        const infoModal = document.querySelector(".product-info-modal");

        infoModal.querySelector(".product-info-modal__image img").src = `img/products/${product.image}`;
        infoModal.querySelector(".product-info-modal__title").innerHTML = product.title;
        infoModal.querySelector(".product-info-modal__description").innerHTML = product.description;
        infoModal.querySelector(".product-info-modal__product-price").innerHTML = `£${product.price}`;
        infoModal.querySelector(".product-info-modal__info").scrollTop = 0;
        infoModal.querySelector(".buy-btn").dataset.id = elementId;

        document.querySelector(".product-info-modal__container").classList.add("active");
        document.body.classList.add("lock");
    }



}

new ProductsList();