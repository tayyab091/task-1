console.log("Script loaded successfully");
    (() => {
      'use strict'
      const form = document.getElementById('checkoutForm');

      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          window.location.href = "success.html";
        }
        form.classList.add('was-validated');
      }, false);
    })();
