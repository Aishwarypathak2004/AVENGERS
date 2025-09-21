// ===== ALL IS WELL - Mental Wellness App JavaScript =====
// Accessibility-first, crisis-aware interactive features

class AllIsWellApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing ALL IS WELL app...');
        
        // Initialize all components
        this.initNavigation();
        this.initHero();
        this.initBreathing();
        this.initAffirmations();
        this.initMotivationCarousel();
        this.initAssessment();
        this.initChat();
        this.initAccessibility();
        this.initURLParams();
        
        console.log('ALL IS WELL app initialized successfully');
    }

    // ===== NAVIGATION =====
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    navToggle.focus();
                }
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== HERO SECTION =====
    initHero() {
        this.startTypewriter();
    }

    startTypewriter() {
        const element = document.getElementById('affirmation-text');
        if (!element) return;
        const text = "Everything is going to be fine my friend 🙂";
        let i = 0;
        
        element.textContent = '';
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        
        // Start after initial page load animation
        setTimeout(typeWriter, 1500);
    }

    // ===== BREATHING EXERCISE =====
    initBreathing() {
        const breathingCircle = document.querySelector('.breathing-circle');
        const breathingInstructions = document.getElementById('breathing-instructions');
        const playBtn = document.querySelector('.breathing-play');
        const pauseBtn = document.querySelector('.breathing-pause');
        const triggers = document.querySelectorAll('.breathing-trigger');

        if (!breathingCircle) return;
        
        let isBreathing = false;
        let breathingInterval = null;
        let phase = 'inhale'; // inhale, hold, exhale, pause
        let phaseTimer = 0;
        
        const phases = {
            inhale: { duration: 4, text: 'Breathe in...' },
            hold: { duration: 2, text: 'Hold...' },
            exhale: { duration: 6, text: 'Breathe out...' },
            pause: { duration: 2, text: 'Rest...' }
        };

        const startBreathing = () => {
            if (isBreathing) return;
            
            isBreathing = true;
            breathingCircle.classList.add('breathing');
            if (playBtn) playBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'block';
            
            this.announceToScreenReader('Starting breathing exercise');
            
            breathingInterval = setInterval(() => {
                phaseTimer++;
                const currentPhase = phases[phase];
                
                if (phaseTimer >= currentPhase.duration) {
                    phaseTimer = 0;
                    
                    switch (phase) {
                        case 'inhale': phase = 'hold'; break;
                        case 'hold': phase = 'exhale'; break;
                        case 'exhale': phase = 'pause'; break;
                        case 'pause': phase = 'inhale'; break;
                    }
                }
                
                const timeLeft = phases[phase].duration - phaseTimer;
                if (breathingInstructions) breathingInstructions.textContent = `${phases[phase].text} (${timeLeft}s)`;
                
            }, 1000);
        };

        const stopBreathing = () => {
            if (!isBreathing) return;
            
            isBreathing = false;
            breathingCircle.classList.remove('breathing');
            if (playBtn) playBtn.style.display = 'block';
            if (pauseBtn) pauseBtn.style.display = 'none';
            
            if (breathingInterval) {
                clearInterval(breathingInterval);
                breathingInterval = null;
            }
            
            phase = 'inhale';
            phaseTimer = 0;
            if (breathingInstructions) breathingInstructions.textContent = 'Click the circle to begin';
            
            this.announceToScreenReader('Breathing exercise stopped');
        };

        breathingCircle.addEventListener('click', () => {
            isBreathing ? stopBreathing() : startBreathing();
        });

        breathingCircle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                isBreathing ? stopBreathing() : startBreathing();
            }
        });

        if (playBtn) playBtn.addEventListener('click', startBreathing);
        if (pauseBtn) pauseBtn.addEventListener('click', stopBreathing);

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const reliefSection = document.getElementById('relief');
                if (reliefSection) {
                    reliefSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        if (!isBreathing) startBreathing();
                    }, 1000);
                }
            });
        });
    }

    // ===== FLOATING AFFIRMATIONS =====
    initAffirmations() {
        const affirmations = document.querySelectorAll('.floating-affirmation');
        
        const affirmationMessages = [
            "Remember: You are stronger than you think ✨",
            "This feeling is temporary, you are permanent 🌟",
            "You deserve love and kindness, especially from yourself 💖",
            "Peace flows through you with every breath 🕊️"
        ];

        affirmations.forEach((affirmation, index) => {
            const handleClick = () => {
                this.announceToScreenReader(affirmationMessages[index]);
                
                affirmation.style.transform = 'scale(1.2) translateY(-10px)';
                setTimeout(() => {
                    affirmation.style.transform = '';
                }, 300);
            };

            affirmation.addEventListener('click', handleClick);
            affirmation.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            });
        });
    }

    // ===== MOTIVATION CAROUSEL =====
    initMotivationCarousel() {
        const track = document.getElementById('motivation-track');
        if (!track) return;

        const indicators = document.querySelector('.carousel-indicators');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const carousel = document.querySelector('.motivation-carousel');

        const motivations = [
            { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins" },
            { text: "Your current situation is not your final destination. The best is yet to come.", author: "Unknown" },
            { text: "The only way out is through. And the way through is together.", author: "Unknown" },
            { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
            { text: "This too shall pass. It might pass like a kidney stone, but it will pass.", author: "Unknown" },
            { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" }
        ];

        let currentSlide = 0;
        let autoplayInterval = null;

        motivations.forEach((motivation, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `<p class="motivation-text">"${motivation.text}"</p><p class="motivation-author">— ${motivation.author}</p>`;
            track.appendChild(slide);
        });

        if (indicators) {
            motivations.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to motivation ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                indicators.appendChild(dot);
            });
        }

        const goToSlide = (slideIndex) => {
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            currentSlide = (slideIndex + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
            
            startAutoplay();
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);
        const stopAutoplay = () => clearInterval(autoplayInterval);
        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 5000);
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
            carousel.addEventListener('focusin', stopAutoplay);
            carousel.addEventListener('focusout', startAutoplay);
        }

        startAutoplay();
    }

    // ===== ASSESSMENT MODAL =====
    initAssessment() {
        const modal = document.getElementById('assessment-modal');
        if (!modal) return;

        const triggers = document.querySelectorAll('.assessment-trigger');
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        const questions = [
            { id: 1, text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?", options: [{ text: "Not at all", value: 0 }, { text: "Several days", value: 1 }, { text: "More than half the days", value: 2 }, { text: "Nearly every day", value: 3 }] },
            { id: 2, text: "How often have you felt nervous, anxious, or on edge?", options: [{ text: "Not at all", value: 0 }, { text: "Several days", value: 1 }, { text: "More than half the days", value: 2 }, { text: "Nearly every day", value: 3 }] },
            { id: 3, text: "How would you rate your overall stress level recently?", options: [{ text: "Very low", value: 0 }, { text: "Low", value: 1 }, { text: "Moderate", value: 2 }, { text: "High", value: 3 }, { text: "Very high", value: 4 }] },
            { id: 4, text: "How well have you been sleeping?", options: [{ text: "Very well", value: 0 }, { text: "Fairly well", value: 1 }, { text: "Not very well", value: 2 }, { text: "Not well at all", value: 3 }] },
            { id: 5, text: "How often do you feel overwhelmed by daily responsibilities?", options: [{ text: "Never", value: 0 }, { text: "Rarely", value: 1 }, { text: "Sometimes", value: 2 }, { text: "Often", value: 3 }, { text: "Always", value: 4 }] },
            { id: 6, text: "How satisfied are you with your social connections?", options: [{ text: "Very satisfied", value: 0 }, { text: "Satisfied", value: 1 }, { text: "Neutral", value: 2 }, { text: "Dissatisfied", value: 3 }] },
            { id: 7, text: "How often do you engage in activities you enjoy?", options: [{ text: "Daily", value: 0 }, { text: "Several times a week", value: 1 }, { text: "Once a week", value: 2 }, { text: "Rarely", value: 3 }, { text: "Never", value: 4 }] },
            { id: 8, text: "How hopeful do you feel about the future?", options: [{ text: "Very hopeful", value: 0 }, { text: "Somewhat hopeful", value: 1 }, { text: "Neutral", value: 2 }, { text: "Not very hopeful", value: 3 }, { text: "Not hopeful at all", value: 4 }] }
        ];

        let currentQuestion = 0;
        let responses = [];
        let isOpen = false;

        const openModal = () => {
            isOpen = true;
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
            currentQuestion = 0;
            responses = [];
            showAssessmentContent();
            showQuestion(0);
            const firstFocusable = modal.querySelector('h2');
            if (firstFocusable) firstFocusable.focus();
            this.trapFocus(modal);
        };

        const closeModal = () => {
            isOpen = false;
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
            const trigger = document.querySelector('.assessment-trigger');
            if (trigger) trigger.focus();
        };

        const showAssessmentContent = () => {
            document.getElementById('assessment-content').style.display = 'block';
            document.getElementById('assessment-results').style.display = 'none';
        };

        const showResults = () => {
            document.getElementById('assessment-content').style.display = 'none';
            document.getElementById('assessment-results').style.display = 'block';
        };

        const showQuestion = (index) => {
            const container = document.getElementById('question-container');
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            const prevBtn = document.getElementById('prev-question');
            const nextBtn = document.getElementById('next-question');
            const question = questions[index];
            const progress = ((index + 1) / questions.length) * 100;

            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Question ${index + 1} of ${questions.length}`;
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.textContent = index === questions.length - 1 ? 'Finish' : 'Next';

            container.innerHTML = `
                <div class="question-text" role="group" aria-labelledby="question-${question.id}">
                    <h3 id="question-${question.id}">${question.text}</h3>
                    <div class="response-options" role="radiogroup">
                        ${question.options.map((option, optionIndex) => `
                            <div class="response-option ${responses[index]?.value === option.value ? 'selected' : ''}" data-value="${option.value}" tabindex="0">
                                <input type="radio" id="q${question.id}_${optionIndex}" name="question_${question.id}" value="${option.value}" ${responses[index]?.value === option.value ? 'checked' : ''}>
                                <label for="q${question.id}_${optionIndex}">${option.text}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            
            container.querySelectorAll('.response-option').forEach(option => {
                const select = () => selectOption(index, parseInt(option.dataset.value));
                option.addEventListener('click', select);
                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        select();
                    }
                });
            });
        };
        
        const selectOption = (questionIndex, value) => {
            responses[questionIndex] = { value };
            showQuestion(questionIndex); // Re-render to show selection
            const nextBtn = document.getElementById('next-question');
            if (nextBtn && document.activeElement.closest('.response-option')) {
                 setTimeout(() => nextBtn.focus(), 100);
            }
        };

        const nextQuestion = () => {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                calculateResults();
            }
        };

        const prevQuestion = () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
            }
        };

        const calculateResults = () => {
            const totalScore = responses.reduce((sum, response) => sum + (response?.value || 0), 0);
            let category, description, recommendations;

            if (totalScore <= 7) {
                category = "Generally Well";
                description = "You seem to be managing well. Keep practicing self-care.";
                recommendations = ["Continue current self-care practices", "Maintain regular sleep/exercise", "Stay connected with supportive people"];
            } else if (totalScore <= 15) {
                category = "Mild Distress";
                description = "You may be experiencing some mild challenges. Self-care strategies might be helpful.";
                recommendations = ["Try deep breathing exercises", "Consider guided meditation", "Reach out to friends or family"];
            } else if (totalScore <= 23) {
                category = "Moderate Distress";
                description = "You might be going through a challenging time. Consider professional support.";
                recommendations = ["Consider speaking with a counselor", "Practice stress-reduction techniques", "Maintain check-ins with your support network"];
            } else {
                category = "High Distress";
                description = "You may be experiencing significant distress. We strongly encourage professional support.";
                recommendations = ["Strongly consider a mental health professional", "Reach out to crisis support if needed", "Connect with trusted support groups"];
            }
            
            showResults();
            document.getElementById('final-score').textContent = totalScore;
            document.getElementById('results-text').innerHTML = `
                <h4>${category}</h4>
                <p>${description}</p>
                <div>
                    <h5>Suggestions:</h5>
                    <ul>${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
                </div>
                <p class="disclaimer"><strong>Important:</strong> This is for self-reflection only and is not a diagnostic tool. If you're in crisis, please contact emergency services.</p>`;
        };

        const retakeAssessment = () => {
            currentQuestion = 0;
            responses = [];
            showAssessmentContent();
            showQuestion(0);
        };
        
        triggers.forEach(trigger => trigger.addEventListener('click', openModal));
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
        document.getElementById('prev-question')?.addEventListener('click', prevQuestion);
        document.getElementById('next-question')?.addEventListener('click', nextQuestion);
        document.getElementById('retake-assessment')?.addEventListener('click', retakeAssessment);

        document.addEventListener('keydown', (e) => {
            if (isOpen && e.key === 'Escape') closeModal();
        });
    }

    // ===== CHAT INTERFACE =====
    initChat() {
        const toggle = document.getElementById('chat-toggle');
        const panel = document.getElementById('chat-panel');
        if (!toggle || !panel) return;

        const closeBtn = panel.querySelector('.chat-close');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        
        let isChatOpen = false;
        let messageHistory = [];
        let typingElement = null;

        const crisisKeywords = ['kill myself', 'end my life', 'suicide', 'suicidal', 'want to die', 'hurt myself', 'self harm', 'overdose', 'can\'t go on', 'no point living', 'better off dead', 'end it all', 'harm myself'];

        const openChat = () => {
            isChatOpen = true;
            panel.setAttribute('aria-hidden', 'false');
            input.focus();
        };

        const closeChat = () => {
            isChatOpen = false;
            panel.setAttribute('aria-hidden', 'true');
            toggle.focus();
        };

        const detectCrisisKeywords = (message) => {
            const lowerMessage = message.toLowerCase();
            return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
        };

        const addMessage = (content, isUser = false) => {
            const timestamp = new Date();
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
            messageElement.innerHTML = `<div class="message-content"><p>${content}</p></div><div class="message-time">${timestamp.toLocaleTimeString()}</div>`;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
            
            messageHistory.push({
                role: isUser ? 'user' : 'model',
                text: content,
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const message = input.value.trim();
            if (!message) return;
            
            addMessage(message, true);
            input.value = '';
            
            if (detectCrisisKeywords(message)) {
                this.showCrisisModal();
                addMessage("I'm concerned by what you've shared. Please know there's immediate help available. You are not alone.", false);
                return;
            }
            
            typingElement = document.createElement('div');
            typingElement.className = 'chat-message bot-message typing';
            typingElement.innerHTML = `<div class="message-content"><p>...</p></div>`;
            messages.appendChild(typingElement);
            messages.scrollTop = messages.scrollHeight;
            
            sendToServer(message);
        };

        const sendToServer = async (message) => {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message,
                        history: messageHistory.slice(0, -1) // Send history *before* the latest user message
                    })
                });
                
                if (typingElement) typingElement.remove();

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.message) {
                        addMessage(data.message, false);
                    } else {
                        addMessage("Sorry, I couldn't get a response. Please try again.", false);
                    }
                } else {
                    addMessage("Sorry, there was an error with the connection.", false);
                }
            } catch (error) {
                console.error('Error sending message to server:', error);
                if (typingElement) typingElement.remove();
                addMessage("Sorry, something went wrong. Please try again.", false);
            }
        };

        toggle.addEventListener('click', () => isChatOpen ? closeChat() : openChat());
        if (closeBtn) closeBtn.addEventListener('click', closeChat);
        if (form) form.addEventListener('submit', handleSubmit);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isChatOpen) closeChat();
        });
    }

    // ===== CRISIS SUPPORT MODAL =====
    showCrisisModal() {
        const modal = document.getElementById('crisis-modal');
        if (!modal) return;
        
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        
        const firstFocusable = modal.querySelector('h2, a, button');
        if (firstFocusable) firstFocusable.focus();
        
        this.trapFocus(modal);
        
        const closeModal = () => {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        };
        
        modal.querySelector('.crisis-close')?.addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
    }

    // ===== ACCESSIBILITY UTILITIES =====
    initAccessibility() {
        if (!document.getElementById('announcements')) {
            this.announcements = document.createElement('div');
            this.announcements.id = 'announcements';
            this.announcements.className = 'sr-only';
            this.announcements.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.announcements);
        } else {
            this.announcements = document.getElementById('announcements');
        }
    }

    announceToScreenReader(message) {
        if (this.announcements) {
            this.announcements.textContent = message;
        }
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        element.addEventListener('keydown', handleTabKey);
    }

    // ===== URL PARAMETERS =====
    initURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('openAssessment') === 'true') {
            setTimeout(() => document.querySelector('.assessment-trigger')?.click(), 500);
        }
        
        if (params.get('openChat') === 'true') {
            setTimeout(() => document.getElementById('chat-toggle')?.click(), 500);
        }
    }

    // ===== UTILITY FUNCTIONS =====
    getSessionId() {
        let sessionId = localStorage.getItem('alliswell_session');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('alliswell_session', sessionId);
        }
        return sessionId;
    }
}

// Initialize the app
const app = new AllIsWellApp();

// Export for potential use by other scripts
window.AllIsWellApp = app;