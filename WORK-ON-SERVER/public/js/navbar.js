const toggleButton = document.querySelector(".toggle-button");
const nav = document.querySelector(".nav");

toggleButton.onclick = () => {
    nav.classList.toggle('active');
}

const getData = (key) => {
    if (!localStorage) return;

    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        console.error(`error getting item ${key} to localStorage`, err);
    }
}

const displayBasket = () => {
    countBasketRecipeP = document.querySelector('#countBasketRecipeP');
    const local = getData('Recipe');
    if (local === null) {
        countBasketRecipeP.innerText = 0;
    } else {
        const countBasketRecipePInnerText = local.length;
        countBasketRecipeP.innerText = countBasketRecipePInnerText.toString();
    }

}

displayBasket();

// temporary functions for fake log in and log out

// const loginButton = document.querySelector(".login-signup a");
// const logoutButton = document.querySelector(".logout a");

// const forLogged = document.querySelectorAll(".for-logged");
// const forUnlogged = document.querySelector(".for-unlogged");

// const handleLogin = (forLoggedDisplay, forUnloggedDisplay) => {
//     for (const node of forLogged) node.style.display = forLoggedDisplay;
//     forUnlogged.style.display = forUnloggedDisplay;
// };

// loginButton.onclick = () => {
//     handleLogin("flex", "none");
// }

// logoutButton.onclick = () => {
//     handleLogin("none", "flex");
// }