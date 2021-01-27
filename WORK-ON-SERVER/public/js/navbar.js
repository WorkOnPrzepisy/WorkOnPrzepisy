const toggleButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector(".nav-links");
const loginLogout = document.querySelector(".login-logout");

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    loginLogout.classList.toggle('active');
});