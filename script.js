document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Functionality
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    // Toggle mobile menu
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileNav.classList.contains('active') && 
                !hamburgerMenu.contains(event.target) && 
                !mobileNav.contains(event.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Multi-step booking system
    const steps = document.querySelectorAll('.step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
    const bookingForm = document.getElementById('booking-form');
    
    // Initialize step indicators
    stepIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            goToStep(stepNumber);
        });
    });
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = getCurrentStep();
            const nextStep = this.getAttribute('data-next');
            
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });
    
    // Single checkbox selection
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                serviceCheckboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });
            }
        });
    });
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(3)) {
                // All validation passed, submit the form
                alert('Your appointment has been booked successfully!');
                // In a real application, you would send the data to a server here
                resetForm();
            }
        });
    }
    
    // Helper functions
    function getCurrentStep() {
        for (let i = 0; i < steps.length; i++) {
            if (steps[i].classList.contains('active')) {
                return i + 1;
            }
        }
        return 1;
    }
    
    function goToStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Show the selected step
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Update step indicators
        stepIndicators.forEach(indicator => {
            const indicatorStep = indicator.getAttribute('data-step');
            
            if (indicatorStep < stepNumber) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
            } else if (indicatorStep == stepNumber) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
    }
    
    function validateStep(stepNumber) {
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Step 1 validation: Service selection
        if (stepNumber === 1) {
            const selectedServices = Array.from(serviceCheckboxes).filter(cb => cb.checked);
            
            if (selectedServices.length === 0) {
                const serviceError = document.getElementById('service-error');
                if (serviceError) {
                    serviceError.textContent = 'Please select at least one service';
                }
                isValid = false;
            }
        }
        
        // Step 2 validation: Date and time
        if (stepNumber === 2) {
            const date = document.getElementById('appointment-date');
            const time = document.getElementById('appointment-time');
            
            if (date && !date.value) {
                const datetimeError = document.getElementById('datetime-error');
                if (datetimeError) {
                    datetimeError.textContent = 'Please select a date';
                }
                date.classList.add('error');
                isValid = false;
            }
            
            if (time && !time.value) {
                const datetimeError = document.getElementById('datetime-error');
                if (datetimeError) {
                    datetimeError.textContent = 'Please select a time';
                }
                time.classList.add('error');
                isValid = false;
            }
        }
        
        // Step 3 validation: Personal details
        if (stepNumber === 3) {
            const name = document.getElementById('full-name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            
            if (name && !name.value.trim()) {
                const nameError = document.getElementById('name-error');
                if (nameError) {
                    nameError.textContent = 'Please enter your full name';
                }
                name.classList.add('error');
                isValid = false;
            }
            
            if (phone && !phone.value.trim()) {
                const phoneError = document.getElementById('phone-error');
                if (phoneError) {
                    phoneError.textContent = 'Please enter your phone number';
                }
                phone.classList.add('error');
                isValid = false;
            } else if (phone && !/^\d{10,}$/.test(phone.value.replace(/\D/g, ''))) {
                const phoneError = document.getElementById('phone-error');
                if (phoneError) {
                    phoneError.textContent = 'Please enter a valid phone number';
                }
                phone.classList.add('error');
                isValid = false;
            }
            
            if (email && !email.value.trim()) {
                const emailError = document.getElementById('email-error');
                if (emailError) {
                    emailError.textContent = 'Please enter your email address';
                }
                email.classList.add('error');
                isValid = false;
            } else if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
                const emailError = document.getElementById('email-error');
                if (emailError) {
                    emailError.textContent = 'Please enter a valid email address';
                }
                email.classList.add('error');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function resetForm() {
        // Reset form fields
        if (bookingForm) {
            bookingForm.reset();
        }
        
        // Reset to step 1
        goToStep(1);
        
        // Clear error states
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
});

// Function to close mobile menu (global function for onclick handlers)
function closeMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}