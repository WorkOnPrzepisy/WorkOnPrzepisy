import paginate from './paginate.js';
import meals from './data/meals.js';
import ingredientsList from './data/ingredients.js';
import areasList from './data/areas.js';
import categoriesList from './data/categories.js';

const IDS_WITHOUT_PREVIEW = [
    "52930",
    "52873",
    "52900",
    "52932"
];

const ingredientsSelected = [];
const resultsIds = [];
const mealsCreated = [];
let pages = {};

const searchInput = document.querySelector(".search-input");
const hideFiltersBtn = document.querySelector(".hide-filters-btn");
const clearFiltersBtn = document.querySelector(".clear-filters-btn");

const filters = document.querySelector(".filters");
const ingredientsSelect = document.querySelector("#meal-ingredients");
const categorySelect = document.querySelector("#meal-category");
const areaSelect = document.querySelector("#meal-area");

const ingredientsDatalist = document.querySelector("#ingredients");
const categoriesDatalist = document.querySelector("#categories");
const areasDatalist = document.querySelector("#areas");

const ingredientsSelectedDiv = document.querySelector(".ingredients-selected");

const resultsInfo = document.querySelector(".results-info");
const resultsContentDiv = document.querySelector(".results-content");

const paginationButtonsDiv = document.querySelector(".pagination-buttons");
const paginationPreviousBtn = document.querySelector(".previous-btn");
const paginationNextBtn = document.querySelector(".next-btn");
const pageInput = document.querySelector(".page-input");
const pagesNumberDiv = document.querySelector(".pages-number");

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

const cutStringIfTooLong = (text, maxLength) => {
    if (text.length > maxLength) {
        return `${text.substring(0, maxLength)}...`;
    }
    return text;
};

const addResultsInfo = (numberOfMealsToCreate) => {
    if (numberOfMealsToCreate === 0) {
        resultsInfo.innerText = "No results";
    } else if (numberOfMealsToCreate === 1) {
        resultsInfo.innerText = "1 Result:";
    } else {
        resultsInfo.innerText = `${numberOfMealsToCreate} Results:`;
    }
};

const updatePagination = () => {
    pages = paginate(mealsCreated.length);
    const {totalPages} = pages;

    if (totalPages < 2) {
        paginationButtonsDiv.style.display = "none";
    } else {
        paginationButtonsDiv.style.display = "flex";

        paginationPreviousBtn.onclick = () => {
            pages = paginate(mealsCreated.length, pages.currentPage - 1);

            if (pages.currentPage + 1 === pages.totalPages) {
                showMealsWithScroll();
            } else {
                showMeals();
            }

            pageInput.value = pages.currentPage;
        };
    
        paginationNextBtn.onclick = () => {
            pages = paginate(mealsCreated.length, pages.currentPage + 1);

            if (pages.currentPage === pages.totalPages) {
                showMealsWithScroll();
            }

            showMeals();
            pageInput.value = pages.currentPage;
        };
        
        pagesNumberDiv.innerText = `/ ${totalPages}`;
        pageInput.value = 1;
    }
};


const createMeals = (defaultMeals = false) => {
    mealsCreated.length = 0;
    resultsIds.length = 0;

    let mealsToCreate;
    if (defaultMeals) {
        mealsToCreate = meals;
    } else {
        mealsToCreate = mealsFilter();
    }

    const mealsNumber = mealsToCreate.length;
    if (mealsNumber < 2) {
        randomPickBtn.style.display = "none";
    } else {
        randomPickBtn.style.display = "block";
    }

    if (mealsNumber > 0) {
        for (let {strMeal, strMealThumb, idMeal} of mealsToCreate) {
            const mealDiv = document.createElement("div");
            const mealImg = document.createElement("img");
            const mealP = document.createElement("p");
            const mealDetails = document.createElement("button");

            mealDiv.className = "meal";
            mealDetails.innerText = "Details";
            mealDetails.type = "button";

            strMeal = cutStringIfTooLong(strMeal, 22);
            mealP.append(strMeal);

            if (IDS_WITHOUT_PREVIEW.includes(idMeal)) {
                mealImg.src = strMealThumb;
            } else {
                mealImg.src = `${strMealThumb}/preview`;
            }

            mealDiv.append(mealP);
            mealDiv.append(mealImg);
            mealDiv.append(mealDetails);
            mealsCreated.push(mealDiv);
            resultsIds.push(idMeal);
        }
    }
    
    addResultsInfo(mealsNumber);
    updatePagination();
}

const showMeals = () => {
    const {currentPage, endPage, startIndex, endIndex} = pages;
    resultsContentDiv.innerHTML = "";

    if (currentPage === 1) {
        paginationPreviousBtn.disabled = true;
    } else {
        paginationPreviousBtn.disabled = false;
    }

    if (currentPage === endPage) {
        paginationNextBtn.disabled = true;
    } else {
        paginationNextBtn.disabled = false;
    }

    const mealsToShow = mealsCreated.slice(startIndex, endIndex + 1);
    for (const meal of mealsToShow) {
        resultsContentDiv.append(meal);
    }
}

const showMealsWithScroll = () => {
    // set distance from bottom border of the window same as before
    const windowScrollYBefore = window.scrollY;
    const documentBodyOffsetHeightBefore = document.body.offsetHeight;
    showMeals();
    const difference = document.body.offsetHeight - documentBodyOffsetHeightBefore;
    window.scrollTo(0, windowScrollYBefore + difference);
};

createMeals(true);
showMeals();

const mealsFilter = () => {
    return meals.filter(({ingredients, strMeal, strCategory, strArea}) => {
        let value = true;
        const ingredientsNames = ingredients.map(({name}) => {
            return name;
        });

        for (const ingredient of ingredientsSelected) {
            if (!ingredientsNames.includes(ingredient)) {
                value = false;
                break;
            }
        }

        return (
            (strMeal.toLowerCase().includes(searchInput.value.toLocaleLowerCase()) || searchInput.value === "") &&
            (value || ingredientsSelected.length === 0) &&
            (strCategory === categorySelect.value || categorySelect.value === "") &&
            (strArea === areaSelect.value || areaSelect.value === "")
        )
    });
}

const checkIfDisableClearBtn = () => {
    if (searchInput.value === "" && ingredientsSelected.length === 0 && categorySelect.value === "" && areaSelect.value === "") {
        clearFiltersBtn.disabled = true;
    } else {
        clearFiltersBtn.disabled = false;
    }
}

const checkIfDisableInputs = () => {
    if (mealsCreated.length < 2) {
        for (const input of [searchInput, ingredientsSelect, categorySelect, areaSelect]) {
            if (input.value === "") {
                input.disabled = true;
            }
        }
    }
};

const checkIfEnableInputs = () => {
    if (mealsCreated.length > 1) {
        for (const input of [searchInput, ingredientsSelect, categorySelect, areaSelect]) {
            input.disabled = false;
        }
    }
}

ingredientsSelect.onchange = () => {
    const ingredientSelectValue = ingredientsSelect.value;
    ingredientsSelect.value = "";

    if (ingredientsList.includes(ingredientSelectValue)) {
        if (ingredientsSelected.length === 0) {
            ingredientsSelectedDiv.innerHTML = "";
            clearFiltersBtn.disabled = false;
        }
        if (ingredientsSelected.length === 2) {
            ingredientsSelect.disabled = true;
        }
        ingredientsSelected.push(ingredientSelectValue);
        showIngredientSmall(ingredientSelectValue);
        createMeals();
        showMeals();
        checkIfDisableInputs();
    }
};

const getIngredientSmallImgUrl = (ingredientStr) => {
    return `https://www.themealdb.com/images/ingredients/${ingredientStr}-Small.png`
};

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
        ingredientsSelected.splice(ingredientsSelected.indexOf(ingredientStr), 1);
        if (mealsCreated.length > 1) {
            ingredientsSelect.disabled = false;
        }
        for (const option of ingredientsDatalist.childNodes) {
            if (option.value === ingredientStr) {
                option.disabled = false;
                break;
            }
        }
        newIngredientDiv.remove();
        if (ingredientsSelected.length === 0) {
            const emptyInfo = document.createElement("p");
            emptyInfo.className = "ingredients-empty-info";
            emptyInfo.append("No ingredients selected");
            ingredientsSelectedDiv.innerHTML = "";
            ingredientsSelectedDiv.append(emptyInfo);
        }
        createMeals();
        showMeals();
        checkIfDisableClearBtn();
        checkIfEnableInputs();
    };
    ingredientsSelectedDiv.append(newIngredientDiv);
    for (const option of ingredientsDatalist.childNodes) {
        if (option.value === ingredientStr) {
            option.disabled = true;
            break;
        }
    }
}

searchInput.oninput = () => {
    createMeals();
    if (mealsCreated.length < 2) {
        searchInput.maxLength = searchInput.value.length;
    } else {
        searchInput.removeAttribute("maxlength");
    }
    showMeals();
    checkIfDisableClearBtn();
    checkIfDisableInputs();
    checkIfEnableInputs();
};

searchInput.onfocus = () => {
    searchInput.placeholder = "";
    searchInput.style.fontWeight = "normal";
    if (mealsCreated.length === 0) {
        searchInput.maxLength = searchInput.value.length;
    }
};

searchInput.onblur = () => {
    searchInput.placeholder = "Filter by name";
    if (searchInput.value !== "") {
        searchInput.style.fontWeight = "bold";
    }
    searchInput.removeAttribute("maxlength");
};

const selectClickHandle = (select) => {
    select.value = "";
    select.style.fontWeight = "normal";
    createMeals();
    showMeals();
    checkIfDisableClearBtn();
    checkIfEnableInputs();
    checkIfDisableInputs();
};

categorySelect.onclick = () => {
    selectClickHandle(categorySelect);
};

areaSelect.onclick = () => {
    selectClickHandle(areaSelect);
};

const changeSelectHandler = (select, list) => {
    const selectValue = select.value;
    if (selectValue !== "") {
        select.style.fontWeight = "bold";
    }
    if (list.includes(selectValue)) {
        clearFiltersBtn.disabled = false;
    } else {
        select.value = "";
    }
    createMeals();
    showMeals();
    checkIfDisableClearBtn();
    checkIfDisableInputs();
}

categorySelect.onchange = () => {
    changeSelectHandler(categorySelect, categoriesList);
};

areaSelect.onchange = () => {
    changeSelectHandler(areaSelect, areasList);
};

hideFiltersBtn.onclick = () => {
    if (hideFiltersBtn.innerText === "Hide filters") {
        hideFiltersBtn.innerText = "Show filters";
    } else {
        hideFiltersBtn.innerText = "Hide filters";
    }
    filters.classList.toggle("hidden");
};

clearFiltersBtn.onclick = () => {
    clearFiltersBtn.disabled = true;
    ingredientsSelected.length = 0;
    resultsIds.length = 0;
    resultsInfo.innerText = "";
    mealsCreated.length = 0;

    for (const input of [searchInput, ingredientsSelect, categorySelect, areaSelect]) {
        input.disabled = false;
        input.value = "";
        input.style.fontWeight = "normal";
    }

    const emptyInfo = document.createElement("p");
    emptyInfo.className = "ingredients-empty-info";
    emptyInfo.innerText = "No ingredients selected";
    ingredientsSelectedDiv.innerHTML = "";
    ingredientsSelectedDiv.append(emptyInfo);

    for (const option of ingredientsDatalist.childNodes){
        if (option.disabled === true) {
            option.disabled = false;
        }
    }

    createMeals(true);
    showMeals();
};

pageInput.oninput = () => {
    const pageInputValue = pageInput.value;
    const totalPages = pages.totalPages;

    if (pageInputValue !== "") {
        if (parseInt(pageInputValue) > totalPages) {
            pageInput.value = totalPages;
        }
        if (parseInt(pageInputValue) < 1) {
            pageInput.value = 1;
        }
        const lastPage = pages.currentPage;
        pages = paginate(mealsCreated.length, parseInt(pageInput.value));
        if (lastPage === pages.totalPages) {
            showMealsWithScroll();
        } else {
            if (pages.currentPage === pages.totalPages) {
                showMealsWithScroll();
            } else {
                showMeals();
            }
        }

    }
};

pageInput.onblur = () => {
    const currentPage = pages.currentPage;
    if (parseInt(pageInput.value) !== currentPage) {
        pageInput.value = currentPage;
    }
};

pageInput.onclick = () => {
    pageInput.value = "";
}

