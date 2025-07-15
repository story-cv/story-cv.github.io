// Comparison Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleInputs = document.querySelectorAll('input[name="comparison"]');
    const chatgptView = document.getElementById('chatgpt-view');
    const storycvView = document.getElementById('storycv-view');

    function switchView(activeView) {
        // Remove active class from all views
        chatgptView.classList.remove('active');
        storycvView.classList.remove('active');
        
        // Add active class to the selected view with a slight delay for smooth transition
        setTimeout(() => {
            if (activeView === 'chatgpt') {
                chatgptView.classList.add('active');
            } else {
                storycvView.classList.add('active');
            }
        }, 150);
    }

    // Add event listeners to toggle inputs
    toggleInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                switchView(this.value);
            }
        });
    });

    // Add staggered animation to step cards when view becomes active
    function animateStepCards(container) {
        const stepCards = container.querySelectorAll('.step-card');
        stepCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 50}ms`;
            card.classList.add('step-animate');
        });
    }

    // Add intersection observer for initial load animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeView = entry.target.querySelector('.comparison-view.active');
                if (activeView) {
                    animateStepCards(activeView);
                }
                observer.unobserve(entry.target);
            }
        });
    });

    const comparisonSection = document.querySelector('.comparison');
    if (comparisonSection) {
        observer.observe(comparisonSection);
    }
});
