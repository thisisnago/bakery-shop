(async function () {

    const carouselPhotos = await (await fetch("api/products-carousel-photos.json")).json();


    const productsCarousel = document.querySelector(".products-carousel");
    const productsCarouselPhotosContainer = document.querySelector(".products-carousel__photos-container");
    let currentSlideIdx = 0;

    function carouselElement(elementId) {
        return `<div class="products-carousel__photo">
                    <img src="${carouselPhotos[elementId].src}" alt="${carouselPhotos[elementId].productName}">
                </div>`;
    }

    function renderCarousel() {
        productsCarouselPhotosContainer.innerHTML = carouselElement(currentSlideIdx);

        if (window.innerWidth > 768) {
            const secondSlideIdx = currentSlideIdx + 1 >= carouselPhotos.length ? 0 : currentSlideIdx + 1;
            productsCarouselPhotosContainer.innerHTML += carouselElement(secondSlideIdx);

            if (window.innerWidth > 991) {
                const thirdSlideIdx = secondSlideIdx + 1 >= carouselPhotos.length ? 0 : secondSlideIdx + 1;
                productsCarouselPhotosContainer.innerHTML += carouselElement(thirdSlideIdx);
            }
        }
    }

    function prevSlide() {
        currentSlideIdx = currentSlideIdx - 1 < 0 ? carouselPhotos.length - 1 : currentSlideIdx - 1;
        renderCarousel();
    }

    function nextSlide() {
        currentSlideIdx = currentSlideIdx + 1 < carouselPhotos.length ? currentSlideIdx + 1 : 0;
        renderCarousel();
    }
    
    function photosTransitions(operation) {
        productsCarouselPhotosContainer.querySelectorAll(".products-carousel__photo").forEach((photo) => photo.classList.remove("active"));
        setTimeout(() => {operation.call()}, 150);
        setTimeout(() => {productsCarouselPhotosContainer.querySelectorAll(".products-carousel__photo").forEach((photo) => photo.classList.add("active"))}, 180);
    }

    productsCarousel.querySelector(".prev-btn").addEventListener('click', () => (photosTransitions(prevSlide)));
    productsCarousel.querySelector(".next-btn").addEventListener('click', () => (photosTransitions(nextSlide)));
    
    renderCarousel();
    productsCarouselPhotosContainer.querySelectorAll(".products-carousel__photo").forEach((photo) => photo.classList.add("active"));
    window.addEventListener('resize', renderCarousel);
    window.addEventListener('resize', () => {productsCarouselPhotosContainer.querySelectorAll(".products-carousel__photo").forEach((photo) => photo.classList.add("active"))});
})();


