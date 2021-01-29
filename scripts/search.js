const term = 'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata'
const formSearch = document.querySelector('#search-form')
const inputSearch = document.querySelector('#search-input')
const valueContainer = document.querySelector('#search-ul')
    // API
const randomMeal = 'https://www.themealdb.com/api/json/v1/1/random.php'
const allMeals = 'https://www.themealdb.com/api/json/v1/1/categories.php'



//###########################################
// Kamila Needed variable declaration
let idInMeals = '';

window.addEventListener('DOMContentLoaded', async(event) => {

    const api = await fetch(allMeals)
    const json = await api.json()
    const allMeal = json.categories



    // const size = 3;
    // const items = allMeal.slice(0, size)

    const random = Math.floor(Math.random() * allMeal.length)
    const random1 = Math.floor(Math.random() * allMeal.length)
    const random2 = Math.floor(Math.random() * allMeal.length)

    const radomMeal = allMeal[random]
    const randomMeal1 = allMeal[random1]
    const randomMeal2 = allMeal[random2]

    // Images links
    const img = document.querySelector('#new-image-content')
    const img2 = document.querySelector('#new-image-content-2')
    const img3 = document.querySelector('#new-image-content-3')

    // Header Names of Disehs
    const header1 = document.querySelector('#dish-name1')
    const header2 = document.querySelector('#dish-name2')
    const header3 = document.querySelector('#dish-name3')

    // Pictues
    img.src = radomMeal.strCategoryThumb
    img2.src = randomMeal1.strCategoryThumb
    img3.src = randomMeal2.strCategoryThumb

    // Headings

    header1.textContent = radomMeal.strCategory
    header2.textContent = randomMeal1.strCategory
    header3.textContent = randomMeal2.strCategory

    //###########################################
    // Kamila get Id form randomMeal
    const apiRandomMeal = await (await fetch(randomMeal)).json();
    idInMeals += apiRandomMeal.meals[0].idMeal;

})


formSearch.addEventListener('submit', async(e) => {


    e.preventDefault()
    const inputValue = inputSearch.value
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
    const result = await resp.json()

    result.meals.forEach((item) => {
        // To finish
        console.log(item);

    })

})

//############################################
//Kamila data transfer via href
const moreRecipeToAnotherPage = document.querySelector('main'); // main div must have class="main" !!

//console.log(moreRecipeToAnotherPage);

moreRecipeToAnotherPage.addEventListener('click', e => {
    if (e.target.tagName === "BUTTON" && e.target.classList.contains("button-more-recipe")) {

        //e.preventDefault();
        //console.log(0, e.target);
        //console.log(1, e.target.classList[0]);
        const buttonTarget = e.target;
        //console.log(1.2, buttonTarget);
        const whichButton = buttonTarget.parentNode;
        //console.log(2, whichButton);
        const hrefInA = whichButton.href;
        const idInMealsWith = `&${idInMeals}`;
        //console.log(3, hrefInA);
        const other = `${hrefInA}${idInMealsWith}`;
        //console.log(4, whichButton);
        whichButton.href = other;
        //console.log(5, other);
        //console.log(6, idInMealsWith);
    }
})