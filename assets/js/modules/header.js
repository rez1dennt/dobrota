export const initHeader = () => {
  const header = document.getElementById("header");
  const scrollTopButton = document.getElementById("scrollTop");
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");
  const body = document.body;

  const updateScrollState = () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
    scrollTopButton?.classList.toggle("visible", window.scrollY > 400);
  };

  const toggleMenu = (isOpen) => {
    if (!burger || !mobileNav) {
      return;
    }

    burger.classList.toggle("active", isOpen);
    mobileNav.classList.toggle("active", isOpen);
    body.classList.toggle("menu-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  scrollTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  burger?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.contains("active");
    toggleMenu(!isOpen);
  });

  mobileNav
    ?.querySelectorAll(".mobile-nav__link, .mobile-nav__cta .btn")
    .forEach((link) => {
      link.addEventListener("click", () => toggleMenu(false));
    });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleMenu(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      toggleMenu(false);
    }
  });
};
