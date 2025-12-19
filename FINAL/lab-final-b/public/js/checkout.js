$(document).ready(function() {
    $('#cardFields').hide();
    
    $('input[name="paymentMethod"]').change(function() {
        $(this).val() === 'credit' ? $('#cardFields').show() : $('#cardFields').hide();
    });
    
    $('#checkoutForm').submit(function(e) {
        e.preventDefault();
        let valid = true;
        
        const validateField = (field, condition) => {
            condition ? $(field).addClass('is-invalid') && (valid = false) : $(field).removeClass('is-invalid');
        };
        
        validateField('#fullname', $('#fullname').val().length < 3);
        validateField('#email', !$('#email').val().includes('@'));
        validateField('#phone', $('#phone').val().length < 10);
        validateField('#address', $('#address').val().length === 0);
        validateField('#city', $('#city').val().length === 0);
        validateField('#postalcode', $('#postalcode').val().length < 4);
        validateField('#country', $('#country').val() === '');
        validateField('#terms', !$('#terms').is(':checked'));
        
        if (!$('input[name="paymentMethod"]:checked').val()) {
            $('#payment-error').show();
            valid = false;
        } else {
            $('#payment-error').hide();
            if ($('input[name="paymentMethod"]:checked').val() === 'credit') {
                validateField('#cardname', $('#cardname').val().length === 0);
                validateField('#cardnumber', $('#cardnumber').val().length === 0);
            }
        }
        
        if (valid) this.submit();
    });
});
