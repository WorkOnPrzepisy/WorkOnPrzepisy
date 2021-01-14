const toggleButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector(".nav-links");
const loginLogout = document.querySelector(".login-logout");
const nav = document.querySelector(".nav");

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    loginLogout.classList.toggle('active');
    nav.classList.toggle('active');
    toggleButton.classList.toggle('clicked');
});