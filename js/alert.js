function showAlert(type, message) { // success or error
    const alertContainer = document.querySelector(".alert-container");
     
    alertContainer.innerHTML = `<div class="alert ${type}">
        ${message}
    </div>`;
    alertContainer.classList.add("active");
    setTimeout(() => alertContainer.classList.remove("active"), 3000);
}
