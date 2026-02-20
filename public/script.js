// --------------------
// Mobile Menu Toggle
// --------------------
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
}

// --------------------
// Gallery Carousel
// --------------------
let gallerySlides = [];
let galleryIndex = 0;
let galleryAutoAdvance;

async function loadGallery() {
  const loadingEl = document.getElementById("galleryLoading");
  const errorEl = document.getElementById("galleryError");
  const emptyEl = document.getElementById("galleryEmpty");
  const containerEl = document.getElementById("galleryContainer");
  const trackEl = document.getElementById("galleryTrack");
  const dotsEl = document.getElementById("dotIndicators");

  // Reset states
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  emptyEl.classList.add("hidden");
  containerEl.classList.add("hidden");

  try {
    const response = await fetch("/Coli/gallary");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const images = await response.json();

    if (!images || images.length === 0) {
      loadingEl.classList.add("hidden");
      emptyEl.classList.remove("hidden");
      return;
    }

    gallerySlides = images;
    trackEl.innerHTML = "";
    dotsEl.innerHTML = "";

    images.forEach((image, index) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = "w-full flex-shrink-0";
      slideDiv.innerHTML = `
        <div class="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group">
          <img src="${escapeHtml(image.image_url)}"
               alt="${escapeHtml(image.alt_text || image.caption || "Gallery image")}"
               class="gallery-image w-full h-full object-cover"
               loading="${index === 0 ? "eager" : "lazy"}" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <span class="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs font-semibold rounded-full mb-3">
              ${escapeHtml(image.category || "OUTREACH")}
            </span>
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-2">${escapeHtml(image.title || "")}</h3>
            <p class="text-gray-200 text-lg max-w-2xl">${escapeHtml(image.description || "")}</p>
          </div>
        </div>`;
      trackEl.appendChild(slideDiv);

      const dot = document.createElement("button");
      dot.className = `dot-indicator w-2 h-2 rounded-full ${index === 0 ? "bg-blue-600" : "bg-white/30"}`;
      dot.dataset.index = index;
      dot.addEventListener("click", () => goToGallerySlide(index));
      dotsEl.appendChild(dot);
    });

    galleryIndex = 0;
    updateGallerySlidePosition();

    loadingEl.classList.add("hidden");
    containerEl.classList.remove("hidden");
    startGalleryAutoAdvance();
  } catch (error) {
    console.error("Failed to load gallery:", error);
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateGallerySlidePosition() {
  const trackEl = document.getElementById("galleryTrack");
  const dots = document.querySelectorAll(".dot-indicator");
  trackEl.style.transform = `translateX(-${galleryIndex * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("bg-blue-600", i === galleryIndex);
    dot.classList.toggle("bg-white/30", i !== galleryIndex);
  });
}

function goToGallerySlide(index) {
  galleryIndex = index;
  updateGallerySlidePosition();
  resetGalleryAutoAdvance();
}

function nextGallerySlide() {
  galleryIndex = (galleryIndex + 1) % gallerySlides.length;
  updateGallerySlidePosition();
}

function prevGallerySlide() {
  galleryIndex =
    (galleryIndex - 1 + gallerySlides.length) % gallerySlides.length;
  updateGallerySlidePosition();
}

function startGalleryAutoAdvance() {
  stopGalleryAutoAdvance();
  galleryAutoAdvance = setInterval(nextGallerySlide, 5000);
}

function stopGalleryAutoAdvance() {
  if (galleryAutoAdvance) clearInterval(galleryAutoAdvance);
}

function resetGalleryAutoAdvance() {
  startGalleryAutoAdvance();
}

// --------------------
// Hero Carousel
// --------------------
let heroIndex = 0;
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".slide-indicator");

function updateHeroSlide(index) {
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  heroDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
  heroIndex = index;
}

function nextHeroSlide() {
  updateHeroSlide((heroIndex + 1) % heroSlides.length);
}

function prevHeroSlide() {
  updateHeroSlide((heroIndex - 1 + heroSlides.length) % heroSlides.length);
}

// Auto-advance every 8 seconds
setInterval(nextHeroSlide, 8000);

// Hook up indicators
heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = parseInt(dot.dataset.slide);
    updateHeroSlide(index);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Gallery setup
  loadGallery();
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevGallerySlide();
      resetGalleryAutoAdvance();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextGallerySlide();
      resetGalleryAutoAdvance();
    });

  // Hero setup
  document.getElementById("prevHero").addEventListener("click", () => {
    updateHeroSlide((heroIndex - 1 + 2) % 2);
  });
  document.getElementById("nextHero").addEventListener("click", () => {
    updateHeroSlide((heroIndex + 1) % 2);
  });
  document.querySelectorAll(".hero-dot").forEach((dot) => {
    dot.addEventListener("click", () =>
      updateHeroSlide(parseInt(dot.dataset.index)),
    );
  });
  setInterval(() => updateHeroSlide((heroIndex + 1) % 2), 5000);
});
// team veiw
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Parallax Effect on Scroll
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const orbs = document.querySelectorAll(".glow-orb");

  orbs.forEach((orb, index) => {
    const speed = 0.5 + index * 0.2;
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
});
