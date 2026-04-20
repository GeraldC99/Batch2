// Shared enhancement layer for navigation, FAQ accordions, reveal effects and the static contact form.
document.documentElement.classList.add("js");

const CONTACT_EMAIL = "info@gegabb.se";

const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const dropdowns = document.querySelectorAll("[data-nav-dropdown]");

const closeDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
  });
};

if (navToggle && navLinks) {
  const setMenuState = (isOpen) => {
    navLinks.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Stäng meny" : "Öppna meny");
    if (!isOpen) {
      closeDropdowns();
    }
  };

  navToggle.addEventListener("click", () => {
    setMenuState(!navLinks.classList.contains("is-open"));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      closeDropdowns();
      navToggle.focus();
    }
  });
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector("[data-dropdown-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = dropdown.classList.contains("is-open");
    closeDropdowns();
    dropdown.classList.toggle("is-open", !isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.setAttribute("aria-current", "page");
    link.closest("[data-nav-dropdown]")?.classList.add("is-current");
  }
});

document.querySelectorAll("[data-faq-question]").forEach((button) => {
  const initialAnswer = document.getElementById(button.getAttribute("aria-controls"));
  button.setAttribute("aria-expanded", "false");
  initialAnswer?.classList.remove("open");

  button.addEventListener("click", () => {
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    if (answer) {
      answer.classList.toggle("open", !expanded);
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const subject = encodeURIComponent(`Kostnadsfri offertförfrågan från ${formData.get("name") || "webbplatsen"}`);
    const body = encodeURIComponent(
      [
        `Namn: ${formData.get("name") || ""}`,
        `E-post: ${formData.get("email") || ""}`,
        `Telefon: ${formData.get("phone") || ""}`,
        `Tjänst: ${formData.get("service") || ""}`,
        "",
        "Projektbeskrivning:",
        formData.get("message") || ""
      ].join("\n")
    );
    const status = contactForm.querySelector("[data-form-status]");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    if (status) {
      status.textContent = "Tack. Ditt e-postprogram öppnas med förfrågan ifylld.";
    }
  });
}
