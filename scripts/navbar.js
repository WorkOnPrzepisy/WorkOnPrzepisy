const toggleButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector(".nav-links");
const nav = document.querySelector(".nav");

toggleButton.onclick = () => {
    navLinks.classList.toggle('active');
    nav.classList.toggle('active');
    toggleButton.classList.toggle('clicked');
}

const loginButton = document.querySelector(".login-signup a");
const logoutButton = document.querySelector(".logout a");

const forLogged = document.querySelectorAll(".for-logged");
const forUnlogged = document.querySelector(".for-unlogged");

handleLogin = () => {
    for (const node of forLogged) {
        node.style.display = "flex";
    }
    forUnlogged.style.display = "none";
};

handleLogout = () => {
    for (const node of forLogged) {
        node.style.display = "none";
    }
    forUnlogged.style.display = "flex";
};


loginButton.onclick = () => {
    handleLogin();
}

logoutButton.onclick = () => {
    handleLogout();
}

