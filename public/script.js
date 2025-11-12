// 🌟 Global Smoothness Enhancer 🌟
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for entire page
  document.documentElement.style.scrollBehavior = "smooth";

  // Smooth fade-in of page on load
  window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.8s ease-out";
    requestAnimationFrame(() => (document.body.style.opacity = "1"));
  });

  // Smooth anchor/link scrolling (if you have in-page links)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Add gentle fade & scale effect for all modals
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.target.classList.contains("flex")) {
        m.target.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        m.target.style.opacity = "1";
        m.target.style.transform = "scale(1)";
      } else {
        m.target.style.opacity = "0";
        m.target.style.transform = "scale(0.95)";
      }
    });
  });
  document.querySelectorAll("#quoteModal, #thankYouModal").forEach((m) =>
    observer.observe(m, { attributes: true, attributeFilter: ["class"] })
  );

  // Subtle smooth transition for sections when they appear
  const fadeSections = document.querySelectorAll("section, .faq-item, .offer-card, .estimate-card");
  fadeSections.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeSections.forEach((el) => sectionObserver.observe(el));
});


const text2 = "Hyderabad Interiors Designed Just for You";
let index = 0;
let typing = true;
const typingSpeed = 80;
const pauseTime = 1000;

function typeDeleteLoop() {
  const typedText = document.getElementById("typedText");
  const subtitle = document.getElementById("subtitle2");

  if (typing) {
    // Add text before cursor
    typedText.textContent = text2.substring(0, index + 1);
    index++;
    if (index === text2.length) {
      subtitle.style.opacity = 1; // show subtitle
      typing = false;
      setTimeout(typeDeleteLoop, pauseTime);
      return;
    }
  } else {
    // Delete text
    typedText.textContent = text2.substring(0, index - 1);
    index--;
    subtitle.style.opacity = 0; // hide subtitle
    if (index === 0) {
      typing = true;
      setTimeout(typeDeleteLoop, 500);
      return;
    }
  }
  setTimeout(typeDeleteLoop, typingSpeed);
}
// deop down 
document.addEventListener('DOMContentLoaded', () => {
  const media = window.matchMedia('(max-width: 1024px)');
  const desktop = document.querySelector('.offer-container');
  const accordion = document.querySelector('.offer-accordion');

  function handleView() {
    if (media.matches) {
      desktop.style.display = 'none';
      accordion.style.display = 'flex';
    } else {
      desktop.style.display = 'flex';
      accordion.style.display = 'none';
    }
  }

  handleView();
  media.addEventListener('change', handleView);

  // Accordion toggle
  accordion.addEventListener('click', e => {
    const header = e.target.closest('.offer-panel-header');
    if (!header) return;
    const panel = header.parentElement;
    const body = panel.querySelector('.offer-panel-body');

    document.querySelectorAll('.offer-panel.active').forEach(p => {
      if (p !== panel) {
        const b = p.querySelector('.offer-panel-body');
        b.style.maxHeight = null;
        b.style.opacity = 0;
        p.classList.remove('active');
      }
    });

    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
      body.style.maxHeight = body.scrollHeight + 'px';
      body.style.opacity = 1;
      setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    } else {
      body.style.maxHeight = null;
      body.style.opacity = 0;
    }
  });
});
// Blinking cursor
setInterval(() => {
  const cursor = document.getElementById("cursor");
  cursor.style.visibility =
    cursor.style.visibility === "hidden" ? "visible" : "hidden";
}, 500);

window.onload = typeDeleteLoop;

//connect section dail 
function handleCallClick(event) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      // On desktop → open modal instead of dialing
      event.preventDefault();
      openModal();
    }
    // On mobile → let the tel: link work naturally (open dial pad)
  }
  
// HERO PARALLAX + ANIMATION
// ==========================
(function () {
  const heroSection = document.querySelector('.hero-slideshow');
  const slides = document.querySelectorAll('.slide');
  const overlay = document.querySelector('.bg-black\\/40');
  const textContent = document.querySelector('.animate-text');
  let isInView = false;
  let ticking = false;

  // Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      isInView = entries[0].isIntersecting;
      if (isInView && !ticking) {
        requestAnimationFrame(updateParallax);
      }
    },
    { threshold: 0.1 }
  );
  if (heroSection) observer.observe(heroSection);

  // Parallax Update Function
  function updateParallax() {
    if (!isInView) {
      ticking = false;
      return;
    }

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const heroRect = heroSection.getBoundingClientRect();

    slides.forEach((slide) => {
      const parallaxOffset = scrollPosition * 0.3;
      slide.style.transform = `translateY(${parallaxOffset}px)`;
    });

    if (overlay) {
      const overlayOffset = scrollPosition * 0.15;
      overlay.style.transform = `translateY(${overlayOffset}px)`;
    }

    if (textContent) {
      const scrollProgress = Math.min(heroRect.top / windowHeight, 1);
      const opacity = Math.max(0.3, 1 - scrollProgress * 0.7);
      const scale = Math.max(0.8, 1 - scrollProgress * 0.2);
      textContent.style.opacity = opacity;
      textContent.style.transform = `translateY(20px) scale(${scale})`;
    }

    ticking = false;
  }

  // Mousemove Parallax for text
  heroSection?.addEventListener('mousemove', (e) => {
    if (!isInView || !textContent) return;

    const rect = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((mouseX - centerX) / centerX) * 10;
    const tiltY = ((mouseY - centerY) / centerY) * 10;

    textContent.style.transform = `translate(${tiltX}px, ${tiltY + 20}px)`;
  });

  heroSection?.addEventListener('mouseleave', () => {
    if (textContent) textContent.style.transform = `translateY(20px)`;
  });

  window.addEventListener('scroll', () => {
    if (!ticking && isInView) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  });
})();

// ==========================
// HERO TEXT FADE CYCLING
// ==========================
const slidesText = document.querySelectorAll(".animate-text div");
let current = 0;

function showNextSlide() {
  slidesText.forEach((s) => (s.style.opacity = 0));
  if (slidesText[current]) slidesText[current].style.opacity = 1;
  current = (current + 1) % slidesText.length;
}

if (slidesText.length) setInterval(showNextSlide, 3000);

// ==========================
// MAIN FUNCTIONALITY
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("quoteModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const openBtns = document.querySelectorAll(".openQuoteModal");

  // Open modal
  openBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  });

  // Close modal
  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    }
  });

  // design naimation 
const horizontalScroll = document.querySelector('.horizontal-scroll');
  const scrollContainer = document.querySelector('.scroll-container');
  const panels = document.querySelectorAll('.scroll-panel');

  panels.forEach(panel => {
    panel.classList.add('visible');
  });

  window.addEventListener('scroll', () => {
    const rect = horizontalScroll.getBoundingClientRect();
    const scrollPosition = window.scrollY;
    const sectionTop = horizontalScroll.offsetTop;
    const sectionHeight = horizontalScroll.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight * 2) {
      const scrollProgress = (scrollPosition - sectionTop) / sectionHeight;
      scrollContainer.style.transform = `translateX(-${scrollProgress * 100}vw)`;
    }
  });





  // Counter Animation
  const counters = document.querySelectorAll(".stat-number");
  function animateCounter(el) {
    const target = +el.getAttribute("data-target");
    const increment = target / 100;
    let count = 0;
    const updateCounter = () => {
      count += increment;
      if (count < target) {
        el.innerText = Math.ceil(count);
        requestAnimationFrame(updateCounter);
      } else {
        el.innerText = target;
      }
    };
    updateCounter();
  }
  counters.forEach(animateCounter);

  // Handle Contact and Quote Forms
["contactForm", "quoteForm"].forEach(formId => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      fullName: this.fullName.value.trim(),
      email: this.email.value.trim(),
      phone: this.phone.value.trim(),
      message: this.message.value.trim(),
    };

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert(data.message || "✅ Message sent successfully!");

      if (formId === "quoteForm") {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
      }

      this.reset();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("❌ Something went wrong, please try again.");
    }
  });
});

  // ==========================
  // FAQ TOGGLE FUNCTIONALITY
  // ==========================
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(faq => {
    const question = faq.querySelector('.faq-question');
    question.addEventListener('click', () => {
      faqs.forEach(item => {
        if (item !== faq) item.classList.remove('active');
      });
      faq.classList.toggle('active');
    });
  });
});

// ==========================
// THANK YOU MODAL
// ==========================
function openModal() {
  document.getElementById('thankYouModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('thankYouModal').style.display = 'none';
}

window.onclick = function (event) {
  const modal = document.getElementById('thankYouModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};