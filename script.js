const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const clientsSection = document.querySelector("[data-clients-section]");
const counters = document.querySelectorAll("[data-count-up]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

menuButton.addEventListener("click", () => {
  nav.classList.toggle("is-open");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const formatNumber = (value) => new Intl.NumberFormat("pt-BR").format(value);

const runCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 850;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatNumber(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (clientsSection) {
  const revealClients = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        clientsSection.classList.add("is-visible");
        counters.forEach(runCounter);
        observer.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  revealClients.observe(clientsSection);
}

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim() || "Ol\u00e1";
  const message = form.elements.message.value.trim();
  const text = encodeURIComponent(
    `${name}! Quero conversar sobre um projeto.${message ? `\n\nResumo: ${message}` : ""}`
  );

  window.open(`https://wa.me/5521974381772?text=${text}`, "_blank", "noopener,noreferrer");
});
