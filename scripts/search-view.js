import paginate from './paginate.js';
import ingredients from '../data/ingredients.js';
import categories from '../data/categories.js';
import areas from '../data/areas.js';

const IDS_WITHOUT_PREVIEW = [
    "52930",
    "52873",
    "52900",
    "52932"
];

let ingredientsSelected = [];
const resultsIds = [];
const mealsCreated = [];
let pages;
let timer;

const mealIdInput = document.querySelector(".meal-id");
const searchForm = document.querySelector(".search-form");
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

const results = document.querySelector(".results");
const resultsInfo = document.querySelector(".results-info");
const resultsContentDiv = document.querySelector(".results-content");

const paginationButtonsDivs = document.querySelectorAll(".pagination-buttons");
const paginationPreviousBtns = document.querySelectorAll(".previous-btn");
const paginationNextBtns = document.querySelectorAll(".next-btn");
const pageInputs = document.querySelectorAll(".page-input");
const pagesNumberDivs = document.querySelectorAll(".pages-number");

const randomPickBtn = document.querySelector(".random-pick-btn");

const capitalizeFirstLetters = (words) => (
    words
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
);

const fillSelect = (list, select) => {
    for (const item of list) {
        const newItem = document.createElement("option");
        newItem.value = capitalizeFirstLetters(item);
        select.append(newItem);
    }
};


fillSelect(ingredients, ingredientsDatalist);
fillSelect(categories, categoriesDatalist);
fillSelect(areas, areasDatalist);

const cutStringIfTooLong = (text, maxLength) => 
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

const addResultsInfo = (numberOfMealsToCreate) => {
    resultsInfo.innerText = numberOfMealsToCreate === 0 ? 
        "No results" : numberOfMealsToCreate === 1 ? 
        "1 meal:" : `${numberOfMealsToCreate} meals:`;
};

const changePageButtonHandler = (next=true) => {
    const pageSwitch = next ? 1 : -1;
    makeInvisible(resultsContentDiv);

    pages = paginate(mealsCreated.length, pages.currentPage + pageSwitch);
    for (const node of pageInputs) {
        node.value = pages.currentPage;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
        showMealsWithScroll();
    }, 500);

};

const paginationButtonHandler = (btns) => {
    const next = btns === paginationNextBtns ? true : false;
    btns.forEach((node, index) => {
        node.onclick = () => {
            changePageButtonHandler(next);
            if (index === 1) {
                searchInput.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
};

const updatePagination = () => {
    pages = paginate(mealsCreated.length);
    const {totalPages} = pages;

    if (totalPages < 2) {
        for (const node of paginationButtonsDivs) {
            node.style.display = "none";
        }
    } else {
        for (const node of paginationButtonsDivs) {
            node.style.display = "flex";
        }

        paginationButtonHandler(paginationPreviousBtns);
        paginationButtonHandler(paginationNextBtns);

        for (const node of pagesNumberDivs) {
            node.innerText = `/ ${totalPages}`;
        }

        for (const node of pageInputs) {
            node.value = 1;
        }
    }
};
const getMeals = async () => {

    const baseUrl = "http://localhost:3000/meals/meals?";
    const nameUrl = "name=";
    const ingredientsUrl = "&ingredients=";
    const categoryUrl = "&category=";
    const areaUrl = "&area=";

    const fullUrl = baseUrl + nameUrl + searchInput.value + 
        ingredientsUrl + ingredientsSelected.join(",") + 
        categoryUrl + categorySelect.value + areaUrl + areaSelect.value;

    return fetch(fullUrl).then((response) => response.json())

}

const createMeals = async () => {
    mealsCreated.length = 0;
    resultsIds.length = 0;
    
    return getMeals().then((mealsToCreate) => {
        const mealsNumber = mealsToCreate.length;
        randomPickBtn.style.display = mealsNumber < 2 ? "none" : "block";
        const innerMealsCreated = [];
    
        if (mealsNumber > 0) {
            for (let {name, imageUrl, _id} of mealsToCreate) {
                const mealDiv = document.createElement("div");
                const mealImg = document.createElement("img");
                const mealP = document.createElement("p");
                const mealButton = document.createElement("button");
    
                mealDiv.className = "meal";
                mealButton.innerText = "Details";
                mealButton.type = "button";
                mealButton.onclick = () => {
                    mealIdInput.value = _id;
                    searchForm.submit();
                };
    
                name = cutStringIfTooLong(name, 22);
                mealP.append(name);
    
                mealImg.src = IDS_WITHOUT_PREVIEW.includes(_id) ? imageUrl : `${imageUrl}/preview`; 
    
                mealDiv.append(mealP);
                mealDiv.append(mealImg);
                mealDiv.append(mealButton);
                innerMealsCreated.push(mealDiv);
                mealsCreated.push(mealDiv);
                resultsIds.push(_id);
            }
        }
        
        addResultsInfo(mealsNumber);
        updatePagination();

        return innerMealsCreated;
    })
}

const showMeals = () => {
    if (results.classList.contains("invisible")) results.classList.toggle("invisible");

    const {currentPage, endPage, startIndex, endIndex} = pages;


    for (const node of paginationPreviousBtns) 
        node.disabled = currentPage === 1 ? true : false;
    

    for (const node of paginationNextBtns) 
        node.disabled = currentPage === endPage ? true : false;
    

    const mealsToShow = mealsCreated.slice(startIndex, endIndex + 1);

    resultsContentDiv.innerHTML = "";
    for (const meal of mealsToShow) resultsContentDiv.append(meal);
    
}

const showMealsWithScroll = () => {
    resultsContentDiv.classList.toggle("invisible");

    // set distance from bottom border of the window same as before
    const windowScrollYBefore = window.scrollY;
    const documentBodyOffsetHeightBefore = document.body.offsetHeight;
    showMeals();
    const difference = document.body.offsetHeight - documentBodyOffsetHeightBefore;
    window.scrollTo(0, windowScrollYBefore + difference);
};

createMeals()
.then(
    () => {
        showMeals();
    }
)

const checkIfDisableClearBtn = () => {
    clearFiltersBtn.disabled = 
            searchInput.value === "" &&
            ingredientsSelected.length === 0 && 
            categorySelect.value === "" && 
            areaSelect.value === "" 
                ? true : false;
}

const checkIfDisableInputs = () => {
    if (mealsCreated.length < 2) {
        for (const input of [searchInput, ingredientsSelect, categorySelect, areaSelect]) {
            if (input.value === "") input.disabled = true;
        }
    }
};

const checkIfEnableInputs = () => {
    if (mealsCreated.length > 1) {
        for (const input of [searchInput, ingredientsSelect, categorySelect, areaSelect]) 
            input.disabled = false;
    }
}

ingredientsSelect.onchange = () => {
    const ingredientSelectValue = ingredientsSelect.value.toLowerCase();
    ingredientsSelect.value = "";

    if (ingredients.includes(ingredientSelectValue)) {
            if (ingredientsSelected.length === 0) {
                clearFiltersBtn.disabled = false;
                ingredientsSelectedDiv.classList.toggle("invisible");
            }
            if (ingredientsSelected.length === 2) ingredientsSelect.disabled = true;

        ingredientsSelected.push(ingredientSelectValue);
        showIngredientSmall(ingredientSelectValue);

        makeInvisible(results);

        clearTimeout(timer);
        timer = setTimeout(() => {
            createMeals().then(() => {
                showMeals();
                checkIfDisableInputs();
            })
        }, 500);
    }
};

const getIngredientSmallImgUrl = (ingredientStr) => 
    `https://www.themealdb.com/images/ingredients/${ingredientStr}-Small.png`;

const showIngredientSmall = (ingredientStr) => {
    const newIngredientDiv = document.createElement("div");
    newIngredientDiv.className = "ingredient-selected";
    const newIngredientImg = document.createElement("img");
    const newIngredientP = document.createElement("p");
    const ingredientStrUpper = capitalizeFirstLetters(ingredientStr);
    newIngredientP.append(ingredientStrUpper);
    newIngredientImg.src = getIngredientSmallImgUrl(ingredientStr);
    newIngredientDiv.append(newIngredientImg);
    newIngredientDiv.append(newIngredientP);
    newIngredientDiv.onclick = () => {
        ingredientsSelected = ingredientsSelected.filter((ingredient) => 
            ingredient !== ingredientStr);
        if (ingredientsSelected.length === 0) ingredientsSelectedDiv.classList.toggle("invisible");
        if (mealsCreated.length > 1) ingredientsSelect.disabled = false;
        for (const option of ingredientsDatalist.childNodes) {
            if (option.value) {
                if (option.value.toLowerCase() === ingredientStr) {
                    option.disabled = false;
                    break;
                }
            }
        }
        setTimeout(() => {
            newIngredientDiv.remove();
        }, 500);

        makeInvisible(results);

        clearTimeout(timer);
        timer = setTimeout(() => {
            createMeals().then(() => {
                showMeals();
                checkIfDisableClearBtn();
                checkIfEnableInputs();
            })
        }, 500);

    };
    ingredientsSelectedDiv.append(newIngredientDiv);
    for (const option of ingredientsDatalist.childNodes) {
        if (option.value) {
            if (option.value.toLowerCase() === ingredientStr) {
                option.disabled = true;
                break;
            }
        }
    }
}

const makeInvisible = (element) => {
    if (!element.classList.contains("invisible")) element.classList.toggle("invisible");
}

searchInput.oninput = () => {
    makeInvisible(results);

    clearTimeout(timer);
    timer = setTimeout(() => {
        createMeals().then(() => {
            if (mealsCreated.length < 2) searchInput.maxLength = searchInput.value.length;
            else searchInput.removeAttribute("maxlength");
            showMeals();
            checkIfDisableClearBtn();
            checkIfDisableInputs();
            checkIfEnableInputs();
        })
    }, 500);
};

searchInput.onfocus = () => {
    searchInput.placeholder = "";
    searchInput.style.fontWeight = "normal";
    if (mealsCreated.length === 0) searchInput.maxLength = searchInput.value.length;
};

searchInput.onblur = () => {
    searchInput.placeholder = "Filter by name";
    if (searchInput.value !== "") searchInput.style.fontWeight = "bold";
    searchInput.removeAttribute("maxlength");
};

const selectClickHandle = (select) => {
    if (select.value !== "") {
        select.value = "";
        select.style.fontWeight = "normal";

        makeInvisible(results);

        clearTimeout(timer);
        timer = setTimeout(() => {
            createMeals().then(() => {
                showMeals();
                checkIfDisableClearBtn();
                checkIfEnableInputs();
                checkIfDisableInputs();
            })
        }, 500);
    }
};

categorySelect.onclick = () => {
    selectClickHandle(categorySelect);
};

areaSelect.onclick = () => {
    selectClickHandle(areaSelect);
};

const changeSelectHandler = (select, list) => {
    makeInvisible(results);

    const selectValue = select.value.toLowerCase();
    if (selectValue !== "") select.style.fontWeight = "bold";
    if (list.includes(selectValue)) clearFiltersBtn.disabled = false;
    else select.value = "";

    clearTimeout(timer);
    timer = setTimeout(() => {
        createMeals().then(() => {
            showMeals();
            checkIfDisableClearBtn();
            checkIfDisableInputs();
        })
    }, 500);
}

categorySelect.onchange = () => {
    changeSelectHandler(categorySelect, categories);
};

areaSelect.onchange = () => {
    changeSelectHandler(areaSelect, areas);
};

hideFiltersBtn.onclick = () => {
    hideFiltersBtn.innerText = hideFiltersBtn.innerText === "Hide filters" ? 
        "Show filters" : "Hide filters";
    filters.classList.toggle("hidden");
};

clearFiltersBtn.onclick = () => {
    clearFiltersBtn.disabled = true;
    ingredientsSelected.length = 0;
    
    setTimeout(() => {
        ingredientsSelectedDiv.innerHTML = "";
    }, 500);

    for (const input of [searchInput, ingredientsSelect, categorySelect, areaSelect]) {
        input.disabled = false;
        input.value = "";
        input.style.fontWeight = "normal";
    }

    for (const option of ingredientsDatalist.childNodes) {
        if (option.disabled === true) option.disabled = false;
    }

    makeInvisible(ingredientsSelectedDiv);
    makeInvisible(results);

    setTimeout(() => {
        createMeals().then(() => {
                showMeals();
            }
        )
    }, 500);
};

for (const node of pageInputs) {
    node.oninput = () => {
        const pageInputValue = node.value;
        const totalPages = pages.totalPages;
    
        if (pageInputValue !== "") {
            makeInvisible(resultsContentDiv);
    
            if (parseInt(pageInputValue) > totalPages) node.value = totalPages;
            if (parseInt(pageInputValue) < 1) node.value = 1;
            for (const innerNode of pageInputs) {
                innerNode.value = node.value;
            }
            pages = paginate(mealsCreated.length, parseInt(node.value));
    
            clearTimeout(timer);
            timer = setTimeout(() => {
                showMealsWithScroll();
            }, 500);
        }
    };

    node.onblur = () => {
        const currentPage = pages.currentPage;
        if (parseInt(node.value) !== currentPage) node.value = currentPage;
    };

    node.onclick = () => {
        node.value = "";
    }
}

randomPickBtn.onclick = () => {
    mealIdInput.value = resultsIds[Math.floor(Math.random() * resultsIds.length)];
    searchForm.submit();
}

setTimeout(() => {
    resultsContentDiv.classList.toggle("start");
    for (const node of paginationButtonsDivs) {
        node.classList.toggle("stopped");
    }
}, 3000);
