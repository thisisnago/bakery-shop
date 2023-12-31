class ProductsList {

    constructor() {
        this.productsContainer = document.querySelector(".products-container");
        this.productsService = new ProductsService();
        this.sortType = 'alphabeticalAscending'; // alphabeticalAscending, alphabeticalDescending, numericalAscending, numericalDescending
        this.renderProducts();
    }
    
    async renderProducts() {
        
        let productsListDomString = ``;
        let products = await this.productsService.getProducts();
        if (this.sortType === 'alphabeticalAscending' || this.sortType === 'alphabeticalDescending') {
            products.sort(this.sortProducts.bind(this));
        } else if (this.sortType === 'numericalAscending') {
            products.sort((a, b) => a.price - b.price)
        } else if (this.sortType === 'numericalDescending') {
            products.sort((a, b) => b.price - a.price)
        } 
        products.forEach(product => {
            productsListDomString += this.createProductCard(product);
        });
        
        this.productsContainer.innerHTML = productsListDomString;
        this.addEventListeners();
    }
    
    sortProducts(prodA, prodB) {
        if (prodA.name < prodB.name) {
            if (this.sortType === 'alphabeticalAscending') {
                return -1;
            } else if (this.sortType === 'alphabeticalDescending') {
                return 1;
            }
        } 
        
        if (prodA.name > prodB.name) {
            if (this.sortType === 'alphabeticalAscending') {
                return 1;
            } else if (this.sortType === 'alphabeticalDescending') {
                return -1;
            }
        }
        
        return 0;
    }

    createProductCard(product) {
        return `<div class="product-card">    
        <div class="product-card__image-container">
            <img class="product-card__image"  data-id=${product.id} src="img/products/${product.image}" alt="${product.name}">
        </div>

        <div class="product-card__main">
            <p class="product-card__name">
                ${product.name}
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
        document.querySelector(".products__sort-type-selector").addEventListener("change", this.changeSortType.bind(this));

    }

    changeSortType() {
        this.sortType = document.querySelector(".products__sort-type-selector").value;
        this.renderProducts();
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
        infoModal.querySelector(".product-info-modal__title").innerHTML = product.name;
        infoModal.querySelector(".product-info-modal__description").innerHTML = product.description;
        infoModal.querySelector(".product-info-modal__product-price").innerHTML = `£${product.price}`;
        infoModal.querySelector(".product-info-modal__info").scrollTop = 0;
        infoModal.querySelector(".buy-btn").dataset.id = elementId;

        document.querySelector(".product-info-modal__container").classList.add("active");
        document.body.classList.add("lock");
    }



}

new ProductsList();