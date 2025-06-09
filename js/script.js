document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("active")
      }
    })
  }

  // Lightbox functionality
  const lightbox = document.querySelector(".lightbox")
  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxCaption = document.querySelector(".lightbox-caption")
  const closeLightbox = document.querySelector(".close-lightbox")

  if (lightbox && lightboxImg && lightboxCaption && closeLightbox) {
    // Close lightbox
    closeLightbox.addEventListener("click", () => {
      lightbox.style.display = "none"
      document.body.style.overflow = "auto"
    })

    // Close lightbox when clicking outside the image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })

    // Close lightbox with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.style.display === "block") {
        lightbox.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Simple form validation
      if (name && email && subject && message) {
        // In a real application, you would send this data to a server
        alert("Thank you for your message! We will get back to you soon.")
        contactForm.reset()
      } else {
        alert("Please fill in all fields.")
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Add global function to handle image deletion
  window.deleteImageFromGallery = (imageId, element) => {
    if (confirm("Are you sure you want to delete this image?")) {
      // Remove from localStorage
      let uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []
      uploadedImages = uploadedImages.filter((img) => img.id != imageId)
      localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages))

      // Remove from DOM
      if (element && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }
})
