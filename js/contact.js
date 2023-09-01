class Contact {
    constructor() {
        this.contactForm = document.querySelector(".contact__form");
        this.addEventListeners();
    }

    addEventListeners() {
        document.querySelector(".contact__form__sumbit-btn").addEventListener('click', this.sendForm.bind(this));
    }
    
    hideInfoPopup() {
        document.querySelector(".info-popup__container").classList.remove("active");
        document.body.classList.remove("lock");
    }
    
    sendForm(event) {
        event.stopPropagation();
        event.preventDefault();
    
        const form = this.contactForm;

        if (!form.checkValidity()) {
            if (!form.querySelector(".contact__form__name").checkValidity()) {
                return showAlert("error", "Please, enter your name");
            } else if (!form.querySelector(".contact__form__email").checkValidity()) {
                return showAlert("error", "Please, enter your email");
            } else if (!form.querySelector(".contact__form__phone-number").checkValidity()) {
                return showAlert("error", "Please, enter your phone number");
            } else if (!form.querySelector(".contact__form__message").checkValidity()) {
                return showAlert("error", "Please, enter your message");
            }
        }

        let data = new FormData();
        data.append("Name", this.contactForm.querySelector(".contact__form__name").value);
        data.append("E-mail", this.contactForm.querySelector(".contact__form__email").value);
        data.append("Phone number", this.contactForm.querySelector(".contact__form__phone-number").value);
        data.append("Message", this.contactForm.querySelector(".contact__form__message").value);

        fetch('https://formspree.io/f/mwkdknbp', {
            method: "POST",
            body: data,
            headers: {
                'Accept': 'application/json'
            }
          }).then(response => {
            if (response.ok) {
                showInfoPopup("succes", "Thanks for your submission!");
                form.reset()
            } else {
              response.json().then(data => {
                showInfoPopup("error", "Oops! Something went wrong. Try again or contact us.");
              })
            }
          }).catch(error => {
            console.log("Oops! There was a problem submitting your form");
            showInfoPopup("error", "Oops! Something went wrong. Try again or contact us.");
          });

    }
}

new Contact();