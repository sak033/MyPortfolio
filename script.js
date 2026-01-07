//variables
const menuIcon = document.querySelector('#menu-icon');
const navLink = document.querySelector('.nav-links');

//function---Arrow function
menuIcon.onclick= ()=>{
    navLink.classList.toggle('active');
}


// Typing animation
// Typing animation with multiple roles
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

// Start after page load
window.addEventListener("load", () => {
  typingElement.textContent = "";
  typeEffect();
});




// Handle contact form submission
const contactForm = document.getElementById("contact-form");
const responseMsg = document.getElementById("response-msg");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      responseMsg.textContent = "⚠️ Please enter your email address.";
      responseMsg.style.color = "orange";
      return;
    }

    try {
     const res = await fetch("https://myportfolio-7br8.onrender.com/api/contact", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        responseMsg.textContent = "✅ Thank you! I'll get back to you soon 😊";
        responseMsg.style.color = "green";
        contactForm.reset();
      } else {
        responseMsg.textContent = `⚠️ ${data.message || "Something went wrong!"}`;
        responseMsg.style.color = "red";
      }
    } catch (err) {
      responseMsg.textContent = "❌ Server error. Please try again later.";
      responseMsg.style.color = "red";
    }

    // Smooth fade effect
    responseMsg.style.opacity = "1";
    responseMsg.style.transition = "opacity 0.4s ease";

    // Hide message after 5 seconds
    setTimeout(() => {
      responseMsg.style.opacity = "0";
    }, 5000);
  });
}
