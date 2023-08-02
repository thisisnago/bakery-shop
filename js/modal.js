// (function() {

//     const modal = document.querySelector(".general-modal__container");
    
    
//     function removeModal() {
//         modal.classList.remove("active");
//         document.body.classList.remove("lock");
//     }
    
//     function windowOnClick(ev) {
//         if (ev.target === modal) {
//             removeModal();
//         }
//     }
    
//     modal.querySelectorAll(".close-btn").forEach(btn => btn.addEventListener('click', removeModal));
//     modal.querySelector(".close-btn").addEventListener('click', removeModal);
//     window.addEventListener('click', windowOnClick);

// })();

(function() {

    const allModals = document.querySelectorAll(".general-modal__container");
    
    function removeModal() {
        // modal.classList.remove("active");
        // document.body.classList.remove("lock");
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
    
    // modal.querySelectorAll(".close-btn").forEach(btn => btn.addEventListener('click', removeModal));
    window.addEventListener('click', windowOnClick);
    allModals.forEach( modal => modal.querySelector(".close-btn").addEventListener('click', removeModal));

})();