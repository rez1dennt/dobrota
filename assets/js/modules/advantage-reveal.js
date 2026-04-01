export const initAdvantageReveal = () => {
  const cards = [...document.querySelectorAll(".adv__card")];

  if (!cards.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) {
          return;
        }

        window.setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 80);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => observer.observe(card));
};
