document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm")
  const imageFileInput = document.getElementById("imageFile")
  const fileNameDisplay = document.getElementById("fileName")
  const imagePreview = document.getElementById("imagePreview")
  const uploadSuccess = document.getElementById("uploadSuccess")
  const uploadContainer = document.querySelector(".upload-container")
  const myUploadsContainer = document.getElementById("myUploads")

  // Display file name when a file is selected
  imageFileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      // Update file name display
      fileNameDisplay.textContent = this.files[0].name

      // Show image preview
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`
      }
      reader.readAsDataURL(this.files[0])
    } else {
      fileNameDisplay.textContent = "No file chosen"
      imagePreview.innerHTML = ""
    }
  })

  // Handle form submission
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const title = document.getElementById("imageTitle").value
    const description = document.getElementById("imageDescription").value
    const category = document.getElementById("imageCategory").value
    const file = imageFileInput.files[0]

    if (!file) {
      alert("Please select an image to upload")
      return
    }

    // Convert image to base64 for storage
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = {
        id: Date.now(), // Use timestamp as unique ID
        title: title,
        description: description,
        category: category,
        src: e.target.result, // Base64 encoded image
        date: new Date().toISOString(),
        isUserUploaded: true,
      }

      // Save to localStorage
      saveImageToLocalStorage(imageData)

      // Show success message
      showSuccessMessage(category)
    }
    reader.readAsDataURL(file)
  })

  // Save image data to localStorage
  function saveImageToLocalStorage(imageData) {
    // Get existing images or initialize empty array
    const uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []

    // Add new image
    uploadedImages.push(imageData)

    // Save back to localStorage
    localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages))
  }

  // Show success message and hide form
  function showSuccessMessage(category) {
    uploadContainer.style.display = "none"
    uploadSuccess.style.display = "block"

    // Update category name in success message
    document.getElementById("categoryName").textContent = category.charAt(0).toUpperCase() + category.slice(1)

    // Set up view category button
    const viewCategoryBtn = document.getElementById("viewCategoryBtn")
    viewCategoryBtn.href = `${category}.html`

    // Scroll to success message
    uploadSuccess.scrollIntoView({ behavior: "smooth" })
  }

  // Function to upload another image (reset form)
  window.uploadAnother = () => {
    uploadContainer.style.display = "block"
    uploadSuccess.style.display = "none"

    // Reset form
    uploadForm.reset()
    fileNameDisplay.textContent = "No file chosen"
    imagePreview.innerHTML = ""

    // Scroll back to form
    uploadContainer.scrollIntoView({ behavior: "smooth" })
  }

  // Add image to gallery display
  function addImageToGallery(imageData) {
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
      <div class="image-actions">
        <button class="delete-btn" data-id="${imageData.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `

    myUploadsContainer.prepend(galleryItem)

    // Add event listener to delete button
    galleryItem.querySelector(".delete-btn").addEventListener("click", function (e) {
      e.stopPropagation()
      const imageId = this.getAttribute("data-id")
      deleteImage(imageId)
    })

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
  }

  // Delete image from localStorage and gallery
  function deleteImage(imageId) {
    if (confirm("Are you sure you want to delete this image?")) {
      // Remove from localStorage
      let uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []
      uploadedImages = uploadedImages.filter((img) => img.id != imageId)
      localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages))

      // Remove from DOM
      const imageElement = document.querySelector(`.gallery-item[data-id="${imageId}"]`)
      if (imageElement) {
        imageElement.remove()
      }
    }
  }

  // Load existing uploaded images on page load
  function loadUploadedImages() {
    const uploadedImages = JSON.parse(localStorage.getItem("uploadedImages")) || []

    if (uploadedImages.length === 0) {
      myUploadsContainer.innerHTML = "<p class='no-uploads'>You haven't uploaded any images yet.</p>"
      return
    }

    // Sort by date (newest first)
    uploadedImages.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Add each image to gallery
    uploadedImages.forEach((imageData) => {
      addImageToGallery(imageData)
    })
  }

  // Initialize
  loadUploadedImages()
})
