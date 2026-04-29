const revealTargets = document.querySelectorAll(".section, .brand-marquee, .proof-band, .stats-ribbon, .stat-grid article, .visual-story article, .photo-feature, .pillar-card, .service-card, .lab-card, .direction-grid a, .timeline li, .metric-list div");

revealTargets.forEach((target) => target.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
  header.toggleAttribute("data-scrolled", window.scrollY > 18);

  if (scrollProgress) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  });
});

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    formStatus.textContent = "Sending your message...";
    formStatus.dataset.state = "loading";
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      contactForm.reset();
      formStatus.textContent = "Thanks. Your message was sent to Liquid Genius.";
      formStatus.dataset.state = "success";
    } catch (error) {
      formStatus.textContent = error.message;
      formStatus.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
    }
  });
}

const counters = document.querySelectorAll("[data-counter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateCounter = (counter) => {
  const target = Number(counter.dataset.counter || 0);

  if (prefersReducedMotion) {
    counter.textContent = target;
    return;
  }

  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
