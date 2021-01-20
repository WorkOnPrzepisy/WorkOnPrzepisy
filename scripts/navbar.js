const toggleButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector(".nav-links");
const nav = document.querySelector(".nav");

toggleButton.onclick = () => {
    navLinks.classList.toggle('active');
    nav.classList.toggle('active');
    toggleButton.classList.toggle('clicked');
}

const loginButton = document.querySelector(".login");
const logoutButton = document.querySelector(".logout");

const forLogged = document.querySelectorAll(".for-logged");
const forUnlogged = document.querySelector(".for-unlogged");

toggleInvisible = () => {
    for (const node of forLogged) {
        node.classList.toggle("invisible");
    }
    forUnlogged.classList.toggle("invisible");
}

loginButton.onclick = () => {
    toggleInvisible();
}

logoutButton.onclick = () => {
    toggleInvisible();
}

