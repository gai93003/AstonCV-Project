// ========== NAVIGATION SMOOTH SCROLL ==========
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if(navLinks.classList.contains('active')) navLinks.classList.remove('active');
  });
});

// ========== MOBILE HAMBURGER TOGGLE ==========
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  for (let i = 0; i < 3; i++) {
    const bar = document.createElement('div');
    hamburger.appendChild(bar);
  }
  document.querySelector('.navbar').appendChild(hamburger);

  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });
});

// ========== TABS FUNCTIONALITY ==========
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});


// ====================  FORM SUBMISSION =================
document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.querySelector("input[type=text]").value,
    email: e.target.querySelector("input[type=email]").value,
    message: e.target.querySelector("textarea").value,
  };

  try {
    const response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.success) {
      alert("Message saved successfully!");
      e.target.reset();
    } else {
      alert("Failed to save message.");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending message.");
  }
});
