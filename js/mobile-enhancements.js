// Mobile Experience Enhancements for Ozece Packaging

document.addEventListener("DOMContentLoaded", () => {
  enhanceMobileUX()
  optimizeMobileTouches()
  improveFormInteractions()
})

function enhanceMobileUX() {
  // Prevent zoom on input focus for iOS
  const inputs = document.querySelectorAll("input, textarea, select")
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      const viewport = document.querySelector("meta[name=viewport]")
      if (viewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover",
        )
      }
    })

    input.addEventListener("blur", () => {
      const viewport = document.querySelector("meta[name=viewport]")
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        )
      }
    })
  })

  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    const originalOverflow = document.body.style.overflow

    hamburger.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden"
        // Prevent scrolling on iOS
        document.body.style.position = "fixed"
        document.body.style.width = "100%"
      } else {
        document.body.style.overflow = originalOverflow
        document.body.style.position = ""
        document.body.style.width = ""
      }
    })
  }

  const buttons = document.querySelectorAll("button, a.btn, a.contact-btn, a.whatsapp-btn")
  buttons.forEach((button) => {
    button.addEventListener("touchstart", function () {
      this.style.opacity = "0.8"
    })

    button.addEventListener("touchend", function () {
      this.style.opacity = "1"
    })
  })
}

function optimizeMobileTouches() {
  // Enable better scroll performance
  const scrollableElements = document.querySelectorAll(".gallery-filter, .nav-menu")
  scrollableElements.forEach((element) => {
    element.style.WebkitOverflowScrolling = "touch"
  })

  let lastY = 0

  document.addEventListener(
    "touchmove",
    (e) => {
      lastY = e.touches[0].clientY
    },
    { passive: true },
  )

  const carousel = document.querySelector(".hero-carousel")
  if (carousel) {
    let touchStartX = 0
    let touchStartY = 0

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      },
      { passive: true },
    )

    carousel.addEventListener(
      "touchmove",
      (e) => {
        // Prevent vertical scroll if swiping horizontally
        const touchEndX = e.touches[0].clientX
        const diffX = Math.abs(touchStartX - touchEndX)
        const diffY = Math.abs(touchStartY - e.touches[0].clientY)

        if (diffX > diffY && diffX > 10) {
          e.preventDefault()
        }
      },
      { passive: false },
    )
  }
}

function improveFormInteractions() {
  // Adjust form field heights for better mobile interaction
  const formInputs = document.querySelectorAll("input, textarea")
  formInputs.forEach((input) => {
    input.style.minHeight = "44px"
    input.style.fontSize = "16px" // Prevents zoom on iOS
  })

  const filterBtns = document.querySelectorAll(".filter-btn")
  filterBtns.forEach((btn) => {
    btn.addEventListener("touchstart", function () {
      this.style.transform = "scale(1.05)"
    })

    btn.addEventListener("touchend", function () {
      this.style.transform = ""
    })
  })
}

function initializeViewportHeight() {
  const setVh = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  setVh()
  window.addEventListener("resize", debounce(setVh, 100))
  window.addEventListener("orientationchange", () => {
    setTimeout(setVh, 200)
  })
}

// Debounce utility function
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

// Initialize on DOM ready
if (document.readyState !== "loading") {
  initializeViewportHeight()
} else {
  document.addEventListener("DOMContentLoaded", initializeViewportHeight)
}
