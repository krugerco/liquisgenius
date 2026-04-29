const revealTargets = document.querySelectorAll(".section, .proof-band, .visual-story article, .pillar-card, .service-card, .lab-card, .timeline li, .metric-list div");

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

window.addEventListener("scroll", () => {
  header.toggleAttribute("data-scrolled", window.scrollY > 18);
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
