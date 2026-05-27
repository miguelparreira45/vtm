const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const clientsSection = document.querySelector("[data-clients-section]");
const counters = document.querySelectorAll("[data-count-up]");
const revealTargets = document.querySelectorAll(
  ".section-heading, .about-grid > *, .service-card, .case-item, .cases-showcase, .process-grid > *, .testimonial-band blockquote, .contact-form"
);
const mobileCarousels = document.querySelectorAll(".intro-band, .service-grid, .case-list, .process-grid");

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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
      }
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((target) => {
  target.classList.add("reveal-on-scroll");
  revealObserver.observe(target);
});

const advanceCarousel = (carousel) => {
  if (!window.matchMedia("(max-width: 720px)").matches) {
    return;
  }

  const firstItem = carousel.children[0];
  if (!firstItem) {
    return;
  }

  const itemWidth = firstItem.getBoundingClientRect().width + 14;
  const nearEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 12;

  carousel.scrollTo({
    left: nearEnd ? 0 : carousel.scrollLeft + itemWidth,
    behavior: "smooth",
  });
};

mobileCarousels.forEach((carousel) => {
  carousel.addEventListener(
    "touchmove",
    (event) => {
      if (window.matchMedia("(max-width: 720px)").matches) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    mobileCarousels.forEach(advanceCarousel);
  }, 3200);
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
