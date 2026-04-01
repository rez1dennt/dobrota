import { initHeader } from "./modules/header.js";
import { initDoctorSlider } from "./modules/doctor-slider.js";
import { initServicesTabs } from "./modules/services-tabs.js";
import { initAppointmentForm } from "./modules/appointment-form.js";
import { initCookies } from "./modules/cookies.js";
import { initAdvantageReveal } from "./modules/advantage-reveal.js";

const bootstrap = () => {
  initHeader();
  initDoctorSlider();
  initServicesTabs();
  initAppointmentForm();
  initCookies();
  initAdvantageReveal();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
