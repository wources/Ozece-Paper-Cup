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
  initializeMobileOptimizations()
})

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  // Ensure loading screen is visible initially
  loadingScreen.style.display = "flex"

  // Hide loading screen when all content is loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 800) // Reduced time for better UX
  })

  // Fallback: Hide loading screen after 2.5 seconds regardless
  setTimeout(() => {
    if (loadingScreen.style.display !== "none") {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }
  }, 2500) // Reduced time for better UX
}

// Navigation
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const header = document.querySelector(".header")

  if (!hamburger || !navMenu) return

  // Make hamburger keyboard accessible
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      hamburger.click()
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Update ARIA attributes
    const expanded = hamburger.classList.contains("active")
    hamburger.setAttribute("aria-expanded", expanded)

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
      hamburger.setAttribute("aria-expanded", "false")
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
      hamburger.setAttribute("aria-expanded", "false")
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
  let touchStartX = 0
  let touchEndX = 0

  // Fix for first slide visibility - ensure it's visible immediately
  slides[0].style.opacity = "1"
  slides[0].style.transform = "translateX(0)"

  // Set ARIA attributes for accessibility
  slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", index !== 0 ? "true" : "false")
    slide.setAttribute("role", "tabpanel")
    slide.id = `slide-${index}`
  })

  indicators.forEach((indicator, index) => {
    indicator.setAttribute("aria-label", `Slide ${index + 1}`)
    indicator.setAttribute("aria-controls", `slide-${index}`)
    indicator.setAttribute("aria-selected", index === 0 ? "true" : "false")
  })

  function showSlide(index) {
    if (isTransitioning) return
    isTransitioning = true

    // Remove active class from all slides and indicators
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev")
      slide.setAttribute("aria-hidden", "true")
    })

    indicators.forEach((indicator, i) => {
      indicator.classList.remove("active")
      indicator.setAttribute("aria-selected", "false")
    })

    // Add prev class to current slide
    if (slides[currentSlide]) {
      slides[currentSlide].classList.add("prev")
    }

    // Update current slide
    currentSlide = index

    // Add active class to new slide and indicator
    slides[currentSlide].classList.add("active")
    slides[currentSlide].setAttribute("aria-hidden", "false")

    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add("active")
      indicators[currentSlide].setAttribute("aria-selected", "true")
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
    stopAutoPlay() // Clear any existing interval first
    autoPlayInterval = setInterval(nextSlide, 5000)
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
    }
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

    // Keyboard accessibility
    indicator.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        indicator.click()
      }
    })
  })

  // Touch/swipe support for mobile
  const carouselContainer = document.querySelector(".hero-carousel")

  if (carouselContainer) {
    // Improved touch handling
    carouselContainer.addEventListener("touchstart", handleTouchStart, { passive: true })
    carouselContainer.addEventListener("touchend", handleTouchEnd, { passive: true })
    carouselContainer.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    // Mouse events for desktop testing of swipe
    carouselContainer.addEventListener("mousedown", (e) => {
      touchStartX = e.clientX
    })

    carouselContainer.addEventListener("mouseup", (e) => {
      touchEndX = e.clientX
      handleSwipe()
    })

    // Pause auto-play on hover
    carouselContainer.addEventListener("mouseenter", stopAutoPlay)
    carouselContainer.addEventListener("mouseleave", () => {
      if (!isPaused) startAutoPlay()
    })
  }

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches ? e.changedTouches[0].clientX : 0
    handleSwipe()
  }

  function handleSwipe() {
    const swipeThreshold = 50
    const diffX = touchStartX - touchEndX

    if (Math.abs(diffX) > swipeThreshold) {
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
    // Only handle keyboard events when carousel is in viewport
    const rect = carouselContainer.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (!isInViewport) return

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
  const footerFilterLinks = document.querySelectorAll(".footer-links a[data-filter]")

  if (!filterBtns.length || !galleryItems.length) return

  function filterGallery(filter) {
    // Update active button
    filterBtns.forEach((b) => {
      b.classList.remove("active")
      if (b.getAttribute("data-filter") === filter) {
        b.classList.add("active")
      }
    })

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
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")
      filterGallery(filter)
    })
  })

  // Handle footer filter links
  footerFilterLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const filter = this.getAttribute("data-filter")
      if (filter) {
        e.preventDefault()

        // Scroll to gallery section
        const gallerySection = document.getElementById("galeri")
        if (gallerySection) {
          const headerHeight = document.querySelector(".header").offsetHeight
          const galleryPosition = gallerySection.offsetTop - headerHeight - 20

          window.scrollTo({
            top: galleryPosition,
            behavior: "smooth",
          })

          // Apply filter after scrolling
          setTimeout(() => {
            filterGallery(filter)
          }, 800)
        }
      }
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
    // Set initial ARIA attributes
    hamburger.setAttribute("aria-expanded", "false")
    hamburger.setAttribute("aria-controls", "nav-menu")
    navMenu.id = "nav-menu"

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
        hamburger.setAttribute("aria-expanded", "false")
        hamburger.focus()
      }
    }
  })

  // Skip to main content link
  const skipLink = document.createElement("a")
  skipLink.href = "#neden-ozece"
  skipLink.textContent = "Ana içeriğe geç"
  skipLink.className = "skip-link"

  document.body.insertBefore(skipLink, document.body.firstChild)
}

// Mobile Optimizations
function initializeMobileOptimizations() {
  // Fix for iOS 100vh issue
  function setMobileHeight() {
    // First we get the viewport height and multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`)

    // Apply the height to carousel and other full-height elements
    const carousel = document.querySelector(".hero-carousel")
    if (carousel) {
      carousel.style.height = `calc(var(--vh, 1vh) * 100 - 70px)`
    }
  }

  // Set it initially
  setMobileHeight()

  // Reset on resize and orientation change
  window.addEventListener("resize", debounce(setMobileHeight, 250))
  window.addEventListener("orientationchange", () => {
    setTimeout(setMobileHeight, 100)
  })

  // Improve touch targets for mobile
  const smallButtons = document.querySelectorAll(".indicator, .social-link")
  smallButtons.forEach((btn) => {
    btn.addEventListener(
      "touchstart",
      function (e) {
        // Slightly enlarge touch target on touch
        this.style.transform = "scale(1.2)"
      },
      { passive: true },
    )

    btn.addEventListener(
      "touchend",
      function () {
        // Reset after touch
        setTimeout(() => {
          this.style.transform = ""
        }, 300)
      },
      { passive: true },
    )
  })

  // Fix for iOS input zoom
  const metaViewport = document.querySelector("meta[name=viewport]")
  if (metaViewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
  }

  // Optimize images for mobile
  const images = document.querySelectorAll("img")
  if ("connection" in navigator) {
    if (
      navigator.connection.saveData ||
      (navigator.connection.effectiveType && navigator.connection.effectiveType.includes("2g"))
    ) {
      // If in save data mode or on slow connection, load lower quality images
      images.forEach((img) => {
        if (img.src && !img.dataset.src) {
          // Add a low-quality parameter to image URLs
          // This is just an example - you would need a real implementation
          // img.src = img.src.replace(/\.(jpg|png)/, '-low.$1');
        }
      })
    }
  }
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
      // Use viewport units instead of fixed height
      if (window.innerWidth <= 768) {
        // Mobile view - full height minus header
        slide.style.height = "calc(100vh - 70px)"
      } else {
        // Desktop view - fixed height or percentage
        slide.style.height = ""
      }
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
    // Add crossOrigin for CORS issues
    img.crossOrigin = "anonymous"
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
