document.addEventListener("DOMContentLoaded", () => {
  // Get current page to determine which category to load
  const currentPage = window.location.pathname.split("/").pop().split(".")[0]
  const urlParams = new URLSearchParams(window.location.search)
  const categoryParam = urlParams.get("category")

  // Load uploaded images for the current page
  loadUploadedImages(currentPage, categoryParam)

  function loadUploadedImages(pageType, categoryFilter = null) {
    // Get the most recent uploaded images from localStorage
    const uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []

    if (uploadedImages.length === 0) {
      return // No uploaded images to display
    }

    // Determine which gallery container to use and which category to filter by
    let galleryContainer
    let categoryToShow

    if (pageType === "index") {
      galleryContainer = document.getElementById("allGallery")
      if (categoryFilter) {
        categoryToShow = categoryFilter // Show specific category from URL param
        // Update page title to show filtered category
        document.querySelector(".gallery-header h1").textContent =
          `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Gallery`
        document.querySelector(".gallery-header p").textContent = `Images in the ${categoryFilter} category`
      } else {
        categoryToShow = "all" // Show all categories
      }
    } else {
      // For specific category pages (nature, architecture, travel, food)
      galleryContainer = document.getElementById(`${pageType}Gallery`)
      categoryToShow = pageType
    }

    if (!galleryContainer) {
      return // Gallery container not found
    }

    // Filter images by category (if not showing all)
    const filteredImages =
      categoryToShow === "all" ? uploadedImages : uploadedImages.filter((img) => img.category === categoryToShow)

    if (filteredImages.length === 0) {
      // Show no uploads message if there are no images for this category
      const noUploadsMessage = document.getElementById("noUploadsMessage")
      if (noUploadsMessage) {
        noUploadsMessage.style.display = "block"
      }
      return // No images for this category
    }

    // Sort by date (newest first) to ensure most recent uploads appear at the top
    filteredImages.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Add each uploaded image to the gallery
    filteredImages.forEach((imageData) => {
      const galleryItem = document.createElement("div")
      galleryItem.className = "gallery-item user-uploaded"
      galleryItem.setAttribute("data-id", imageData.id)
      galleryItem.setAttribute("data-category", imageData.category)

      galleryItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.title}">
        <div class="overlay">
          <h3>${imageData.title}</h3>
          <p>${imageData.category.charAt(0).toUpperCase() + imageData.category.slice(1)}</p>
        </div>
        <div class="user-badge">
          <i class="fas fa-user"></i>
        </div>
        <button class="delete-button" data-id="${imageData.id}" title="Delete Image">
          <i class="fas fa-trash"></i>
        </button>
      `

      // Add to gallery (prepend to show newest first)
      galleryContainer.prepend(galleryItem)

      // Add lightbox functionality
      galleryItem.addEventListener("click", (e) => {
        // Don't open lightbox if clicking delete button
        if (e.target.closest(".delete-button")) {
          return
        }

        const lightbox = document.querySelector(".lightbox")
        const lightboxImg = document.getElementById("lightbox-img")
        const lightboxCaption = document.querySelector(".lightbox-caption")

        if (lightbox && lightboxImg && lightboxCaption) {
          lightboxImg.src = imageData.src
          lightboxCaption.textContent = `${imageData.title} - ${imageData.category.charAt(0).toUpperCase() + imageData.category.slice(1)}`
          lightbox.style.display = "block"
          document.body.style.overflow = "hidden"
        }
      })

      // Add delete functionality
      const deleteBtn = galleryItem.querySelector(".delete-button")
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation()
          deleteImage(imageData.id, galleryItem)
        })
      }
    })
  }

  // Function to delete an image
  function deleteImage(imageId, galleryItem) {
    if (confirm("Are you sure you want to delete this image?")) {
      // Remove from localStorage
      let uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []
      uploadedImages = uploadedImages.filter((img) => img.id != imageId)
      localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages))

      // Remove from DOM
      if (galleryItem) {
        galleryItem.remove()
      }

      // Check if gallery is now empty
      const currentPage = window.location.pathname.split("/").pop().split(".")[0]
      const galleryId = currentPage === "index" ? "allGallery" : `${currentPage}Gallery`
      const gallery = document.getElementById(galleryId)

      if (gallery) {
        const userUploads = gallery.querySelectorAll(".user-uploaded")
        if (userUploads.length === 0) {
          const noUploadsMessage = document.getElementById("noUploadsMessage")
          if (noUploadsMessage) {
            noUploadsMessage.style.display = "block"
          }
        }
      }
    }
  }
})
