const getPhoneDigits = (value) => value.replace(/\D/g, "");

const normalizePhone = (value) => {
  const digits = getPhoneDigits(value);

  if (!digits) {
    return "";
  }

  const normalized = digits.startsWith("8")
    ? `7${digits.slice(1)}`
    : digits.startsWith("7")
      ? digits
      : `7${digits.slice(-10)}`;

  return normalized.slice(0, 11);
};

const formatPhoneDigits = (digits) => {
  if (!digits || digits.length <= 1) {
    return "";
  }

  const areaCode = digits.slice(1, 4);
  const firstBlock = digits.slice(4, 7);
  const secondBlock = digits.slice(7, 9);
  const thirdBlock = digits.slice(9, 11);
  let formatted = "+7";

  if (areaCode) {
    formatted += ` (${areaCode}`;
  }

  if (areaCode.length === 3) {
    formatted += ")";
  }

  if (firstBlock) {
    formatted += ` ${firstBlock}`;
  }

  if (secondBlock) {
    formatted += `-${secondBlock}`;
  }

  if (thirdBlock) {
    formatted += `-${thirdBlock}`;
  }

  return formatted;
};

const countDigitsBeforeCaret = (value, caretPosition) =>
  getPhoneDigits(value.slice(0, caretPosition)).length;

const getCaretPositionByDigitIndex = (value, digitIndex) => {
  if (!value || digitIndex <= 0) {
    return 0;
  }

  let digitsPassed = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) {
      digitsPassed += 1;
    }

    if (digitsPassed >= digitIndex) {
      return index + 1;
    }
  }

  return value.length;
};

export const initAppointmentForm = () => {
  const resetDelaySeconds = 10;
  const form = document.getElementById("appointmentForm");
  const formWrapper = document.getElementById("formWrapper");
  const successState = document.getElementById("formSuccess");
  const resetCountdown = document.getElementById("formResetCountdown");
  const nameField = document.getElementById("name");
  const phoneField = document.getElementById("phone");
  const consentField = document.getElementById("consent");

  if (
    !form
    || !formWrapper
    || !successState
    || !resetCountdown
    || !nameField
    || !phoneField
    || !consentField
  ) {
    return;
  }

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const consentError = document.getElementById("consentError");
  let resetTimeoutId = 0;
  let resetIntervalId = 0;

  const toggleFieldError = (field, errorNode, isVisible) => {
    field?.classList.toggle("error", isVisible);
    errorNode?.classList.toggle("visible", isVisible);
  };

  const clearResetTimers = () => {
    window.clearTimeout(resetTimeoutId);
    window.clearInterval(resetIntervalId);
  };

  const updateCountdown = (secondsLeft) => {
    resetCountdown.textContent = String(secondsLeft);
  };

  const resetFormState = () => {
    clearResetTimers();
    form.reset();
    phoneField.value = "";
    toggleFieldError(nameField, nameError, false);
    toggleFieldError(phoneField, phoneError, false);
    consentError?.classList.remove("visible");
    updateCountdown(resetDelaySeconds);
    successState.style.display = "none";
    formWrapper.style.display = "block";
  };

  const startResetCountdown = () => {
    let secondsLeft = resetDelaySeconds;

    clearResetTimers();
    updateCountdown(secondsLeft);

    resetIntervalId = window.setInterval(() => {
      secondsLeft -= 1;

      if (secondsLeft <= 0) {
        window.clearInterval(resetIntervalId);
        return;
      }

      updateCountdown(secondsLeft);
    }, 1000);

    resetTimeoutId = window.setTimeout(() => {
      resetFormState();
    }, resetDelaySeconds * 1000);
  };

  const validateName = () => {
    const isValid = nameField.value.trim().length >= 2;
    toggleFieldError(nameField, nameError, !isValid);
    return isValid;
  };

  const validatePhone = () => {
    const isValid = normalizePhone(phoneField.value).length === 11;
    toggleFieldError(phoneField, phoneError, !isValid);
    return isValid;
  };

  const validateConsent = () => {
    const isValid = consentField.checked;
    consentError?.classList.toggle("visible", !isValid);
    return isValid;
  };

  phoneField.addEventListener("keydown", (event) => {
    if (event.key !== "Backspace" && event.key !== "Delete") {
      return;
    }

    const { selectionStart, selectionEnd, value } = phoneField;

    if (selectionStart == null || selectionEnd == null || selectionStart !== selectionEnd) {
      return;
    }

    const digits = normalizePhone(value);

    if (!digits) {
      return;
    }

    const digitPosition = countDigitsBeforeCaret(value, selectionStart);
    const removeIndex = event.key === "Backspace"
      ? digitPosition - 1
      : Math.max(1, digitPosition);

    if (removeIndex < 1 || removeIndex >= digits.length) {
      if (event.key === "Backspace" && digitPosition <= 1) {
        event.preventDefault();
        phoneField.value = "";
        phoneField.setSelectionRange(0, 0);
      }

      return;
    }

    event.preventDefault();

    const nextDigits = digits.split("");
    nextDigits.splice(removeIndex, 1);

    const nextValue = formatPhoneDigits(nextDigits.join(""));
    const nextDigitPosition = event.key === "Backspace" ? removeIndex : digitPosition;
    const caretPosition = getCaretPositionByDigitIndex(nextValue, nextDigitPosition);

    phoneField.value = nextValue;
    phoneField.setSelectionRange(caretPosition, caretPosition);

    if (phoneField.classList.contains("error")) {
      validatePhone();
    }
  });

  phoneField.addEventListener("input", () => {
    const rawValue = phoneField.value;
    const rawDigits = getPhoneDigits(rawValue);
    const normalizedDigits = normalizePhone(rawValue);
    const selectionStart = phoneField.selectionStart ?? rawValue.length;
    const insertedCountryCode = rawDigits && !rawDigits.startsWith("7") && !rawDigits.startsWith("8")
      ? 1
      : 0;
    const digitPosition = Math.min(
      normalizedDigits.length,
      countDigitsBeforeCaret(rawValue, selectionStart) + insertedCountryCode
    );
    const formattedValue = formatPhoneDigits(normalizedDigits);
    const caretPosition = getCaretPositionByDigitIndex(formattedValue, digitPosition);

    phoneField.value = formattedValue;
    phoneField.setSelectionRange(caretPosition, caretPosition);

    if (phoneField.classList.contains("error")) {
      validatePhone();
    }
  });

  nameField.addEventListener("input", () => {
    if (nameField.classList.contains("error")) {
      validateName();
    }
  });

  consentField.addEventListener("change", validateConsent);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = [validateName(), validatePhone(), validateConsent()].every(Boolean);

    if (!isValid) {
      return;
    }

    formWrapper.style.display = "none";
    successState.style.display = "block";
    startResetCountdown();
  });
};
