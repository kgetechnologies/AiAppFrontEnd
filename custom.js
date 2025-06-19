$(document).ready(function () {
    var current_fs, next_fs, previous_fs; // Fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;

    // Set the initial state of the progress bar
    setProgressBar(current);

    // Initially hide all fieldsets except the first one
    $("fieldset:not(:first)").hide();

    // Next button click handler
    $(".next").click(function () {
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        // Validate current fieldset before proceeding
        if (!validateFormFields(current_fs)) {
            return false; // Prevent moving to the next step if validation fails
        }

        // Add Class Active to the next step in the progress bar
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        // Show the next fieldset and animate the current one
        next_fs.show();
        current_fs.animate({
            opacity: 0
        }, {
            step: function (now) {
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({
                    'opacity': opacity
                });
            },
            duration: 500,
            complete: function () {
                current_fs.hide();
            }
        });
        setProgressBar(++current);
    });

    // Previous button click handler
    $(".previous").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        // Remove class active from the current step in the progress bar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        // Show the previous fieldset and animate the current one
        previous_fs.show();
        current_fs.animate({
            opacity: 0
        }, {
            step: function (now) {
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({
                    'opacity': opacity
                });
            },
            duration: 500,
            complete: function () {
                current_fs.hide();
            }
        });
        setProgressBar(--current);
    });

    // Function to update the progress bar
    function setProgressBar(curStep) {
        $("#progressbar li").removeClass("active");
        for (var i = 0; i < curStep; i++) {
            $("#progressbar li").eq(i).addClass("active");
        }
    }

    // *** NEW VALIDATION FUNCTION ***
    function validateFormFields(fieldset) {
        var isValid = true;
        fieldset.find(':input[required]:visible').each(function () {
            var input = $(this);
            var errorMessage = input.next('.error-message'); // Assumes error-message span is next sibling

            // Handle radio buttons and checkboxes separately
            if (input.is(':radio')) {
                var radioGroupName = input.attr('name');
                if ($('input[name="' + radioGroupName + '"]:checked').length === 0) {
                    isValid = false;
                    // Find the common error message element for the radio group
                    var radioError = fieldset.find('.radio-group-error-message[data-for="' + radioGroupName + '"]');
                    if (radioError.length === 0) { // If no specific error element, use generic one or create
                        radioError = input.closest('.input-field').find('.error-message').first();
                    }
                    if (radioError.length > 0) {
                         radioError.text('Please select an option.').show();
                    } else {
                        // Fallback if no specific error span is provided
                        console.error('No specific error message element found for radio group: ' + radioGroupName);
                        input.closest('.input-field').append('<span class="error-message">Please select an option.</span>').find('.error-message').show();
                    }
                } else {
                    var radioError = fieldset.find('.radio-group-error-message[data-for="' + radioGroupName + '"]');
                    if (radioError.length === 0) {
                         radioError = input.closest('.input-field').find('.error-message').first();
                    }
                    radioError.hide().text('');
                }
            } else if (input.is(':checkbox')) {
                if (!input.is(':checked')) {
                    isValid = false;
                    if (errorMessage.length > 0) {
                        errorMessage.text('You must accept the terms and conditions.').show();
                    } else {
                        console.error('No specific error message element found for checkbox: ' + input.attr('id'));
                        input.closest('.input-field').append('<span class="error-message">You must accept the terms and conditions.</span>').find('.error-message').show();
                    }
                } else {
                    errorMessage.hide().text('');
                }
            } else if (input.val().trim() === '') {
                isValid = false;
                if (errorMessage.length > 0) {
                    errorMessage.text('Please fill this field.').show();
                } else {
                    // Fallback if no specific error span is provided
                    console.error('No specific error message element found for input: ' + input.attr('name'));
                    input.after('<span class="error-message">Please fill this field.</span>').next('.error-message').show();
                }
            } else {
                errorMessage.hide().text('');
            }
        });
        return isValid;
    }

    // Handle input changes to hide error messages as the user types/selects
    $('input, select').on('input change', function() {
        var input = $(this);
        var errorMessage = input.next('.error-message');

        if (input.is(':radio')) {
            var radioGroupName = input.attr('name');
            var radioError = input.closest('fieldset').find('.radio-group-error-message[data-for="' + radioGroupName + '"]');
            if (radioError.length === 0) {
                radioError = input.closest('.input-field').find('.error-message').first();
            }
            if ($('input[name="' + radioGroupName + '"]:checked').length > 0) {
                radioError.hide().text('');
            }
        } else if (input.is(':checkbox')) {
            if (input.is(':checked')) {
                errorMessage.hide().text('');
            }
        } else if (input.val().trim() !== '') {
            errorMessage.hide().text('');
        }
    });

    // Submit button handler
    $(".submit").click(function (event) {
        // Prevent default form submission initially to run validation
        event.preventDefault();

        current_fs = $(this).parent();
        if (validateFormFields(current_fs)) {
            // If the last fieldset is valid, you can submit the form
            // Or perform AJAX submission
            alert("Form submitted successfully!");
            // Uncomment the line below to actually submit the form
            // $("#msform").submit();
        } else {
            alert("Please fill all required fields before submitting.");
        }
    });

    // Optional: Existing logic for dynamic fields (from your uploaded custom.js)
    $('input[name="interestedField"]').change(function() {
        if ($(this).val() === 'Other') {
            $('#interestedOtherText').show().attr('required', true);
        } else {
            $('#interestedOtherText').hide().removeAttr('required').val(''); // Clear value when hidden
            $('#interestedOtherText').next('.error-message').hide().text(''); // Hide error message for this specific input
        }
    });

    $('input[name="internshipDuration"]').change(function() {
        if ($(this).val() === 'Other') {
            $('#durationOtherText').show().attr('required', true);
        } else {
            $('#durationOtherText').hide().removeAttr('required').val(''); // Clear value when hidden
            $('#durationOtherText').next('.error-message').hide().text(''); // Hide error message for this specific input
        }
    });
});