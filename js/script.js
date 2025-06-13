// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeLoading()
  initializeNavigation()
  initializeCarousel()
  initializeAnimations()
  initializeScrollAnimations() // New scroll animations
  initializeGalleryFilter()
  initializeBackToTop()
  initializeCounters()
  initializeScrollEffects()
  initializeAccessibility()
})

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  // Ensure loading screen is visible initially
  loadingScreen.style.display = "flex"

  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1000)
  })

  // Fallback: Hide loading screen after 3 seconds regardless
  setTimeout(() => {
    if (loadingScreen.style.display !== "none") {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }
  }, 3000)
}

// Navigation
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const header = document.querySelector(".header")

  if (!hamburger || !navMenu) return

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Header scroll effect
  let lastScrollY = window.scrollY

  window.addEventListener(
    "scroll",
    throttle(() => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 100) {
        header.style.backgroundColor = "rgba(255, 255, 255, 0.98)"
        header.style.backdropFilter = "blur(15px)"
        header.style.boxShadow = "0 2px 20px rgba(93, 64, 55, 0.15)"
      } else {
        header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
        header.style.backdropFilter = "blur(10px)"
        header.style.boxShadow = "0 2px 20px rgba(93, 64, 55, 0.1)"
      }

      lastScrollY = currentScrollY
    }, 100),
  )

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")
      if (targetId === "#" || !targetId.startsWith("#")) return

      e.preventDefault()
      const target = document.querySelector(targetId)

      if (target) {
        const headerHeight = header.offsetHeight
        const targetPosition = target.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Carousel
function initializeCarousel() {
  const slides = document.querySelectorAll(".carousel-slide")
  const indicators = document.querySelectorAll(".indicator")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (!slides.length) return

  let currentSlide = 0
  let isTransitioning = false
  let autoPlayInterval
  let isPaused = false

  function showSlide(index) {
    if (isTransitioning) return
    isTransitioning = true

    // Remove active class from all slides and indicators
    slides.forEach((slide) => slide.classList.remove("active", "prev"))
    indicators.forEach((indicator) => indicator.classList.remove("active"))

    // Add prev class to current slide
    if (slides[currentSlide]) {
      slides[currentSlide].classList.add("prev")
    }

    // Update current slide
    currentSlide = index

    // Add active class to new slide and indicator
    slides[currentSlide].classList.add("active")
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add("active")
    }

    // Reset transition flag
    setTimeout(() => {
      isTransitioning = false
      slides.forEach((slide) => slide.classList.remove("prev"))
    }, 600)
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length
    showSlide(next)
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length
    showSlide(prev)
  }

  function startAutoPlay() {
    if (isPaused) return
    autoPlayInterval = setInterval(nextSlide, 5000)
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval)
  }

  function pauseAutoPlay() {
    isPaused = true
    stopAutoPlay()
  }

  function resumeAutoPlay() {
    isPaused = false
    startAutoPlay()
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide()
      pauseAutoPlay()
      setTimeout(resumeAutoPlay, 10000)
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide()
      pauseAutoPlay()
      setTimeout(resumeAutoPlay, 10000)
    })
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      showSlide(index)
      pauseAutoPlay()
      setTimeout(resumeAutoPlay, 10000)
    })
  })

  // Pause auto-play on hover
  const carouselContainer = document.querySelector(".hero-carousel")
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoPlay)
    carouselContainer.addEventListener("mouseleave", () => {
      if (!isPaused) startAutoPlay()
    })
  }

  // Touch/swipe support for mobile
  let startX = 0
  let endX = 0
  let startY = 0
  let endY = 0

  if (carouselContainer) {
    carouselContainer.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      },
      { passive: true },
    )

    carouselContainer.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX
        endY = e.changedTouches[0].clientY
        handleSwipe()
      },
      { passive: true },
    )
  }

  function handleSwipe() {
    const swipeThreshold = 50
    const diffX = startX - endX
    const diffY = startY - endY

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
      pauseAutoPlay()
      setTimeout(resumeAutoPlay, 10000)
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide()
      pauseAutoPlay()
      setTimeout(resumeAutoPlay, 10000)
    } else if (e.key === "ArrowRight") {
      nextSlide()
      pauseAutoPlay()
      setTimeout(resumeAutoPlay, 10000)
    }
  })

  // Initialize first slide
  showSlide(0)

  // Start auto-play
  startAutoPlay()

  // Pause when page is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoPlay()
    } else if (!isPaused) {
      startAutoPlay()
    }
  })
}

// Animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")
      }
    })
  }, observerOptions)

  // Observe all elements with data-aos attribute
  document.querySelectorAll("[data-aos]").forEach((el) => {
    observer.observe(el)
  })
}

// New Scroll Animations
function initializeScrollAnimations() {
  const animateLeftElements = document.querySelectorAll(".animate-from-left")
  const animateRightElements = document.querySelectorAll(".animate-from-right")

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  }

  // Create a sequential animation with delay
  function createSequentialObserver(elements, direction) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add delay based on index for sequential animation
          setTimeout(() => {
            entry.target.classList.add("animated")
          }, index * 150) // 150ms delay between each element

          // Unobserve after animation
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    elements.forEach((el) => {
      observer.observe(el)
    })
  }

  // Initialize observers for left and right animations
  createSequentialObserver(animateLeftElements, "left")
  createSequentialObserver(animateRightElements, "right")
}

// Gallery Filter
function initializeGalleryFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  if (!filterBtns.length || !galleryItems.length) return

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Filter gallery items with animation
      galleryItems.forEach((item, index) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.classList.remove("hidden")
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, index * 50)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.classList.add("hidden")
          }, 300)
        }
      })
    })
  })
}

// Back to Top Button
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("backToTop")
  if (!backToTopBtn) return

  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible")
      } else {
        backToTopBtn.classList.remove("visible")
      }
    }, 100),
  )

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")
  if (!counters.length) return

  let hasAnimated = false

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          counters.forEach((counter) => {
            animateCounter(counter)
          })
        }
      })
    },
    { threshold: 0.5 },
  )

  const aboutStats = document.querySelector(".about-stats")
  if (aboutStats) {
    observer.observe(aboutStats)
  }

  function animateCounter(counter) {
    const target = Number.parseInt(counter.getAttribute("data-count"))
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      counter.textContent = Math.floor(current)
    }, 16)
  }
}

// Scroll Effects
function initializeScrollEffects() {
  let ticking = false

  function updateScrollEffects() {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".slide-image img")

    parallaxElements.forEach((element) => {
      const speed = 0.3
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })

    ticking = false
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects)
      ticking = true
    }
  }

  window.addEventListener("scroll", requestTick)
}

// Accessibility
function initializeAccessibility() {
  // Focus management for mobile menu
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        // Focus first menu item when menu opens
        const firstMenuItem = navMenu.querySelector(".nav-link")
        if (firstMenuItem) {
          setTimeout(() => firstMenuItem.focus(), 100)
        }
      }
    })
  }

  // Escape key closes mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (navMenu && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.style.overflow = ""
        hamburger.focus()
      }
    }
  })

  // Skip to main content link
  const skipLink = document.createElement("a")
  skipLink.href = "#neden-ozece"
  skipLink.textContent = "Ana içeriğe geç"
  skipLink.className = "skip-link"
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #4CAF50;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `

  skipLink.addEventListener("focus", function () {
    this.style.top = "6px"
  })

  skipLink.addEventListener("blur", function () {
    this.style.top = "-40px"
  })

  document.body.insertBefore(skipLink, document.body.firstChild)
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.setAttribute("role", "alert")
  notification.setAttribute("aria-live", "polite")

  const iconMap = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
  }

  const colorMap = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3",
  }

  notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconMap[type]}" style="margin-right: 10px;"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Bildirimi kapat">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${colorMap[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
        display: flex;
        align-items: center;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        line-height: 1;
    `

  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance optimizations
const debouncedResize = debounce(() => {
  // Handle resize events
  const carousel = document.querySelector(".hero-carousel")
  if (carousel) {
    // Recalculate carousel dimensions if needed
    const slides = carousel.querySelectorAll(".carousel-slide")
    slides.forEach((slide) => {
      slide.style.height = window.innerHeight - 80 + "px"
    })
  }

  // Reinitialize animations on resize
  initializeScrollAnimations()
}, 250)

window.addEventListener("resize", debouncedResize)

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // You could send error reports to a logging service here
})

// Preload critical images
function preloadImages() {
  const criticalImages = ["assets/ozece-logo.jpg"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

preloadImages()

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
  // Placeholder for analytics tracking
  console.log("Event tracked:", eventName, eventData)

  // Example: Google Analytics 4
  // if (typeof gtag !== 'undefined') {
  //     gtag('event', eventName, eventData);
  // }
}

// Track important user interactions
document.addEventListener("click", (e) => {
  const target = e.target.closest("a, button")
  if (target) {
    const text = target.textContent.trim()
    const href = target.getAttribute("href")

    if (href && href.startsWith("#")) {
      trackEvent("navigation_click", {
        section: href.substring(1),
        text: text,
      })
    } else if (target.classList.contains("contact-btn") || (href && href.includes("wa.me"))) {
      trackEvent("contact_button_click", {
        text: text,
        type: href && href.includes("wa.me") ? "whatsapp" : "contact",
      })
    } else if (target.classList.contains("filter-btn")) {
      trackEvent("gallery_filter_click", {
        filter: target.getAttribute("data-filter"),
        text: text,
      })
    }
  }
})

// Intersection Observer polyfill fallback
if (!window.IntersectionObserver) {
  // Fallback for older browsers
  const elements = document.querySelectorAll("[data-aos], .animate-from-left, .animate-from-right")
  elements.forEach((el) => {
    el.classList.add("aos-animate")
    el.classList.add("animated")
  })
}

// Initialize lazy loading for images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src
      img.classList.remove("lazy")
    })
  }
}

// Initialize on load
initializeLazyLoading()
