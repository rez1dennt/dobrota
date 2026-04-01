export const initServicesTabs = () => {
  const tabs = [...document.querySelectorAll(".services__tab")];
  const panels = [...document.querySelectorAll(".services__panel")];

  if (!tabs.length || !panels.length) {
    return;
  }

  const activateTab = (tab) => {
    const targetPanel = document.getElementById(`tab-${tab.dataset.tab}`);

    if (!targetPanel) {
      return;
    }

    tabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel === targetPanel);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
  });
};
