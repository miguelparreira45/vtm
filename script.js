const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const clientsSection = document.querySelector("[data-clients-section]");
const portfolioSection = document.querySelector("[data-portfolio-section]");
const portfolioSlides = document.querySelectorAll(".portfolio-slide");
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

const syncPortfolio = (activeIndex) => {
  const total = portfolioSlides.length;

  portfolioSlides.forEach((slide, index) => {
    const previous = (activeIndex - 1 + total) % total;
    const next = (activeIndex + 1) % total;
    const farPrevious = (activeIndex - 2 + total) % total;
    const farNext = (activeIndex + 2) % total;

    slide.classList.toggle("is-active", index === activeIndex);
    slide.classList.toggle("is-prev", index === previous);
    slide.classList.toggle("is-next", index === next);
    slide.classList.toggle("is-far-prev", index === farPrevious);
    slide.classList.toggle("is-far-next", index === farNext);
  });
};

let portfolioIndex = 0;
syncPortfolio(portfolioIndex);

if (portfolioSection) {
  const revealPortfolio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          portfolioSection.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.25 }
  );

  revealPortfolio.observe(portfolioSection);
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

  const items = [...carousel.children];
  const firstItem = items[0];
  if (!firstItem || !items.length) {
    return;
  }

  const itemWidth = firstItem.getBoundingClientRect().width + 14;
  const nearEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 12;
  const nextLeft = nearEnd ? 0 : carousel.scrollLeft + itemWidth;

  carousel.scrollTo({
    left: nextLeft,
    behavior: "smooth",
  });

  const nextIndex = nearEnd ? 0 : Math.min(Math.round(nextLeft / itemWidth), items.length - 1);
  items.forEach((item, index) => {
    item.classList.toggle("is-active-slide", index === nextIndex);
  });
};

mobileCarousels.forEach((carousel) => {
  const items = [...carousel.children];
  items.forEach((item, index) => {
    item.classList.toggle("is-active-slide", index === 0);
  });

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

  window.setInterval(() => {
    portfolioIndex = (portfolioIndex + 1) % portfolioSlides.length;
    syncPortfolio(portfolioIndex);
  }, 2600);
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
