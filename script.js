// ================= MENU TOGGLE =================
const menuIcon = document.querySelector("#menu-icon");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links li a");

// Toggle menu on hamburger click
menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close menu when any nav link is clicked
navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !menuIcon.contains(e.target)) {
    navLinks.classList.remove("active");
  }
});


// ================= TYPING ANIMATION =================
const roles = ["Frontend Developer", "MERN Stack Developer"];
const typingElement = document.getElementById("typing");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingElement) return;

  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typingElement.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      setTimeout(() => (isDeleting = true), 1200);
    }
  } else {
    typingElement.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 60 : 100);
}

window.addEventListener("load", () => {
  if (typingElement) {
    typingElement.textContent = "";
    typeEffect();
  }
});

// ================= CONTACT FORM =================
const contactForm = document.getElementById("contact-form");
const responseMsg = document.getElementById("response-msg");

if (contactForm && responseMsg) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button");
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    // Validation
    if (!email) {
      responseMsg.textContent = "⚠️ Please enter your email address.";
      responseMsg.style.color = "orange";
      return;
    }

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const res = await fetch(
        "https://myportfolio-backend-r5e3.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        responseMsg.textContent =
          "✅ Thank you! I'll get back to you soon 😊";
        responseMsg.style.color = "green";
        contactForm.reset();
      } else {
        responseMsg.textContent =
          `⚠️ ${data.message || "Something went wrong!"}`;
        responseMsg.style.color = "red";
      }
    } catch (err) {
      responseMsg.textContent =
        "❌ Server error. Please try again later.";
      responseMsg.style.color = "red";
    } finally {
      submitBtn.textContent = "Send Message →";
      submitBtn.disabled = false;

      responseMsg.style.opacity = "1";
      setTimeout(() => {
        responseMsg.style.opacity = "0";
      }, 5000);
    }
  });
}
