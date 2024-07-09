
const accessKey = 'Your_Access_Key';
const searchForm = document.querySelector("form");
const imageContainer = document.querySelector(".image-container");
const loadMoreBtn = document.querySelector(".loadMore");
const inputValue = document.querySelector(".search-input");

let currentPage = 1;

// Function to fetch images using Unsplash API
const fetchImages = async (query, page) => {
  try {
    if (page === 1) {
      imageContainer.innerHTML = "";
    }
    const url = `https://api.unsplash.com/search/photos/?query=${query}&per_page=28&page=${page}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // console.log(data)
    if (data.results.length > 0) {
      data.results.forEach((photo) => {
        // creating images div
        const imageElement = document.createElement("div");
        imageElement.classList.add("imagesDiv");
        imageElement.innerHTML = `<img src="${photo.urls.regular}"/>`;

        // creating overlay
        const overlayElement = document.createElement("div");
        overlayElement.classList.add("overlay");

        // Creating overlay text
        const overlayText = document.createElement("p");
        overlayText.textContent = `${photo.alt_description}`;

        // Creating download button
        const downloadBtn = document.createElement('a');
        downloadBtn.classList.add('downloadBtn');
        downloadBtn.innerHTML = `<i class="ri-download-line"></i>`;
        
        // Add this event listener
        downloadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          fetch(photo.urls.full)
            .then(res => res.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.download = `${photo.id}.jpg`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            })
            .catch(() => alert('Failed to download image'));
        });


        overlayElement.appendChild(overlayText);
        overlayElement.appendChild(downloadBtn)
        imageElement.appendChild(overlayElement);
        imageContainer.appendChild(imageElement);
      });

      if (data.total_pages === page) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "block";
      }
    } else {
      imageContainer.innerHTML = `<h2>No Image Found</h2>`;
    }
  } catch (error) {
    imageContainer.innerHTML = `<h2>Failed to fetch images. Please try again</h2> `
  }

  // return data; // return the data object
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputText = inputValue.value.trim();
  if (inputText !== "") {
    currentPage = 1;
    fetchImages(inputText, currentPage);
    //  inputValue.value = '';
    
  } else {
    imageContainer.innerHTML = `<h2>Enter a search query</h2>`;
    if(loadMoreBtn.style.display === "block"){
        loadMoreBtn.style.display = "none";
    }
  }
});

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  fetchImages(inputValue.value.trim(), currentPage);
});
