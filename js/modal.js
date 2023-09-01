(function() {

    const allModals = document.querySelectorAll(".general-modal__container");
    
    function removeModal() {
        for (let modal of allModals) {
            modal.classList.remove("active");
            document.body.classList.remove("lock");
        }
    }
    
    function windowOnClick(ev) {
        for (let modal of allModals) {
            if (ev.target === modal) {
                removeModal();
            }
        }
    }
    
    window.addEventListener('click', windowOnClick);
    allModals.forEach( modal => modal.querySelector(".close-btn").addEventListener('click', removeModal));

})();