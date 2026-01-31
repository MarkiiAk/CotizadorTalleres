// SAG Garage - Main JavaScript
// Autor: SAG Garage Development Team
// Versión: 1.0.0

'use strict';

// ===================================
// INITIALIZE AOS (Animate On Scroll)
// ===================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ===================================
// LOADING SCREEN
// ===================================
window.addEventListener('load', function() {
    setTimeout(function() {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (loaderWrapper) {
            loaderWrapper.classList.add('hidden');
        }
    }, 1500);
});

// ===================================
// SWIPER SLIDER INITIALIZATION
// ===================================
const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 800,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    }
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// BACK TO TOP BUTTON
// ===================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// CONTACT FORM HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Validate form fields
    if (!name || !email || !phone || !message) {
        showFormMessage('Por favor completa todos los campos requeridos.', 'error');
        return;
    }
    
    // Create mailto link
    const subject = encodeURIComponent('Solicitud de Información - SAG Garage');
    const body = encodeURIComponent(
        `Nombre: ${name}\n` +
        `Email: ${email}\n` +
        `Teléfono: ${phone}\n\n` +
        `Mensaje:\n${message}`
    );
    
    const mailtoLink = `mailto:markii.candiani@live.com.mx?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showFormMessage('Se abrirá tu cliente de correo para enviar el mensaje.', 'success');
    
    // Reset form after delay
    setTimeout(function() {
        contactForm.reset();
        hideFormMessage();
    }, 3000);
});

// Helper function to show form messages
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

// Helper function to hide form messages
function hideFormMessage() {
    formMessage.style.display = 'none';
}

// ===================================
// PARALLAX EFFECT FOR HERO SECTION
// ===================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ===================================
// INFO CARDS CLICK HANDLING
// ===================================
const infoCards = document.querySelectorAll('.info-card');

infoCards.forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h3').textContent;
        
        // You can customize this behavior based on your needs
        // For now, showing an alert - could be replaced with modal, download, etc.
        alert(`Funcionalidad de "${title}" - Próximamente disponible`);
        
        // Example: Trigger file download
        // if (title.includes('Manual')) {
        //     window.open('/path/to/manual.pdf', '_blank');
        // }
    });
});

// ===================================
// CONSOLE BRANDING
// ===================================
console.log(
    '%c SAG GARAGE ',
    'background: #b7ff00; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;'
);
console.log(
    '%c Servicio Automotriz Premium ',
    'background: #0a0a0a; color: #b7ff00; font-size: 14px; padding: 5px;'
);
console.log(
    '%c Developed with ❤️ for SAG Garage ',
    'color: #a0a0a0; font-size: 12px;'
);

// ===================================
// PERFORMANCE MONITORING (Optional)
// ===================================
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// ===================================
// PREVENT FORM RESUBMISSION
// ===================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}