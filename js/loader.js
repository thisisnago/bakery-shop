(function() {
    const loader = document.querySelector(".loader");

    window.onload = function() {
        loader.classList.remove("active");
        loader.querySelector(".loader__icon").classList.remove("active");
        document.body.classList.remove("lock");
        setTimeout(() => loader.classList.add("hidden"), 5000);
    }
})();