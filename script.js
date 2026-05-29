/* ============================================================
   DEEP'S PORTFOLIO — Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- HEADER SCROLL EFFECT ----
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    let tickingHeader = false;
    window.addEventListener('scroll', () => {
        if (!tickingHeader) {
            window.requestAnimationFrame(() => {
                handleScroll();
                tickingHeader = false;
            });
            tickingHeader = true;
        }
    }, { passive: true });

    // ---- MOBILE NAV TOGGLE ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    // Tech tabs
    document.querySelectorAll('.tech__tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            document.querySelectorAll('.tech__tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tech__panel').forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.querySelector(`[data-panel="${target}"]`).classList.add('active');
        });
    });

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- ACTIVE NAV LINK HIGHLIGHT ----
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    let tickingNav = false;
    window.addEventListener('scroll', () => {
        if (!tickingNav) {
            window.requestAnimationFrame(() => {
                highlightNav();
                tickingNav = false;
            });
            tickingNav = true;
        }
    }, { passive: true });

    // ---- COUNTER ANIMATION ----
    const statNumbers = document.querySelectorAll('.stat__number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(easedProgress * target);

            el.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    // ---- INTERSECTION OBSERVER FOR ANIMATIONS ----
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat__number[data-target]');
                counters.forEach(counter => animateCounter(counter));
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ---- REVEAL ON SCROLL ----
    const revealElements = document.querySelectorAll(
        '.section__header, .about__text, .education__item, .experience__item, ' +
        '.project__card, .tech__category, .contact__wrapper, .stat__item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // ---- TILT EFFECT ON PROJECT CARDS ----
    const projectCards = document.querySelectorAll('.project__card-inner');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });

    // ---- MAGNETIC EFFECT ON BUTTONS ----
    const magneticBtns = document.querySelectorAll('.btn, .social__link');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ---- PARTICLE-LIKE CURSOR TRAIL (subtle) ----
    const createCursorTrail = () => {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        heroSection.addEventListener('mousemove', (e) => {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 4px;
                height: 4px;
                background: var(--accent-blue);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
                opacity: 0.6;
                transition: all 0.6s ease-out;
            `;
            document.body.appendChild(dot);

            requestAnimationFrame(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'scale(3)';
            });

            setTimeout(() => dot.remove(), 600);
        });
    };

    // Only enable cursor trail on desktop
    if (window.innerWidth > 768) {
        createCursorTrail();
    }

    // ---- TECH ITEMS STAGGER ANIMATION ----
    const techItems = document.querySelectorAll('.tech__item');
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.tech__item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 60);
                });
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.tech__category').forEach(cat => {
        cat.querySelectorAll('.tech__item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        techObserver.observe(cat);
    });

    // ---- PARALLAX ON HERO GLOWS ----
    const heroGlows = document.querySelectorAll('.hero__glow');

    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            heroGlows.forEach((glow, i) => {
                const factor = (i + 1) * 15;
                glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        }, { passive: true });
    }

    // ---- CLIENT MARQUEE PAUSE ON HOVER ----
    const marqueeTrack = document.querySelector('.clients__track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }

    // ---- TYPING EFFECT ON HERO (Optional enhancement) ----
    const heroSubtitle = document.querySelector('.hero__subtitle');
    if (heroSubtitle) {
        // Already set statically — future enhancement could add dynamic typing
    }

    console.log('%c 🚀 Deep\'s Portfolio loaded successfully!', 'color: #5B9DFF; font-size: 14px; font-weight: bold;');
});
