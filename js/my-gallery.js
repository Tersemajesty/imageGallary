document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.querySelector(".gallery")
  const categoryFilter = document.getElementById("categoryFilter")

  // Load images from localStorage
  function loadImages() {
    const uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []

    if (uploadedImages.length === 0) {
      galleryContainer.innerHTML =
        "<p class='no-uploads'>No images found. <a href='upload.html'>Upload some images</a> to see them here.</p>"
      return
    }

    // Sort by date (newest first)
    uploadedImages.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Get current category from URL if any
    const currentPage = window.location.pathname.split("/").pop().split(".")[0]
    const selectedCategory = currentPage === "index" ? "all" : currentPage

    // Filter images by category if needed
    const filteredImages =
      selectedCategory === "all" ? uploadedImages : uploadedImages.filter((img) => img.category === selectedCategory)

    if (filteredImages.length === 0) {
      galleryContainer.innerHTML = `<p class='no-uploads'>No ${selectedCategory} images found. <a href='upload.html'>Upload some images</a> to see them here.</p>`
      return
    }

    // Clear gallery
    galleryContainer.innerHTML = ""

    // Add each image to gallery
    filteredImages.forEach((imageData) => {
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

      galleryContainer.appendChild(galleryItem)

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

  // Initialize
  loadImages()
})
