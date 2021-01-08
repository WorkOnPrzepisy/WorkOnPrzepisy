
const apiKey = "9973533";
const baseUrl = `https://www.themealdb.com/api/json/v2/${apiKey}/`;

const getIngredientSmallImgUrl = (ingredientStr) => {
    return `https://www.themealdb.com/images/ingredients/${ingredientStr}-Small.png`
};

const ingredientsSelected = [];
let finishUrl = "";
const resultsIds = [];

const categoriesListUrl = baseUrl + `list.php?c=list`;
const areasListUrl = baseUrl + `list.php?a=list`;
const ingredientsListUrl = baseUrl + `list.php?i=list`;

const searchInput = document.querySelector(".search-input");
const searchBtn1 = document.querySelector(".search-btn-1");
const hideFiltersBtn = document.querySelector(".hide-filters-btn");

let whichSelectActive = "";
const filters = document.querySelector(".filters");
const ingredientsSelect = document.querySelector("#meal-ingredients");
const categorySelect = document.querySelector("#meal-category");
const areaSelect = document.querySelector("#meal-area");

const ingredientsSelectedDiv = document.querySelector(".ingredients-selected");

const clearFiltersBtn = document.querySelector(".clear-filters-btn");
const searchBtn2 = document.querySelector(".search-btn-2");

const resultsInfo = document.querySelector(".results-info");
const results = document.querySelector(".results");
const resultsContentDiv = document.querySelector(".results-content");

const randomPickBtn = document.querySelector(".random-pick-btn");


const generateFullUrlRequest = (type, value) => {
    switch (type) {
        case "ingredients":
            return `${baseUrl}filter.php?i=${value}`
        
        case "category":
            return `${baseUrl}filter.php?c=${value}`

        case "area":
            return `${baseUrl}filter.php?a=${value}`

        case "name":
            return `${baseUrl}search.php?s=${value}`

        default:
            return null
    }
}

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
    const categoriesList = await getList(categoriesListUrl, "strCategory");
    const areasList = await getList(areasListUrl, "strArea");

    ingredientsList.sort();

    const fillSelect = (list, select) => {
        for (item of list) {
            const newItem = document.createElement("option");
            newItem.append(item);
            newItem.value = item;
            select.append(newItem);
        }
    };

    fillSelect(ingredientsList, ingredientsSelect);
    fillSelect(categoriesList, categorySelect);
    fillSelect(areasList, areaSelect);
}

(async () => {
    await fillSelects();
})();


const setEventListenerIngredients = async () => {
    ingredientsSelect.addEventListener("change", (changeEvent) => {
        whichSelectActive = "ingredients";
        if (ingredientsSelected.length === 0) {
            ingredientsSelectedDiv.innerHTML = "";
            clearFiltersBtn.disabled = false;
            searchInput.disabled = true;
            categorySelect.disabled = true;
            areaSelect.disabled = true;
            searchBtn2.disabled = false;
        }
        if (ingredientsSelected.length === 2) {
            ingredientsSelect.disabled = true;
        }
        const ingredientStr = changeEvent.target.value;
        ingredientsSelected.push(ingredientStr);
        showIngredientSmall(ingredientStr);
        ingredientsSelect.childNodes[1].selected = true;
    });
}

const showIngredientSmall = (ingredientStr) => {
    const newIngredientDiv = document.createElement("div");
    newIngredientDiv.className = "ingredient-selected";
    const newIngredientImg = document.createElement("img");
    const newIngredientP = document.createElement("p");
    newIngredientP.append(ingredientStr);
    newIngredientImg.src = getIngredientSmallImgUrl(ingredientStr);
    newIngredientDiv.append(newIngredientImg);
    newIngredientDiv.append(newIngredientP);
    ingredientsSelectedDiv.append(newIngredientDiv);
    for (option of ingredientsSelect.childNodes) {
        if (option.value === ingredientStr) {
            option.disabled = true;
        }
    }
}

(async () => {
    await setEventListenerIngredients();
})();

const setEventListenerCategory = () => {
    categorySelect.addEventListener("change", () => {
        ingredientsSelect.disabled = true;
        areaSelect.disabled = true;
        searchInput.disabled = true;
        searchBtn2.disabled = false;
        clearFiltersBtn.disabled = false;
        whichSelectActive = "category";
    });
}

setEventListenerCategory();

const setEventListenerArea = () => {
    areaSelect.addEventListener("change", () => {
        ingredientsSelect.disabled = true;
        categorySelect.disabled = true;
        searchInput.disabled = true;
        searchBtn2.disabled = false;
        clearFiltersBtn.disabled = false;
        whichSelectActive = "area";
    });
}

setEventListenerArea();

const setEventListenerSearchByName = () => {
    searchInput.addEventListener("input", (inputEvent) => {
        if (inputEvent.target.value !== "") {
            searchBtn1.disabled = false;
            ingredientsSelect.disabled = true;
            categorySelect.disabled = true;
            areaSelect.disabled = true;
        } else {
            searchBtn1.disabled = true;
            ingredientsSelect.disabled = false;
            categorySelect.disabled = false;
            areaSelect.disabled = false;
        }
    });
}

setEventListenerSearchByName();

setEventListenerSearchByNameBtn = async () => {
    searchBtn1.addEventListener("click", async () => {
        searchInput.disabled = true;
        searchBtn1.disabled = true;
        clearFiltersBtn.disabled = false;
        results.style.display = "inline";
        const urlRequest = generateFullUrlRequest("name", searchInput.value);
        const meals = await fetch(urlRequest);
        const mealsJson = await meals.json();
        createMeals(mealsJson);
    });
}

(async () => {
    await setEventListenerSearchByNameBtn();
})();


const createMeals = (mealsJson) => {
    if (mealsJson.meals) {
        if (mealsJson.meals.length > 1) {
            randomPickBtn.style.display = "block";    
        }
        for (meal of mealsJson.meals) {
            const mealDiv = document.createElement("div");
            mealDiv.className = "meal";
            const mealImg = document.createElement("img");
            const mealP = document.createElement("p");
            const mealDetails = document.createElement("button");
            mealDetails.innerText = "Details";
            mealDetails.type = "button"
            let strMeal = meal.strMeal;
            if (strMeal.length > 20) {
                strMeal = `${strMeal.substring(0, 20)}...`
            }
            mealP.append(strMeal);
            mealImg.src = `${meal.strMealThumb}/preview`;
            mealDiv.append(mealP);
            mealDiv.append(mealImg);
            mealDiv.append(mealDetails);
            resultsContentDiv.append(mealDiv);
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


const setEventListenerSearchBtn2 = async () => {
    searchBtn2.addEventListener("click", async () => {
        searchBtn2.disabled = true;
        results.style.display = "inline";
        let urlRequest;
        switch (whichSelectActive) {
            case "ingredients":
                urlRequest = generateFullUrlRequest(whichSelectActive, ingredientsSelected.join(","));
                ingredientsSelect.disabled = true;
                break;
            
            case "category":
                urlRequest = generateFullUrlRequest(whichSelectActive, categorySelect.value);
                categorySelect.disabled = true;
                break;
            
            case "area":
                urlRequest = generateFullUrlRequest(whichSelectActive, areaSelect.value);
                areaSelect.disabled = true;
                break;
            
            default: return null
        }
        const meals = await fetch(urlRequest);
        const mealsJson = await meals.json();
        createMeals(mealsJson);
    });
}

(async () => {
    await setEventListenerSearchBtn2();
})();


const setEventListenerHideFilters = () => {
    hideFiltersBtn.addEventListener("click", () => {
        if (hideFiltersBtn.innerText === "Hide filters") {
            hideFiltersBtn.innerText = "Show filters";
            filters.style.display = "none";
        } else {
            hideFiltersBtn.innerText = "Hide filters";
            filters.style.display = "inline";
        }
    });
}

setEventListenerHideFilters();

const setEventListenerClearFilters = () => {
    clearFiltersBtn.addEventListener("click", () => {
        ingredientsSelect.disabled = false;
        categorySelect.disabled = false;
        areaSelect.disabled = false;
        searchInput.disabled = false;
        ingredientsSelected.length = 0;
        const emptyInfo = document.createElement("p");
        emptyInfo.append("No ingredients selected");
        ingredientsSelectedDiv.innerHTML = "";
        ingredientsSelectedDiv.append(emptyInfo);
        categorySelect.childNodes[1].selected = true;
        areaSelect.childNodes[1].selected = true;
        searchBtn2.disabled = true;
        clearFiltersBtn.disabled = true;
        resultsIds.length = 0;
        resultsContentDiv.innerHTML = "";
        results.style.display = "none";
        searchInput.value = "";
        for (option of Array.prototype.slice.call(ingredientsSelect.childNodes).slice(2)) {
            option.disabled = false;
        }
        resultsInfo.innerText = "";
        randomPickBtn.style.display = "none";
    });
}

setEventListenerClearFilters();



