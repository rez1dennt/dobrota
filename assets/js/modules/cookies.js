const storageKey = "cookies_accepted";

const getStorageValue = () => {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

const setStorageValue = (value) => {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // Storage can be unavailable in private mode or restricted browsers.
  }
};

export const initCookies = () => {
  const cookieBar = document.getElementById("cookieBar");
  const acceptButton = document.getElementById("cookieAccept");
  const declineButton = document.getElementById("cookieDecline");

  if (!cookieBar || !acceptButton || !declineButton) {
    return;
  }

  const hideBar = () => {
    cookieBar.classList.remove("visible");
  };

  if (!getStorageValue()) {
    window.setTimeout(() => {
      cookieBar.classList.add("visible");
    }, 1500);
  }

  acceptButton.addEventListener("click", () => {
    setStorageValue("1");
    hideBar();
  });

  declineButton.addEventListener("click", hideBar);
};
