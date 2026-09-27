(() => {
    'use strict';
    
    // Bootstrap client-side form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Tax switch toggle handler for index page
    const taxSwitch = document.getElementById("taxSwitch");
    if (taxSwitch) {
        taxSwitch.addEventListener("click", () => {
            const taxInfoElements = document.getElementsByClassName("tax-info");
            for (let info of taxInfoElements) {
                if (info.classList.contains("d-none")) {
                    info.classList.remove("d-none");
                } else {
                    info.classList.add("d-none");
                }
            }
        });
    }
})();