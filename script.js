document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality 
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('open'); 
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open'); 
            document.body.style.overflow = 'auto'; 
        });
    }
    
    // ------------------------------------------------------------------
    // --- MAIN HERO CAROUSEL LOGIC (FIXED: Consistent 4-second timing) ---
    // ------------------------------------------------------------------
    const carSlides = [
        {
            name: 'Model S',
            tagline: 'Plaid',
            link: 'model-s.html',
            image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Homepage-Model-S-Desktop-LHD.jpg'
        },
        {
            name: 'Model 3',
            tagline: 'Lease starting at $329/mo',
            link: 'model-3.html',
            image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Model-3-Desktop-NA.jpg'
        },
        {
            name: 'Model X',
            tagline: 'Plaid',
            link: 'model-x.html',
            image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Model-X-Desktop-LHD.jpg'
        },
        {
            name: 'Model Y',
            tagline: 'All-Wheel Drive',
            link: 'model-y.html',
            image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Hero-Carousel-Slide-1-Desktop.png'
        }
    ];

    let currentSlide = 0;
    const heroSection = document.querySelector('.hero-section#car-carousel'); 
    let timerId; 

    // Standard delay speed (4 seconds)
    const CAROUSEL_DELAY_MS = 4000;

    function updateHeroSection(index) {
        const slide = carSlides[index];
        const heroContent = heroSection.querySelector('.hero-content');
        const heroButtons = heroSection.querySelector('.hero-buttons');
        
        heroContent.innerHTML = `
            <h1>${slide.name}</h1>
            <p>${slide.tagline}</p>
        `;

        heroButtons.innerHTML = `
            <a href="${slide.link}" class="hero-btn btn-dark">Order Now</a>
            <a href="test-drive.html" class="hero-btn btn-light">Demo Drive</a>
        `;

        // Update background image
        heroSection.style.backgroundImage = `url('${slide.image}')`; 
        heroSection.classList.remove('text-light');
        heroSection.classList.add('text-dark');
    }

    // Simple and reliable carousel function
    function startCarousel() {
        // Clear any existing timer first
        clearTimeout(timerId);
        
        // Set timer for next slide
        timerId = setTimeout(() => {
            // Move to next slide (automatically loops back to 0 after last slide)
            currentSlide = (currentSlide + 1) % carSlides.length;
            
            // Update the display
            updateHeroSection(currentSlide);
            
            // Immediately start timer for next slide
            startCarousel();
        }, CAROUSEL_DELAY_MS);
    }

    function stopCarousel() {
        clearTimeout(timerId);
    }
    
    if (heroSection) {
        // Start with first slide immediately
        updateHeroSection(0);
        
        // Start the carousel with consistent timing
        startCarousel();

        // Pause on hover for better UX
        heroSection.addEventListener('mouseenter', stopCarousel);
        
        heroSection.addEventListener('mouseleave', () => {
            // Restart immediately when mouse leaves
            startCarousel();
        });
    }

    // ------------------------------------------------------------------
    // --- Two-Column Carousel Auto-Scroll Logic ---
    // ------------------------------------------------------------------
    const twoColumnCarouselContainer = document.querySelector('.two-column-carousel-section .carousel-container');
    const prevArrow = document.querySelector('.two-column-carousel-section .prev-arrow');
    const nextArrow = document.querySelector('.two-column-carousel-section .next-arrow');

    let autoScrollTimer;
    const AUTO_SCROLL_DELAY = 5000; // 5 seconds between auto-scrolls

    function startAutoScroll() {
        clearTimeout(autoScrollTimer);
        
        autoScrollTimer = setTimeout(() => {
            if (twoColumnCarouselContainer) {
                const containerWidth = twoColumnCarouselContainer.clientWidth;
                const cardElement = twoColumnCarouselContainer.querySelector('.carousel-card');
                const cardWidth = cardElement ? cardElement.offsetWidth + 20 : containerWidth;
                
                // Scroll amount (2 cards on desktop, 1 on mobile)
                const scrollAmount = containerWidth < 768 ? cardWidth : containerWidth;
                
                // Auto-scroll to next position
                twoColumnCarouselContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
                
                // Check if we've reached the end
                const maxScroll = twoColumnCarouselContainer.scrollWidth - twoColumnCarouselContainer.clientWidth;
                const currentScroll = twoColumnCarouselContainer.scrollLeft;
                
                // If at or near the end, scroll back to start
                if (currentScroll >= maxScroll - 10) {
                    setTimeout(() => {
                        twoColumnCarouselContainer.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    }, 1000);
                }
            }
            
            // Continue auto-scrolling
            startAutoScroll();
        }, AUTO_SCROLL_DELAY);
    }

    function stopAutoScroll() {
        clearTimeout(autoScrollTimer);
    }

    // Manual scroll functions for arrows (faster navigation)
    function scrollCarousel(direction) {
        // Stop auto-scroll temporarily when user interacts
        stopAutoScroll();
        
        const containerWidth = twoColumnCarouselContainer.clientWidth;
        const cardElement = twoColumnCarouselContainer.querySelector('.carousel-card');
        const cardWidth = cardElement ? cardElement.offsetWidth + 20 : containerWidth;
        
        // Scroll amount (2 cards on desktop, 1 on mobile)
        const scrollAmount = containerWidth < 768 ? cardWidth : containerWidth;
        
        if (direction === 'prev') {
            twoColumnCarouselContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (direction === 'next') {
            twoColumnCarouselContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Restart auto-scroll after manual interaction
        setTimeout(startAutoScroll, AUTO_SCROLL_DELAY);
    }

    // Initialize two-column carousel
    if (twoColumnCarouselContainer && prevArrow && nextArrow) {
        // Start auto-scrolling
        startAutoScroll();
        
        // Add manual controls
        prevArrow.addEventListener('click', () => scrollCarousel('prev'));
        nextArrow.addEventListener('click', () => scrollCarousel('next'));
        
        // Pause auto-scroll on hover
        twoColumnCarouselContainer.addEventListener('mouseenter', stopAutoScroll);
        twoColumnCarouselContainer.addEventListener('mouseleave', startAutoScroll);
        
        // Also pause when user is manually scrolling
        twoColumnCarouselContainer.addEventListener('scroll', () => {
            stopAutoScroll();
            // Restart after user stops scrolling
            clearTimeout(twoColumnCarouselContainer.scrollTimer);
            twoColumnCarouselContainer.scrollTimer = setTimeout(startAutoScroll, 1000);
        });
    }

    // ------------------------------------------------------------------
    // --- NAVBAR DROPDOWN DELAY LOGIC (0.5-second delay) ---
    // ------------------------------------------------------------------
    const dropdownItem = document.querySelector('.dropdown-item');
    const delay = 500; 
    let dropdownTimer;

    if (dropdownItem) {
        dropdownItem.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimer); 
            dropdownTimer = setTimeout(() => {
                dropdownItem.classList.add('dropdown-open');
            }, delay);
        });

        dropdownItem.addEventListener('mouseleave', () => {
            clearTimeout(dropdownTimer);
            dropdownItem.classList.remove('dropdown-open');
        });
    }

    // Smooth scrolling for all links 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });

    // Section visibility tracking 
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
});
// ------------------------------------------------------------------
// --- Energy Products Carousel Logic ---
// ------------------------------------------------------------------
const energyCarouselContainer = document.querySelector('.energy-carousel-container');
const prevEnergyArrow = document.querySelector('.prev-energy-arrow');
const nextEnergyArrow = document.querySelector('.next-energy-arrow');
const energyIndicators = document.querySelectorAll('.energy-indicator');

let currentEnergySlide = 0;
let energyAutoScrollTimer;
const ENERGY_SCROLL_DELAY = 5000; // 5 seconds

function scrollToEnergySlide(slideIndex) {
    if (!energyCarouselContainer) return;
    
    const containerWidth = energyCarouselContainer.clientWidth;
    const cardElement = energyCarouselContainer.querySelector('.energy-card');
    const cardWidth = cardElement ? cardElement.offsetWidth + 20 : containerWidth;
    
    // Scroll amount (2 cards on desktop, 1 on mobile)
    const scrollAmount = containerWidth < 768 ? cardWidth : containerWidth;
    
    energyCarouselContainer.scrollTo({
        left: slideIndex * scrollAmount,
        behavior: 'smooth'
    });
    
    // Update active states
    updateEnergyActiveStates(slideIndex);
}

function updateEnergyActiveStates(slideIndex) {
    // Update indicators
    energyIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
    
    // Update current slide
    currentEnergySlide = slideIndex;
}

function startEnergyAutoScroll() {
    clearTimeout(energyAutoScrollTimer);
    
    energyAutoScrollTimer = setTimeout(() => {
        const totalSlides = 4; // Solar Panels, Powerwall, Megapack, Solar Roof
        const nextSlide = (currentEnergySlide + 1) % totalSlides;
        scrollToEnergySlide(nextSlide);
        startEnergyAutoScroll();
    }, ENERGY_SCROLL_DELAY);
}

function stopEnergyAutoScroll() {
    clearTimeout(energyAutoScrollTimer);
}

// Initialize energy carousel
if (energyCarouselContainer && prevEnergyArrow && nextEnergyArrow) {
    // Start auto-scrolling
    startEnergyAutoScroll();
    
    // Manual controls
    prevEnergyArrow.addEventListener('click', () => {
        const totalSlides = 4;
        const prevSlide = (currentEnergySlide - 1 + totalSlides) % totalSlides;
        scrollToEnergySlide(prevSlide);
        stopEnergyAutoScroll();
        setTimeout(startEnergyAutoScroll, ENERGY_SCROLL_DELAY);
    });
    
    nextEnergyArrow.addEventListener('click', () => {
        const totalSlides = 4;
        const nextSlide = (currentEnergySlide + 1) % totalSlides;
        scrollToEnergySlide(nextSlide);
        stopEnergyAutoScroll();
        setTimeout(startEnergyAutoScroll, ENERGY_SCROLL_DELAY);
    });
    
    // Indicator clicks
    energyIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            scrollToEnergySlide(index);
            stopEnergyAutoScroll();
            setTimeout(startEnergyAutoScroll, ENERGY_SCROLL_DELAY);
        });
    });
    
    // Pause on hover
    energyCarouselContainer.addEventListener('mouseenter', stopEnergyAutoScroll);
    energyCarouselContainer.addEventListener('mouseleave', startEnergyAutoScroll);
    
    // Also pause when user is manually scrolling
    energyCarouselContainer.addEventListener('scroll', () => {
        stopEnergyAutoScroll();
        clearTimeout(energyCarouselContainer.scrollTimer);
        energyCarouselContainer.scrollTimer = setTimeout(startEnergyAutoScroll, 1000);
    });
}