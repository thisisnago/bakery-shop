// function showAlert(type, message) {
//     const alertContainer = document.querySelector(".alert");
//     alertContainer.innerHTML = message;
//     toggleAlertModal();
//     setTimeout(toggleAlertModal, 3000); 
//     alertContainer.classList.remove(type);
    
//     function toggleAlertModal() {
//         alertContainer.classList.toggle("active");
//     }
// }

function showAlert(type, message) { // success or error
    const alertContainer = document.querySelector(".alert-container");
     
    alertContainer.innerHTML = `<div class="alert ${type}">
        ${message}
    </div>`;
    alertContainer.classList.add("active");
    setTimeout(() => alertContainer.classList.remove("active"), 3000);
}
