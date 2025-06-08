// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseSpeed = 0;
let lastTime = Date.now();

// Track mouse movement and calculate speed
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime > 0) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        mouseSpeed = distance / deltaTime * 10; // Normalize speed
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastTime = currentTime;
});

// Smooth cursor animation with speed-based scaling
function animateCursor() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    // Calculate scale based on mouse speed with smooth interpolation
    const maxSpeed = 4;
    const maxScale = 4;
    const speedScale = Math.min(mouseSpeed / maxSpeed, 1);
    
    // Apply easing function for smoother scaling
    const easedScale = speedScale * speedScale * (3 - 2 * speedScale); // Smoothstep function
    const scale = 1 + (easedScale * (maxScale - 1));
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    // Gradually reduce speed for smooth animation with slower decay
    mouseSpeed *= 0.92;
    
    requestAnimationFrame(animateCursor);
}

// Start cursor animation
animateCursor();

// Add hover effects for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .cta-button, .social-link, input, textarea, [role="button"]');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Add click effect
document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
});

// Hide cursor when mouse leaves window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

// Hide custom cursor in navbar, hero buttons, portfolio, contact and footer sections
const navSection = document.querySelector('nav');
const mobileMenuSection = document.querySelector('#mobile-menu');
const heroButtons = document.querySelectorAll('#home a');
const portfolioSection = document.querySelector('#portfolio');
const contactSection = document.querySelector('#contact');
const footerSection = document.querySelector('footer');

function checkCursorVisibility(e) {
    const target = e.target;
    const isInNav = navSection && navSection.contains(target);
    const isInMobileMenu = mobileMenuSection && mobileMenuSection.contains(target);
    const isInHeroButton = Array.from(heroButtons).some(button => button.contains(target));
    const isInPortfolio = portfolioSection && portfolioSection.contains(target);
    const isInContact = contactSection && contactSection.contains(target);
    const isInFooter = footerSection && footerSection.contains(target);
    
    if (isInNav || isInMobileMenu || isInHeroButton || isInPortfolio || isInContact || isInFooter) {
        cursor.style.display = 'none';
    } else {
        cursor.style.display = 'block';
    }
}

// Add event listeners to track mouse position
document.addEventListener('mouseover', checkCursorVisibility);
document.addEventListener('mousemove', checkCursorVisibility);

// Mobile menu toggle
document.getElementById('menu-toggle').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Enhanced Portfolio filtering with dynamic indicator and effects
const filterButtons = document.querySelectorAll('#portfolio button[data-filter]');
const portfolioItems = document.querySelectorAll('#portfolio > div > div:last-child > div[data-category]');
const filterIndicator = document.querySelector('#portfolio > div > div:nth-child(2) > div > div:first-child');

// Initialize filter system
function initializeFilters() {
    if (filterButtons.length === 0) return;
    
    // Set initial active button and indicator position
    const activeButton = document.querySelector('.filter-btn.active') || filterButtons[0];
    if (!activeButton.classList.contains('active')) {
        activeButton.classList.add('active');
    }
    
    // Initialize all portfolio items as visible
    portfolioItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1) translateY(0)';
        item.style.display = 'block';
        item.style.transition = 'all 0.3s ease';
    });
    
    // Set up indicator after a brief delay to ensure proper positioning
    setTimeout(() => {
        updateFilterIndicator(activeButton);
    }, 100);
    
    filterButtons.forEach((button, index) => {
        // Add ripple effect on click
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = button.getAttribute('data-filter');
            
            // Create ripple effect
            createRippleEffect(e, button);
            
            // Update active button with smooth transition
            updateActiveFilter(button, filter);
            
            // Filter portfolio items with staggered animation
            filterPortfolioItems(filter);
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                const textElement = button.querySelector('span');
                if (textElement) {
                    textElement.style.color = '#1e40af';
                    textElement.style.textShadow = '0 0 8px rgba(30, 64, 175, 0.3)';
                }
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                const textElement = button.querySelector('span');
                if (textElement) {
                    textElement.style.color = '#6b7280';
                    textElement.style.textShadow = 'none';
                }
            }
        });
    });
}

// Create ripple effect
function createRippleEffect(event, button) {
    const ripple = button.querySelector('div:last-child > div');
    if (!ripple) return;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'scale(0)';
    
    // Trigger animation
    requestAnimationFrame(() => {
        ripple.style.transform = 'scale(4)';
        ripple.style.opacity = '0';
    });
    
    // Reset after animation
    setTimeout(() => {
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '1';
    }, 600);
}

// Update active filter button
function updateActiveFilter(activeButton, filter) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        const textElement = btn.querySelector('span');
        if (textElement) {
            textElement.style.color = '#6b7280';
            textElement.style.textShadow = 'none';
        }
    });
    
    // Add active class to clicked button
    activeButton.classList.add('active');
    const activeTextElement = activeButton.querySelector('span');
    if (activeTextElement) {
        activeTextElement.style.color = 'white';
        activeTextElement.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    }
    
    // Update indicator position with smooth animation
    updateFilterIndicator(activeButton);
    
    // Add a subtle pulse effect to the active button
    activeButton.style.animation = 'pulse 0.3s ease-out';
    setTimeout(() => {
        activeButton.style.animation = '';
    }, 300);
}

// Update filter indicator position
function updateFilterIndicator(activeButton) {
    if (!filterIndicator || !activeButton) return;
    
    try {
        const container = activeButton.parentElement;
        if (!container) return;
        
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (buttonRect.width === 0 || containerRect.width === 0) {
            // Retry after a short delay if elements are not yet rendered
            setTimeout(() => updateFilterIndicator(activeButton), 50);
            return;
        }
        
        const offsetLeft = buttonRect.left - containerRect.left;
        const buttonWidth = buttonRect.width;
        
        // Smooth transition for the indicator
        filterIndicator.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        filterIndicator.style.transform = `translateX(${offsetLeft}px)`;
        filterIndicator.style.width = `${buttonWidth}px`;
        
        // Add a subtle glow effect
        filterIndicator.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
    } catch (error) {
        console.warn('Error updating filter indicator:', error);
    }
}

// Filter portfolio items with enhanced animations
function filterPortfolioItems(filter) {
    let visibleIndex = 0;
    
    portfolioItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const hasClass = item.classList.contains(filter);
        const shouldShow = filter === 'all' || itemCategory === filter || hasClass;
        
        if (shouldShow) {
            // Show item with staggered animation
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1) translateY(0)';
            }, visibleIndex * 150);
            
            visibleIndex++;
        } else {
            // Hide item with fade out
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Add a subtle bounce effect to the container
    const portfolioGrid = document.querySelector('#portfolio > div > div:last-child');
    if (portfolioGrid) {
        portfolioGrid.style.transform = 'scale(0.98)';
        setTimeout(() => {
            portfolioGrid.style.transform = 'scale(1)';
        }, 200);
    }
}

// Handle window resize for indicator positioning
function handleResize() {
    const activeButton = document.querySelector('.filter-btn.active');
    if (activeButton) {
        updateFilterIndicator(activeButton);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    window.addEventListener('resize', handleResize);
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilters);
} else {
    initializeFilters();
}

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .rotate-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.animationPlayState = 'running';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Back to top button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission - removed preventDefault to allow FormSubmit to work
// The form now submits directly to FormSubmit service

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Values section animation observer
const valuesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger title animation
            const title = entry.target.querySelector('.fade-in-up');
            if (title) {
                title.style.animationPlayState = 'running';
            }
            
            // Trigger cards animation with staggered delays
            const cards = entry.target.querySelectorAll('.value-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animationPlayState = 'running';
                }, index * 200);
            });
            
            // Stop observing after animation is triggered
            valuesObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
});

// Start observing the values section
const valuesSection = document.getElementById('values-section');
if (valuesSection) {
    valuesObserver.observe(valuesSection);
}

// Enhanced value card interactions with advanced effects
document.querySelectorAll('.value-card').forEach((card, index) => {
    // Mouse enter effects
    card.addEventListener('mouseenter', function(e) {
        // Enhanced transform with perspective
        this.style.transform = 'translateY(-12px) rotateX(5deg) rotateY(5deg) scale(1.02)';
        this.style.transformStyle = 'preserve-3d';
        
        // Create ripple effect
        createRippleEffect(this, e);
        
        // Animate icon with bounce
        const icon = this.querySelector('.w-16');
        if (icon) {
            icon.style.transform = 'scale(1.15) rotate(10deg)';
            icon.style.filter = 'brightness(1.1)';
        }
        
        // Enhance text with glow
        const title = this.querySelector('h4');
        if (title) {
            title.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
        }
    });
    
    // Mouse move for 3D tilt effect
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    // Mouse leave effects
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
        this.style.transformStyle = 'flat';
        
        // Reset icon
        const icon = this.querySelector('.w-16');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.filter = 'brightness(1)';
        }
        
        // Reset text glow
        const title = this.querySelector('h4');
        if (title) {
            title.style.textShadow = 'none';
        }
    });
    
    // Add staggered entrance animation
    setTimeout(() => {
        card.style.animationPlayState = 'running';
    }, index * 150);
});

// Ripple effect function
function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for floating particles
function initParallaxParticles() {
    const particles = document.querySelectorAll('.floating-particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.3;
            particle.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Mouse tracking for enhanced interactivity
function initMouseTracking() {
    const valuesSection = document.getElementById('values-section');
    if (!valuesSection) return;
    
    valuesSection.addEventListener('mousemove', (e) => {
        const particles = valuesSection.querySelectorAll('.floating-particle');
        const rect = valuesSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        particles.forEach((particle, index) => {
            const moveX = (x - 0.5) * 20 * (index + 1);
            const moveY = (y - 0.5) * 20 * (index + 1);
            
            particle.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    valuesSection.addEventListener('mouseleave', () => {
        const particles = valuesSection.querySelectorAll('.floating-particle');
        particles.forEach(particle => {
            particle.style.transform = particle.style.transform.replace(/translate\([^)]*\)/g, '');
        });
    });
}

// Initialize advanced effects
document.addEventListener('DOMContentLoaded', () => {
    initParallaxParticles();
    initMouseTracking();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Performance optimization for animations
function optimizeAnimations() {
    // Reduce animations on low-performance devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.querySelectorAll('.floating-particle').forEach(particle => {
            particle.style.animationDuration = '12s';
        });
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const particles = document.querySelectorAll('.floating-particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    });
}

optimizeAnimations();

// Counter animation for stats section
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when stats section is visible
const statsSection = document.getElementById('stats-section');
let countersAnimated = false;

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            
            // Animate each counter
            const projectsCounter = document.getElementById('projects-counter');
            const clientsCounter = document.getElementById('clients-counter');
            const experienceCounter = document.getElementById('experience-counter');
            
            if (projectsCounter) {
                animateCounter(projectsCounter, parseInt(projectsCounter.dataset.target));
            }
            if (clientsCounter) {
                animateCounter(clientsCounter, parseInt(clientsCounter.dataset.target));
            }
            if (experienceCounter) {
                animateCounter(experienceCounter, parseInt(experienceCounter.dataset.target));
            }
        }
    });
}, observerOptions);

if (statsSection) {
    statsObserver.observe(statsSection);
}

// AI Chatbot Functionality
class AIChat {
    constructor() {
        this.chatbotContainer = document.getElementById('chatbot-container');
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        this.chatbotWindow = document.getElementById('chatbot-window');
        this.chatbotClose = document.getElementById('chatbot-close');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.chatbotButtonsGrid = document.querySelector('.chatbot-buttons-grid');
        this.chatbotTyping = document.getElementById('chatbot-typing');
        this.chatbotNotification = document.querySelector('.chatbot-notification');
        
        this.isOpen = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        this.systemPrompt = this.initializeSystemPrompt();
        this.fallbackResponses = this.initializeFallbackResponses();
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.chatbotToggle.addEventListener('click', () => this.toggleChat());
        this.chatbotClose.addEventListener('click', () => this.closeChat());
        
        // Action buttons
        this.chatbotButtonsGrid.addEventListener('click', async (e) => {
            if (e.target.closest('.chatbot-action-btn') && !this.isProcessing) {
                this.isProcessing = true;
                const button = e.target.closest('.chatbot-action-btn');
                const message = button.dataset.message;
                this.addUserMessage(message);
                try {
                    const response = await this.generateResponse(message);
                    this.addBotMessage(response);
                } catch (error) {
                    console.error('Errore nel messaggio:', error);
                    this.addBotMessage(this.generateFallbackResponse(message));
                } finally {
                    this.isProcessing = false;
                }
            }
        });
        
        // Quick reply buttons
        this.chatbotMessages.addEventListener('click', async (e) => {
            if (e.target.classList.contains('quick-reply') && !this.isProcessing) {
                this.isProcessing = true;
                const message = e.target.dataset.message;
                this.addUserMessage(message);
                try {
                    const response = await this.generateResponse(message);
                    this.addBotMessage(response);
                } catch (error) {
                    console.error('Errore nel quick reply:', error);
                    this.addBotMessage(this.fallbackResponses.error);
                } finally {
                    this.isProcessing = false;
                }
            }
        });
        
        // Hide notification after first interaction
        this.chatbotToggle.addEventListener('click', () => {
            this.chatbotNotification.style.display = 'none';
        });
    }
    
    initializeSystemPrompt() {
        return `Ciao! Sono DevNinja-bot, l'assistente virtuale di DevNinja 🤖

Sono qui per aiutarti a scoprire come possiamo trasformare le tue idee digitali in realtà! Lavoro con un team fantastico di sviluppatori che creano siti web, app e soluzioni AI innovative.

🏢 **Chi siamo:**
DevNinja è un'azienda di sviluppo web con sede a Milano. Siamo specializzati nel creare esperienze digitali che fanno la differenza per i nostri clienti.

📍 **Dove trovarci:**
Via Roma 123, Milano
📧 info@devninja.it
📱 +39 02 1234 5678 (chiamaci dal lunedì al venerdì, 9-18)

🚀 **Cosa facciamo meglio:**
• Siti web moderni e responsive (React, Vue.js, Angular)
• Backend robusti e scalabili (Node.js, Python, PHP)
• E-commerce che convertono davvero
• Chatbot AI come me! 🤖
• App web personalizzate

💡 **Progetti di cui andiamo fieri:**
• Un e-commerce fashion con oltre 10.000 prodotti
• Sistema gestionale per una clinica con telemedicina
• Piattaforma e-learning interattiva
• Chatbot bancario che gestisce migliaia di richieste

💰 **Investimento indicativo:**
• Sito vetrina: €800-1.500
• Sito business: €1.500-3.000
• App web complessa: €3.000-8.000
• Chatbot AI: €500-2.000

⏰ **Tempi di realizzazione:**
• Sito semplice: 2-4 settimane
• Progetto business: 4-8 settimane
• App complessa: 8-16 settimane
• Chatbot: 1-3 settimane

**Come devo comportarmi:**
- Parla come un consulente esperto ma amichevole
- Usa un tono conversazionale e naturale
- Fai domande per capire meglio le esigenze
- Racconta aneddoti sui progetti quando appropriato
- Usa emoji con moderazione per essere più umano
- Suggerisci sempre il prossimo passo concreto
- Se non sai qualcosa, ammettilo onestamente
- Personalizza le risposte in base al contesto
- Mantieni un equilibrio tra professionalità e cordialità
- Evita risposte troppo lunghe o elenchi puntati eccessivi`;
    }
    
    initializeFallbackResponses() {
        return {
            error: "Mi dispiace, sto avendo difficoltà tecniche. Puoi riprovare o contattarci direttamente a info@devninja.it per assistenza immediata. 🔧",
            offline: "Sembra che tu sia offline. Le mie funzionalità AI sono limitate, ma posso comunque aiutarti con informazioni base sui nostri servizi! 📱",
            loading: "Sto elaborando la tua richiesta... Un momento per favore! 🤖"
        };
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.chatbotWindow.style.display = 'flex';
        setTimeout(() => {
            this.chatbotWindow.classList.add('active');
        }, 10);
        this.isOpen = true;
        this.chatbotInput.focus();
    }
    
    closeChat() {
        this.chatbotWindow.classList.remove('active');
        setTimeout(() => {
            this.chatbotWindow.style.display = 'none';
        }, 300);
        this.isOpen = false;
    }
    

    
    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.chatbotMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messageElement = this.createMessageElement(message, 'bot');
        this.chatbotMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    createMessageElement(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (type === 'bot') {
            avatar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            `;
        } else {
            avatar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            `;
        }
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const p = document.createElement('p');
        p.innerHTML = message.replace(/\n/g, '<br>');
        content.appendChild(p);
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(time);
        
        return messageDiv;
    }
    

    
    async generateResponse(message) {
        try {
            // Mostra indicatore di caricamento
            this.showTypingIndicator();
            
            // Controlla se l'API key è disponibile
            let apiKey;
            try {
                apiKey = this.getApiKey();
            } catch (error) {
                console.log('API Key non configurata, uso risposte di fallback');
                this.hideTypingIndicator();
                return this.generateFallbackResponse(message);
            }
            
            // Aggiungi il messaggio dell'utente alla cronologia
            this.conversationHistory.push({
                role: 'user',
                content: message
            });
            
            // Prepara i messaggi per l'API
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompt
                },
                ...this.conversationHistory.slice(-10) // Mantieni solo gli ultimi 10 messaggi
            ];
            
            // Chiama l'API OpenAI
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Aggiungi la risposta dell'AI alla cronologia
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });
            
            this.hideTypingIndicator();
            return aiResponse;
            
        } catch (error) {
            console.error('Errore API AI:', error);
            this.hideTypingIndicator();
            
            // Fallback a risposta predefinita
            return this.generateFallbackResponse(message);
        }
    }
    
    generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Risposte più intelligenti basate su keyword e contesto
        if (lowerMessage.includes('servizi') || lowerMessage.includes('cosa fate') || lowerMessage.includes('che lavoro') || lowerMessage.includes('sviluppo')) {
            const responses = [
                `Ah, ottima domanda! 😊 Noi di DevNinja ci occupiamo principalmente di:\n\nCreiamo siti web moderni con React e Vue.js, sviluppiamo backend robusti, realizziamo e-commerce che convertono davvero e chatbot AI come me!\n\nSaremo felici di discutere del tuo progetto! 🚀`,
                `Perfetto! DevNinja si specializza in:\n\n🌐 Sviluppo web frontend e backend\n🛒 E-commerce personalizzati\n🤖 Chatbot AI intelligenti\n📱 App web responsive`,
                `Ciao! Sono DevNinja-bot e posso parlarti dei nostri servizi:\n\nSviluppiamo soluzioni web complete, dai siti vetrina alle app complesse, passando per e-commerce e chatbot come me!\n\nContattaci per discutere del tuo progetto! 🚀`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (lowerMessage.includes('prezzo') || lowerMessage.includes('costo') || lowerMessage.includes('quanto') || lowerMessage.includes('budget') || lowerMessage.includes('spesa') || lowerMessage.includes('euro') || lowerMessage.includes('soldi')) {
            const responses = [
                `Capisco, il budget è sempre importante! 💰\n\nI nostri progetti partono da €800 per un sito vetrina fino a €8.000 per app web complesse. Ma ogni progetto è unico!\n\nContattaci per un preventivo personalizzato sui costi. 😊`,
                `Ottima domanda sui prezzi! 💰\n\nDipende molto dal tipo di progetto:\n• Sito base: €800-1.500\n• Sito business: €1.500-3.000\n• App web: €3.000-8.000\n• Chatbot: €500-2.000\n\nContattaci per parlare del tuo progetto specifico!`,
                `I prezzi variano in base alle esigenze! 💰\n\nPer un preventivo accurato, contattaci specificando:\n- Che tipo di sito/app ti serve\n- Quali funzionalità vuoi includere\n\nCosì potremo essere più precisi! 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (lowerMessage.includes('contatt') || lowerMessage.includes('telefono') || lowerMessage.includes('email') || lowerMessage.includes('chiamare') || lowerMessage.includes('scrivere') || lowerMessage.includes('dove siete') || lowerMessage.includes('indirizzo')) {
            const responses = [
                `Perfetto! Ecco come puoi raggiungerci:\n\n📧 info@devninja.it (rispondo sempre entro 24h)\n📱 +39 02 1234 5678\n🏢 Via Roma 123, Milano\n\nSiamo disponibili dal lunedì al venerdì, 9-18. Scegli il canale che preferisci! 😊`,
                `Eccoci! Puoi contattarci così:\n\n📧 info@devninja.it\n📱 +39 02 1234 5678\n🏢 Via Roma 123, Milano\n\nIl team è disponibile dal lunedì al venerdì, dalle 9 alle 18. Ti ricontatteremo al più presto! 😊`,
                `Certo! I nostri contatti sono:\n\n📧 info@devninja.it (risposta garantita in 24h)\n📱 +39 02 1234 5678\n🏢 Via Roma 123, Milano\n\nScegli il metodo che preferisci per contattarci! 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (lowerMessage.includes('tempo') || lowerMessage.includes('quanto ci vuole') || lowerMessage.includes('durata') || lowerMessage.includes('veloce') || lowerMessage.includes('presto') || lowerMessage.includes('quando')) {
            const responses = [
                `Ottima domanda! ⏰\n\nI tempi dipendono dalla complessità del progetto:\n\n• Sito semplice: 2-4 settimane\n• Progetto business: 4-8 settimane\n• App complessa: 8-16 settimane\n• Chatbot: 1-3 settimane\n\nContattaci per una stima più precisa del tuo progetto! 😊`,
                `I tempi variano in base al progetto! ⏰\n\nGeneralmente:\n- Siti vetrina: 2-4 settimane\n- Siti business: 1-2 mesi\n- App web: 2-4 mesi\n- Chatbot: 1-3 settimane\n\nContattaci per discutere del tuo progetto specifico!`,
                `Dipende dal tipo di sviluppo! ⏰\n\nPer una stima precisa sui tempi, contattaci specificando:\n- Che tipo di sito/app ti serve\n- Se hai già i contenuti pronti\n- Quali funzionalità particolari servono\n\nCosì potremo darti una stima accurata! 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Saluti e domande generiche
        if (lowerMessage.includes('ciao') || lowerMessage.includes('salve') || lowerMessage.includes('buongiorno') || lowerMessage.includes('buonasera') || lowerMessage.includes('hey')) {
            const responses = [
                `Ciao! 👋 Sono DevNinja-bot! Sono qui per aiutarti con informazioni sui nostri servizi di sviluppo web! 😊`,
                `Salve! 🤖 DevNinja-bot qui! Sono pronto ad aiutarti con tutte le informazioni su sviluppo web, prezzi e servizi. Usa i bottoni per scoprire di più! 😊`,
                `Hey! 👋 Benvenuto! Sono l'assistente virtuale di DevNinja. Posso aiutarti con domande su siti web, app, e-commerce e molto altro! 🚀`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Domande su chi è il bot
        if (lowerMessage.includes('chi sei') || lowerMessage.includes('cosa sei') || lowerMessage.includes('nome') || lowerMessage.includes('presentati')) {
            const responses = [
                `Sono DevNinja-bot! 🤖 L'assistente virtuale di DevNinja, un'azienda di sviluppo web di Milano. Sono qui per aiutarti con informazioni sui nostri servizi! 😊`,
                `Mi chiamo DevNinja-bot! 🤖 Sono un chatbot AI che lavora per DevNinja. Il mio compito è aiutarti a scoprire come possiamo realizzare il tuo progetto web! 🚀`,
                `Ciao! Sono DevNinja-bot, il tuo assistente virtuale! 🤖 Lavoro per DevNinja e sono specializzato nel fornire informazioni su sviluppo web, prezzi e servizi. Usa i bottoni per esplorare! 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Domande specifiche sui siti web
        if (lowerMessage.includes('siti web') || lowerMessage.includes('sito web') || lowerMessage.includes('sito internet')) {
            const responses = [
                `Perfetto! 🌐 Realizziamo siti web di ogni tipo:\n\n• Siti vetrina professionali\n• Siti aziendali completi\n• Landing page ottimizzate\n• Portfolio creativi\n• Blog e magazine\n\nTutti i nostri siti sono responsive, veloci e SEO-friendly. Contattaci per il tuo progetto! 😊`,
                `Ottima scelta! 🌐 I nostri siti web includono:\n\n✅ Design moderno e responsive\n✅ Ottimizzazione SEO\n✅ Velocità di caricamento elevata\n✅ Sicurezza avanzata\n✅ Gestione contenuti facile\n\nContattaci per parlare del tuo progetto!`,
                `Specializzati in siti web! 🌐\n\nOffriamo:\n- Sviluppo custom o CMS\n- Design unico e professionale\n- Ottimizzazione per mobile\n- Integrazione social e analytics\n- Manutenzione e supporto\n\nContattaci per discutere del design! 🎨`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Domande su e-commerce
        if (lowerMessage.includes('e-commerce') || lowerMessage.includes('ecommerce') || lowerMessage.includes('negozio online') || lowerMessage.includes('vendere online')) {
            const responses = [
                `Fantastico! 🛒 Creiamo e-commerce completi e professionali:\n\n• Catalogo prodotti illimitato\n• Gestione ordini e magazzino\n• Pagamenti sicuri (PayPal, Stripe, ecc.)\n• Spedizioni automatizzate\n• Dashboard amministrativa\n• App mobile opzionale\n\nContattaci per il tuo negozio online! 😊`,
                `Perfetto per il business online! 🛒\n\nI nostri e-commerce includono:\n✅ Design responsive e moderno\n✅ Carrello e checkout ottimizzati\n✅ Gestione clienti e ordini\n✅ Integrazione con corrieri\n✅ Analytics e reportistica\n✅ SEO per prodotti\n\nContattaci per iniziare a vendere online!`,
                `E-commerce è la nostra specialità! 🛒\n\nCaratteristiche principali:\n- Piattaforma scalabile\n- Sicurezza PCI compliant\n- Multi-lingua e multi-valuta\n- Gestione sconti e promozioni\n- Integrazione social commerce\n\nContattaci per lanciare il tuo business online! 📦`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Domande su app web
        if (lowerMessage.includes('app web') || lowerMessage.includes('applicazione web') || lowerMessage.includes('web app')) {
            const responses = [
                `Eccellente! 📱 Sviluppiamo app web avanzate:\n\n• Progressive Web App (PWA)\n• Dashboard gestionali\n• Piattaforme SaaS\n• Sistemi di prenotazione\n• CRM personalizzati\n• Portali utente\n\nTutte funzionano su desktop, tablet e mobile. Contattaci per la tua app! 🚀`,
                `App web su misura! 📱\n\nI nostri servizi includono:\n✅ Interfacce intuitive\n✅ Database sicuri\n✅ API personalizzate\n✅ Autenticazione utenti\n✅ Notifiche real-time\n✅ Backup automatici\n\nContattaci per realizzare la tua idea!`,
                `Specializzati in app web! 📱\n\nTecnologie moderne:\n- React, Vue, Angular\n- Node.js, Python, PHP\n- Database SQL/NoSQL\n- Cloud hosting scalabile\n- Sicurezza enterprise\n\nContattaci per sviluppare la tua soluzione! 💡`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Domande su chatbot
        if (lowerMessage.includes('chatbot') || lowerMessage.includes('chat bot') || lowerMessage.includes('assistente virtuale')) {
            const responses = [
                `Ottima idea! 🤖 Creiamo chatbot intelligenti come me:\n\n• Assistenti clienti 24/7\n• Chatbot per e-commerce\n• Bot per prenotazioni\n• Assistenti informativi\n• Integrazione WhatsApp/Telegram\n• AI conversazionale avanzata\n\nContattaci per automatizzare il tuo customer service! 😊`,
                `Chatbot personalizzati! 🤖\n\nCaratteristiche:\n✅ Risposte intelligenti\n✅ Integrazione CRM\n✅ Multi-piattaforma\n✅ Analytics conversazioni\n✅ Escalation umana\n✅ Training personalizzato\n\nContattaci per il tuo settore specifico!`,
                `Come me, ma su misura! 🤖\n\nOffriamo:\n- Chatbot rule-based o AI\n- Integrazione con sistemi esistenti\n- Design conversazionale\n- Testing e ottimizzazione\n- Manutenzione continua\n\nContattaci per progettare il tuo chatbot! 💬`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Risposte di default variabili
        const defaultResponses = [
            `Ciao! Sono DevNinja-bot! 🤖\n\nSono l'assistente virtuale di DevNinja e sono qui per aiutarti con qualsiasi domanda sui nostri servizi di sviluppo web. Che si tratti di un nuovo sito, un e-commerce o un chatbot come me, sono qui per te!\n\nUsa i bottoni per scoprire di più! 😊`,
            `Ciao! DevNinja-bot qui! 🤖\n\nPosso aiutarti con informazioni su:\n• Sviluppo web e app\n• Prezzi e preventivi\n• Tempi di realizzazione\n• Contatti del team\n\nUsa i bottoni per esplorare! 😊`,
            `Salve! Sono DevNinja-bot, il tuo assistente virtuale! 🤖\n\nSono qui per rispondere alle tue domande su sviluppo web, e-commerce, chatbot e molto altro!\n\nUsa i bottoni per iniziare! 😊`,
            `Ciao! DevNinja-bot al tuo servizio! 🤖\n\nHo tutte le informazioni sui nostri servizi di sviluppo web. Usa i bottoni per scoprire tutto!\n\nServizi, prezzi, tempi, contatti... tutto a portata di click! 😊`
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    getApiKey() {
        // Usa la classe ChatbotConfig per gestire l'API key
        if (window.ChatbotConfig) {
            return window.ChatbotConfig.getApiKey();
        }
        
        // Fallback se ChatbotConfig non è disponibile
        const apiKey = localStorage.getItem('openai_api_key');
        if (!apiKey) {
            throw new Error('API Key non configurata. Usa ChatbotConfig.setApiKey("your-key") nella console.');
        }
        return apiKey;
    }
    
    showTypingIndicator() {
        const typingIndicator = this.chatbotWindow.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }
    
    hideTypingIndicator() {
        const typingIndicator = this.chatbotWindow.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }
    
    showTyping() {
        this.chatbotTyping.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.chatbotTyping.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        }, 100);
    }
}

// Initialize chatbot when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AIChat();
    });
} else {
    new AIChat();
}