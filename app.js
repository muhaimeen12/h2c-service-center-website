// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// Initialize EmailJS and start website after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init("TXEp_uVvMBdqsW0C-");
    
    // Initialize website functionality
    initializeWebsite();
});

function initializeWebsite() {
    setupNavigation();
    setupContactForm();
    setupChatbot();
    setupAnimations();
    setupEventListeners();
}

// Navigation Setup
function setupNavigation() {
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.toggle('show');
        });
    }

    // Close nav menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navMenu.classList.remove('show');
            
            // Handle smooth scrolling
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 70;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close nav menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
        }
    });

    // Handle all anchor links for smooth scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = 70;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Phone number links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Calling:', this.getAttribute('href'));
        });
    });

    // Email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Emailing:', this.getAttribute('href'));
        });
    });
}

// Contact Form Setup with Real EmailJS Integration
function setupContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const service = formData.get('service') || 'General Inquiry';
        const message = formData.get('message') || 'No specific message provided';
        
        // Validate required fields
        if (!name || !email || !phone) {
            showFormStatus('error', 'Please fill in all required fields.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            showFormStatus('error', 'Please enter a valid email address.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Send real email using EmailJS
        try {
            await emailjs.send("service_51ypd2o", "contact_form", {
                from_name: name,
                from_email: email,
                phone: phone,
                service: service,
                message: message,
                source: 'Contact Form',
                to_email: 'h2crefrigeration@gmail.com'
            });
            
            showFormStatus('success', 'Thank you! Your message has been sent successfully. We will contact you soon at ' + phone + '.');
            contactForm.reset();
            
        } catch (error) {
            console.error('EmailJS Contact Form Error:', error);
            showFormStatus('error', 'Sorry, there was an error sending your message. Please call us directly at 8015876822.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show form status message
function showFormStatus(type, message) {
    if (!formStatus) return;
    
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.classList.remove('hidden');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 8000);
}

// Chatbot Setup with Real EmailJS Integration
function setupChatbot() {
    const chatbot = new Chatbot();
}

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.currentStep = 0;
        this.userInfo = {};
        this.steps = [
            {
                message: "Hello! I'm here to help you with H2C Service Center. What's your name?",
                field: 'name',
                validation: (input) => input.trim().length > 0
            },
            {
                message: "Nice to meet you, {name}! What's your email address?",
                field: 'email',
                validation: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
            },
            {
                message: "Great! What's your phone number?",
                field: 'phone',
                validation: (input) => /^[\d\s\-\+\(\)]+$/.test(input) && input.trim().length >= 10
            },
            {
                message: "What type of service do you need help with?",
                field: 'service',
                validation: (input) => input.trim().length > 0,
                suggestions: [
                    'AC Repair & Installation',
                    'Refrigerator Service',
                    'Washing Machine Repair',
                    'PCB Board Repairing',
                    'HVAC Systems',
                    'Electronics Repair',
                    'Other'
                ]
            },
            {
                message: "Please describe your issue or requirements in detail:",
                field: 'message',
                validation: (input) => input.trim().length > 0
            }
        ];
        
        this.init();
    }
    
    init() {
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleChat();
            });
        }
        
        if (chatbotClose) {
            chatbotClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeChat();
            });
        }
        
        if (chatbotSend) {
            chatbotSend.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Add welcome message and initial quick actions
        setTimeout(() => {
            this.addMessage("Welcome to H2C Service Center! How can I help you today?");
            this.addInitialQuickActions();
        }, 1000);
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        if (chatbotWindow) {
            chatbotWindow.classList.remove('hidden');
        }
        if (chatbotInput) {
            chatbotInput.focus();
        }
    }
    
    closeChat() {
        this.isOpen = false;
        if (chatbotWindow) {
            chatbotWindow.classList.add('hidden');
        }
    }
    
    addMessage(content, isUser = false) {
        if (!chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot__message chatbot__message--${isUser ? 'user' : 'bot'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot__message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    addSuggestions(suggestions) {
        if (!chatbotMessages) return;
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'chatbot__suggestions';
        suggestionsDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;';
        
        suggestions.forEach(suggestion => {
            const btn = document.createElement('button');
            btn.textContent = suggestion;
            btn.style.cssText = `
                background: #0072B8;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            btn.addEventListener('click', () => {
                this.handleUserInput(suggestion);
                suggestionsDiv.remove();
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#005B96';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#0072B8';
            });
            
            suggestionsDiv.appendChild(btn);
        });
        
        chatbotMessages.appendChild(suggestionsDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    addInitialQuickActions() {
        if (!chatbotMessages) return;
        
        const quickActionsDiv = document.createElement('div');
        quickActionsDiv.className = 'quick-actions';
        quickActionsDiv.style.cssText = 'margin-top: 16px;';
        
        const quickActions = [
            'Get a Quote',
            'Emergency Repair',
            'Schedule Service',
            'Ask Question'
        ];
        
        quickActions.forEach(action => {
            const btn = document.createElement('button');
            btn.textContent = action;
            btn.style.cssText = `
                display: block;
                width: 100%;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 10px;
                margin: 4px 0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                color: #333;
            `;
            
            btn.addEventListener('click', () => {
                this.handleUserInput(action);
                quickActionsDiv.remove();
                setTimeout(() => this.showNextStep(), 500);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#0072B8';
                btn.style.color = 'white';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#f8f9fa';
                btn.style.color = '#333';
            });
            
            quickActionsDiv.appendChild(btn);
        });
        
        chatbotMessages.appendChild(quickActionsDiv);
    }
    
    sendMessage() {
        if (!chatbotInput) return;
        
        const input = chatbotInput.value.trim();
        if (!input) return;
        
        this.handleUserInput(input);
        chatbotInput.value = '';
    }
    
    handleUserInput(input) {
        // Remove any existing quick actions
        const quickActions = chatbotMessages?.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.remove();
        }
        
        // Add user message
        this.addMessage(input, true);
        
        if (this.currentStep < this.steps.length) {
            const step = this.steps[this.currentStep];
            
            // Validate input
            if (step.validation(input)) {
                // Store user info
                this.userInfo[step.field] = input;
                this.currentStep++;
                
                // Show next step or complete
                setTimeout(() => {
                    if (this.currentStep < this.steps.length) {
                        this.showNextStep();
                    } else {
                        this.completeChat();
                    }
                }, 800);
            } else {
                setTimeout(() => {
                    this.addMessage("Sorry, that doesn't look right. Could you please try again?");
                }, 500);
            }
        }
    }
    
    showNextStep() {
        if (this.currentStep >= this.steps.length) return;
        
        const step = this.steps[this.currentStep];
        let message = step.message;
        
        // Replace placeholders
        Object.keys(this.userInfo).forEach(key => {
            message = message.replace(`{${key}}`, this.userInfo[key]);
        });
        
        this.addMessage(message);
        
        // Add suggestions if available
        if (step.suggestions) {
            setTimeout(() => {
                this.addSuggestions(step.suggestions);
            }, 500);
        }
    }
    
    async completeChat() {
        this.addMessage("Thank you for providing all the details! Let me send this information to our team. They will contact you soon. 📞");
        
        // Send real email using EmailJS
        try {
            await emailjs.send("service_51ypd2o", "chatbot_inquiry", {
                customer_name: this.userInfo.name,
                customer_email: this.userInfo.email,
                customer_phone: this.userInfo.phone,
                service_type: this.userInfo.service,
                customer_message: this.userInfo.message,
                source: 'Website Chatbot',
                to_email: 'h2crefrigeration@gmail.com'
            });
            
            setTimeout(() => {
                this.addMessage("✅ Your request has been sent successfully! Our team will contact you within 24 hours. For urgent matters, please call us at 8015876822.");
            }, 1000);
            
        } catch (error) {
            console.error('EmailJS Chatbot Error:', error);
            setTimeout(() => {
                this.addMessage("❌ There was an error sending your request. Please call us directly at 8015876822 or email h2crefrigeration@gmail.com");
            }, 1000);
        }
        
        // Reset chat after 15 seconds
        setTimeout(() => {
            this.resetChat();
        }, 15000);
    }
    
    resetChat() {
        this.currentStep = 0;
        this.userInfo = {};
        
        // Clear messages except welcome message
        const messages = chatbotMessages?.children;
        if (messages && messages.length > 1) {
            for (let i = messages.length - 1; i > 0; i--) {
                messages[i].remove();
            }
        }
        
        // Re-add quick actions
        setTimeout(() => {
            this.addInitialQuickActions();
        }, 1000);
    }
}

// Additional Event Listeners Setup
function setupEventListeners() {
    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
            }
        }
    });

    // Button ripple effects
    document.querySelectorAll('.btn--primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Animation Setup
function setupAnimations() {
    // Animated counters
    const counters = document.querySelectorAll('.stat__number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 200;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Fade in animations
    const elements = document.querySelectorAll('.service-card, .feature, .contact__item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .loading {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Success console logs
console.log('🚀 H2C Service Center website loaded successfully!');
console.log('📧 Contact form and chatbot connected to: h2crefrigeration@gmail.com');
console.log('📞 Phone numbers: 8015876822 / 7200696822');
console.log('👤 Contact person: Wajid');
console.log('💬 Chatbot is ready for customer inquiries');
console.log('✅ EmailJS integration is active and ready!');
