import paginate from './paginate.js';
import meals from './data/meals.js';
import ingredientsList from './data/ingredients.js';
import areasList from './data/areas.js';
import categoriesList from './data/categories.js';

const getIngredientSmallImgUrl = (ingredientStr) => {
    return `https://www.themealdb.com/images/ingredients/${ingredientStr}-Small.png`
};

const ingredientsSelected = [];
const resultsIds = [];
const mealsCreated = [];
let pages = {};

const searchInput = document.querySelector(".search-input");
const hideFiltersBtn = document.querySelector(".hide-filters-btn");

const filters = document.querySelector(".filters");
const ingredientsSelect = document.querySelector("#meal-ingredients");
const categorySelect = document.querySelector("#meal-category");
const areaSelect = document.querySelector("#meal-area");

const ingredientsDatalist = document.querySelector("#ingredients");
const categoriesDatalist = document.querySelector("#categories");
const areasDatalist = document.querySelector("#areas");

const ingredientsSelectedDiv = document.querySelector(".ingredients-selected");

const clearFiltersBtn = document.querySelector(".clear-filters-btn");

const resultsInfo = document.querySelector(".results-info");
const results = document.querySelector(".results");
const resultsContentDiv = document.querySelector(".results-content");
const paginationButtonsDiv = document.querySelector(".pagination-buttons");

const randomPickBtn = document.querySelector(".random-pick-btn");

const fillSelect = (list, select) => {
    for (const item of list) {
        const newItem = document.createElement("option");
        newItem.value = item;
        select.append(newItem);
    }
};

ingredientsList.sort();
fillSelect(ingredientsList, ingredientsDatalist);
fillSelect(categoriesList, categoriesDatalist);
fillSelect(areasList, areasDatalist);

const createMeals = (mealsToCreate) => {
    if (mealsToCreate.length > 0) {
        if (mealsToCreate.length > 1) {
            randomPickBtn.style.display = "block";    
        }
        for (const meal of mealsToCreate) {
            const mealDiv = document.createElement("div");
            mealDiv.className = "meal";
            const mealImg = document.createElement("img");
            const mealP = document.createElement("p");
            const mealDetails = document.createElement("button");
            mealDetails.innerText = "Details";
            mealDetails.type = "button"
            let strMeal = meal.strMeal;
            if (strMeal.length > 22) {
                strMeal = `${strMeal.substring(0, 22)}...`
            }
            mealP.append(strMeal);
            const imgUrl = `${meal.strMealThumb}/preview`;
            mealImg.src = imgUrl;
            if (meal.idMeal === "52930" || meal.idMeal === "52873" || meal.idMeal === "52900" || meal.idMeal === "52932") {
                mealImg.src = meal.strMealThumb
            }
            mealDiv.append(mealP);
            mealDiv.append(mealImg);
            mealDiv.append(mealDetails);
            mealsCreated.push(mealDiv);
            resultsIds.push(meal.idMeal);
        }
        if (resultsIds.length === 1) {
            resultsInfo.innerText = `${resultsIds.length} Result:`;
        } else {
            resultsInfo.innerText = `${resultsIds.length} Results:`;
        }
    } else {
        resultsInfo.innerText = "No results";
    }
}

const showMeals = () => {
    resultsContentDiv.innerHTML = "";
    paginationButtonsDiv.innerHTML = "";

    if (Object.keys(pages).length === 0) {
        pages = paginate(mealsCreated.length);
    }

    if (pages.totalPages !== 1 && mealsCreated.length > 0) {
        const prevButton = document.createElement('button');
        prevButton.innerText = '<';
        prevButton.onclick = () => {
            pages = paginate(mealsCreated.length, pages.currentPage-1);
            showMeals();
        };
    
        if (pages.currentPage === 1) {
            prevButton.disabled = true;
        }
    
        paginationButtonsDiv.append(prevButton);
    }

    if (pages.pages.length > 1) {
        for (const pageNr of pages.pages) {
            const paginationButton = document.createElement('button');
            paginationButton.innerText = pageNr;
            paginationButton.onclick = () => {
                pages = paginate(mealsCreated.length, pageNr);
                showMeals();
            };
            if (pageNr === pages.currentPage) {
                paginationButton.disabled = true;
                paginationButton.classList.toggle("active");
            }
            paginationButtonsDiv.append(paginationButton);
        }
    }

    if (pages.totalPages !== 1 && mealsCreated.length > 0) {
        const nextButton = document.createElement('button');
        nextButton.innerText = '>';
        nextButton.onclick = () => {
            pages = paginate(mealsCreated.length, pages.currentPage+1);
            showMeals();
        };
    
        if (pages.currentPage === pages.endPage) {
            nextButton.disabled = true;
        }
    
        paginationButtonsDiv.append(nextButton);
    }

    const mealsToShow = mealsCreated.slice(pages.startIndex, pages.endIndex+1);
    for (const meal of mealsToShow) {
        resultsContentDiv.append(meal);
    }
}

const changeResults = () => {
    randomPickBtn.style.display = "none";
    pages = {};
    results.style.display = "inline";
    mealsCreated.length = 0;
    let mealsToCreate = [];
    resultsIds.length = 0;
    paginationButtonsDiv.innerHTML = "";

    mealsToCreate = mealsFilter();
    createMeals(mealsToCreate);
    showMeals();
}

results.style.display = "inline";
createMeals(meals);
showMeals();

const mealsFilter = () => {
    const mealsToCreate = meals.filter((meal) => {
        let value = true;
        const ingredientsNames = meal.ingredients.map((ingredient) => {
            return ingredient.name
        });
        for (const ingredient of ingredientsSelected) {
            if (!ingredientsNames.includes(ingredient)) {
                value = false;
                break
            }
        }
        return (
            (meal.strMeal.toLowerCase().includes(searchInput.value.toLocaleLowerCase()) || searchInput.value === "") &&
            (value || ingredientsSelected.length === 0) &&
            (meal.strCategory === categorySelect.value || categorySelect.value === "") &&
            (meal.strArea === areaSelect.value || areaSelect.value === "")
        )
    });
    return mealsToCreate;
}

const checkIfDisableClearBtn = () => {
    if (searchInput.value === "" && ingredientsSelected.length === 0 && categorySelect.value === "" && areaSelect.value === "") {
        clearFiltersBtn.disabled = true;
    }
}

ingredientsSelect.addEventListener("change", (changeEvent) => {
    let containIngredient = false;
    for (const ingredient of ingredientsList) {
        if (changeEvent.target.value === ingredient) {
            containIngredient = true;
        }
    }
    if (containIngredient) {
        if (ingredientsSelected.length === 0) {
            ingredientsSelectedDiv.innerHTML = "";
            clearFiltersBtn.disabled = false;
        }
        if (ingredientsSelected.length === 2) {
            ingredientsSelect.disabled = true;
        }
        const ingredientStr = changeEvent.target.value;
        ingredientsSelected.push(ingredientStr);
        showIngredientSmall(ingredientStr);
        ingredientsSelect.value = "";
    } else {
        changeEvent.target.value = "";
    }
    changeResults();
});

const showIngredientSmall = (ingredientStr) => {
    const newIngredientDiv = document.createElement("div");
    newIngredientDiv.className = "ingredient-selected";
    const newIngredientImg = document.createElement("img");
    const newIngredientP = document.createElement("p");
    newIngredientP.append(ingredientStr);
    newIngredientImg.src = getIngredientSmallImgUrl(ingredientStr);
    newIngredientDiv.append(newIngredientImg);
    newIngredientDiv.append(newIngredientP);
    newIngredientDiv.onclick = () => {
        ingredientsSelected.splice(ingredientsSelected.indexOf(newIngredientP.innerHTML), 1);
        ingredientsSelect.disabled = false;
        for (const option of ingredientsDatalist.childNodes) {
            if (option.value === newIngredientP.innerHTML) {
                option.disabled = false;
                break;
            }
        }
        newIngredientDiv.remove();
        changeResults();
        checkIfDisableClearBtn();
        if (ingredientsSelected.length === 0) {
            const emptyInfo = document.createElement("p");
            emptyInfo.className = "ingredients-empty-info";
            emptyInfo.append("No ingredients selected");
            ingredientsSelectedDiv.innerHTML = "";
            ingredientsSelectedDiv.append(emptyInfo);
        }

    };
    ingredientsSelectedDiv.append(newIngredientDiv);
    for (const option of ingredientsDatalist.childNodes) {
        if (option.value === ingredientStr) {
            option.disabled = true;
            break;
        }
    }
}

window.addEventListener("click", (clickEvent) => {
    if (clickEvent.target === categorySelect || clickEvent.target === areaSelect) {
        clickEvent.target.value = "";
        changeResults();
        checkIfDisableClearBtn();
    }
});

window.addEventListener("change", (changeEvent) => {
    if (changeEvent.target === categorySelect || changeEvent.target === areaSelect) {
        let list;
        if (changeEvent.target === categorySelect) {
            list = categoriesList;
        } else {
            list = areasList;
        }
        
        let containItem = false;
        for (const item of list) {
            if (changeEvent.target.value === item) {
                containItem = true;
                break;
            }
        }
        if (containItem) {
            clearFiltersBtn.disabled = false;
        } else {
            changeEvent.target.value = "";
        }
        changeResults();
        checkIfDisableClearBtn();
    }
});

searchInput.addEventListener("input", (inputEvent) => {
        pages = {};
        clearFiltersBtn.disabled = false;
        results.style.display = "inline";
        resultsIds.length = 0;
        mealsCreated.length = 0;
        paginationButtonsDiv.innerHTML = "";
        const mealsToCreate = mealsFilter();
        createMeals(mealsToCreate);
        showMeals();
        checkIfDisableClearBtn();
    });

hideFiltersBtn.addEventListener("click", () => {
    if (hideFiltersBtn.innerText === "Hide filters") {
        hideFiltersBtn.innerText = "Show filters";
        filters.classList.toggle("hidden");
    } else {
        hideFiltersBtn.innerText = "Hide filters";
        filters.classList.toggle("hidden");
    }
});

clearFiltersBtn.addEventListener("click", () => {
    ingredientsSelect.disabled = false;
    ingredientsSelect.value = "";
    categorySelect.disabled = false;
    categorySelect.value = "";
    areaSelect.disabled = false;
    areaSelect.value = "";
    searchInput.disabled = false;
    ingredientsSelected.length = 0;
    const emptyInfo = document.createElement("p");
    emptyInfo.className = "ingredients-empty-info";
    emptyInfo.append("No ingredients selected");
    ingredientsSelectedDiv.innerHTML = "";
    ingredientsSelectedDiv.append(emptyInfo);
    clearFiltersBtn.disabled = true;
    resultsIds.length = 0;
    searchInput.value = "";
    for (const option of Array.prototype.slice.call(ingredientsDatalist.childNodes)){
        option.disabled = false;
    }
    resultsInfo.innerText = "";
    mealsCreated.length = 0;
    pages = {};
    paginationButtonsDiv.innerHTML = "";
    
    createMeals(meals);
    showMeals();
});

