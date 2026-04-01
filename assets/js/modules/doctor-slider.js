const getVisibleSlides = () => {
  if (window.innerWidth >= 992) {
    return 3;
  }

  if (window.innerWidth >= 576) {
    return 2;
  }

  return 1;
};

export const initDoctorSlider = () => {
  const track = document.getElementById("sliderTrack");
  const dotsContainer = document.getElementById("sliderDots");
  const prevButton = document.getElementById("sliderPrev");
  const nextButton = document.getElementById("sliderNext");

  if (!track || !dotsContainer || !prevButton || !nextButton) {
    return;
  }

  const cards = [...track.querySelectorAll(".doctor-card")];

  if (!cards.length) {
    return;
  }

  let currentIndex = 0;
  let touchStartX = 0;
  let resizeTimer = 0;

  const getMaxIndex = () => Math.max(0, cards.length - getVisibleSlides());

  const getGap = () => {
    const computedGap = Number.parseFloat(getComputedStyle(track).gap);
    return Number.isNaN(computedGap) ? 24 : computedGap;
  };

  const updateSlider = () => {
    const visibleSlides = getVisibleSlides();
    const gap = getGap();
    const viewportWidth = track.parentElement?.clientWidth ?? 0;
    const cardWidth = (viewportWidth - gap * (visibleSlides - 1)) / visibleSlides;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= getMaxIndex();

    [...dotsContainer.querySelectorAll(".slider__dot")].forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  const buildDots = () => {
    dotsContainer.innerHTML = "";

    const dotsCount = getMaxIndex() + 1;

    Array.from({ length: dotsCount }, (_, index) => {
      const dot = document.createElement("button");
      dot.className = `slider__dot${index === currentIndex ? " active" : ""}`;
      dot.type = "button";
      dot.setAttribute("aria-label", `Слайд ${index + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });
  };

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex += 1;
      updateSlider();
    }
  });

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0]?.clientX ?? 0;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) <= 50) {
        return;
      }

      if (diff > 0 && currentIndex < getMaxIndex()) {
        currentIndex += 1;
      }

      if (diff < 0 && currentIndex > 0) {
        currentIndex -= 1;
      }

      updateSlider();
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      currentIndex = Math.min(currentIndex, getMaxIndex());
      buildDots();
      updateSlider();
    }, 100);
  });

  buildDots();
  updateSlider();
};
