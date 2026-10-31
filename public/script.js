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
  if (text == null) return "";
  return String(text).replace(/[&<>"']/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"}[c]));
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
  if (!gallerySlides.length) return;
  galleryIndex = (galleryIndex + 1) % gallerySlides.length;
  updateGallerySlidePosition();
}

function prevGallerySlide() {
  if (!gallerySlides.length) return;
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
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = Array.from(document.querySelectorAll('.slide-indicator'));
let heroIndex = 0;
let heroTimer;
function updateHeroSlide(index) {
  if (!heroSlides.length) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === heroIndex);
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.setAttribute('aria-current', String(i === heroIndex));
  });
  const currentSlide = document.getElementById('currentSlide');
  if (currentSlide) currentSlide.textContent = String(heroIndex + 1).padStart(2, '0');
}
function startHeroTimer() {
  clearInterval(heroTimer);
  if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroTimer = setInterval(() => updateHeroSlide(heroIndex + 1), 8000);
  }
}
// Used by the existing inline image indicator handlers.
window.goToSlide = function(index) {
  updateHeroSlide(index);
  startHeroTimer();
};

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('galleryLoading')) loadGallery();
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  if (prevBtn) prevBtn.addEventListener('click', () => { prevGallerySlide(); resetGalleryAutoAdvance(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextGallerySlide(); resetGalleryAutoAdvance(); });
  updateHeroSlide(0);
  startHeroTimer();
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
