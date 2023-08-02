(function () {

    // function mouseTracker(ev) {
    //     console.log(ev.target);
    // }

    // document.body.addEventListener('click', mouseTracker);


    const burgerButton = document.querySelector(".header-nav__burger");
    const navWrapper = document.querySelector(".header-nav__menu-wrapper__container");
    const navLinks = document.querySelectorAll(".header-nav__link");

    
    function toggleModal() {
        burgerButton.classList.toggle("active");
        navWrapper.classList.toggle("active");
        document.body.classList.toggle("lock");
    }
    
    function removeModal() {
        burgerButton.classList.remove("active");
        navWrapper.classList.remove("active");
        document.body.classList.remove("lock");
    }
    
    navLinks.forEach(link => link.addEventListener('click', removeModal));
    burgerButton.addEventListener("click", toggleModal);

}
)();