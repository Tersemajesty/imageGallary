document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab")
  const sampleGallery = document.getElementById("sampleGallery")
  const uploadedGallery = document.getElementById("uploadedGallery")
  const userGallery = document.getElementById("userGallery")

  // Tab switching functionality
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      tab.classList.add("active")

      // Show/hide appropriate gallery
      const tabType = tab.getAttribute("data-tab")
      if (tabType === "sample") {
        sampleGallery.style.display = "block"
        uploadedGallery.style.display = "none"
      } else {
        sampleGallery.style.display = "none"
        uploadedGallery.style.display = "block"
        loadUserImages()
      }
    })
  })

  // Load user uploaded images
  function loadUserImages() {
    const uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []

    if (uploadedImages.length === 0) {
      userGallery.innerHTML = `
        <div class="no-uploads">
          <p>You haven't uploaded any images yet.</p>
          <a href="upload.html" class="upload-btn">Upload Images</a>
        </div>
      `
      return
    }

    // Sort by date (newest first)
    uploadedImages.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Clear gallery
    userGallery.innerHTML = ""

    // Add each image to gallery
    uploadedImages.forEach((imageData) => {
      const galleryItem = document.createElement("div")
      galleryItem.className = "gallery-item"
      galleryItem.setAttribute("data-id", imageData.id)
      galleryItem.setAttribute("data-category", imageData.category)

      galleryItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.title}">
        <div class="overlay">
          <h3>${imageData.title}</h3>
          <p>${imageData.description}</p>
        </div>
      `

      userGallery.appendChild(galleryItem)

      // Add lightbox functionality
      galleryItem.addEventListener("click", () => {
        const lightbox = document.querySelector(".lightbox")
        const lightboxImg = document.getElementById("lightbox-img")
        const lightboxCaption = document.querySelector(".lightbox-caption")

        if (lightbox && lightboxImg && lightboxCaption) {
          lightboxImg.src = imageData.src
          lightboxCaption.textContent = `${imageData.title} - ${imageData.description}`
          lightbox.style.display = "block"
          document.body.style.overflow = "hidden"
        }
      })
    })
  }

  // Check if there's a URL parameter to show uploaded tab
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("tab") === "uploaded") {
    // Trigger click on uploaded tab
    document.querySelector('.tab[data-tab="uploaded"]').click()
  }
})
