
const apiKey = "9973533"
const baseUrl = `https://www.themealdb.com/api/json/v2/${apiKey}/`



const categoriesListUrl = baseUrl + `list.php?c=list`;
const areasListUrl = baseUrl + `list.php?a=list`;
const ingredientsListUrl = baseUrl + `list.php?i=list`;


const searchInput = document.querySelector(".search-input");
const searchBtn1 = document.querySelector(".search-btn-1");
const hideFiltersBtn = document.querySelector(".hide-filters-btn");

const mealIngredientsSelect = document.querySelector("#meal-ingredients");
const mealCategorySelect = document.querySelector("#meal-category");
const mealAreaSelect = document.querySelector("#meal-area");

const searchIngredientsDiv = document.querySelector(".search-ingredients");

const clearFiltersBtn = document.querySelector(".clear-filters-btn");
const searchBtn2 = document.querySelector(".search-btn-2");

const resultsContentDiv = document.querySelector(".results-content");

const randomPickBtn = document.querySelector(".random-pick-btn");


const getList = async (ListUrl, strName) => {
    const response = await fetch(ListUrl);
    const items = await response.json();
    const itemsArray = await items.meals.map((item) => {
        return item[strName]
    });
    return itemsArray
}

const fillSelects = async () => {
    const ingredientsList = await getList(ingredientsListUrl, "strIngredient");
    const categoriesList = await getList(categoriesListUrl, "strCategory")
    const areasList = await getList(areasListUrl, "strArea");

    ingredientsList.sort();
    for (ingredient of ingredientsList) {
        const newIngredient = document.createElement("option");
        newIngredient.append(ingredient);
        mealIngredientsSelect.append(newIngredient);
    }

    for (category of categoriesList) {
        const newCategory = document.createElement("option");
        newCategory.append(category);
        mealCategorySelect.append(newCategory);
    }

    for (area of areasList) {
        const newArea = document.createElement("option");
        newArea.append(area);
        mealAreaSelect.append(newArea);
    }
}


fillSelects();




