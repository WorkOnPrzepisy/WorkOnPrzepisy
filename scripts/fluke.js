const jsPdf = window.jspdf;
const apiMeal = "https://www.themealdb.com/api/json/v1/1/";
$("#carouselFade").carousel();
let idMealPage = '';

let apiDownoand;

const isFluke = function() {
    let pageIsFluke;
    const hrefInPage = window.location.href;
    pageIsFluke = hrefInPage.slice(hrefInPage.indexOf("=") + 1, hrefInPage.indexOf("&"));
    return Boolean(pageIsFluke);
};
const pageIsFluke = isFluke();

const downloadApi = async(api) => {
    apiDownoand = await (await fetch(api)).json();
    return apiDownoand.meals[0];
};

const downloadSuitableApi = (pageIsFluke) => {
    if (pageIsFluke) {
        let buttonFluke = document.querySelector("#button-draw-recipe");
        buttonFluke.removeAttribute("style");
        const title = document.querySelector("title");
        title.innerText = "Fluke";
        let apiDownoandSuitable = downloadApi(`${apiMeal}random.php`);
        return apiDownoandSuitable;
    } else {
        const title = document.querySelector("title");
        title.innerText = "Recipe";
        const hrefInPage = window.location.href;
        const idMeals = hrefInPage.slice(hrefInPage.indexOf("&") + 1);
        let apiDownoandSuitable = downloadApi(`${apiMeal}lookup.php?i=${idMeals}`);
        return apiDownoandSuitable;
    }
};

const addElementsFromApi = () => {


    const addInHTMl = apiDownoand
        .then((resp) => {

            const { idMeal, strMeal, strMealThumb, strInstructions } = resp;
            const tabObiectIngredients = [];
            let i = 1;

            while (!!(resp[`strIngredient${i}`] !== "" && resp[`strIngredient${i}`] != null)) {
                tabObiectIngredients.push({
                    measure: resp[`strMeasure${i}`],
                    ingredient: resp[`strIngredient${i}`],
                });
                i++;
            }

            idMealPage = ''
            idMealPage += idMeal;
            return { strMeal, strMealThumb, tabObiectIngredients, strInstructions };
        })
        .catch((e) => {
            console.dir(`error in unpacking api: ${e}`);
        });

    addInHTMl
        .then((resp) => {

            const hTitleDish = document.querySelector("#title-dish");
            const imgDish = document.querySelector("#img-dish");
            const listIngredients = document.querySelector("#list-ingredients");
            const listIngredientscol2 = document.querySelector(
                "#list-ingredients-col2"
            );
            const description = document.querySelector(".content-description");
            const p = document.createElement("p");

            hTitleDish.innerText = resp.strMeal;
            imgDish.src = resp.strMealThumb;
            p.classList.add("instructions");

            p.innerText = resp.strInstructions;
            description.appendChild(p);

            for (let i = 0; i < resp.tabObiectIngredients.length; i++) {
                const li = document.createElement("li");
                li.classList.add("li-ingredient");

                if (i < 10) {
                    li.innerText = `${resp.tabObiectIngredients[i].measure} - ${resp.tabObiectIngredients[i].ingredient}`;
                    listIngredients.appendChild(li);
                } else {
                    li.innerText = `${resp.tabObiectIngredients[i].measure} - ${resp.tabObiectIngredients[i].ingredient}`;
                    listIngredientscol2.appendChild(li);
                }
            }
        })
        .catch((e) => {
            console.dir(`
    error in unpacking api: ${e}`);
        });
};

const removalAddedElementsToHtml = () => {
    const hTitleDish = document.querySelector("#title-dish");
    const imgDish = document.querySelector("#img-dish");
    const listIngredients = document.querySelectorAll(".li-ingredient");
    const instructions = document.querySelector(".instructions");

    hTitleDish.innerText = "";
    imgDish.src = "";
    for (el of listIngredients) {
        el.remove();
    }
    instructions.remove();
};

apiDownoand = downloadSuitableApi(pageIsFluke);
addElementsFromApi(apiDownoand);

const buttonFluke = document.querySelector("#button-draw-recipe");

buttonFluke.addEventListener("click", () => {

    apiDownoand = downloadSuitableApi(pageIsFluke);
    addElementsFromApi();
    removalAddedElementsToHtml(apiDownoand);
});

const generateListIngredientsPdf = (doc, margin, recipe) => {
    const liElements = document.querySelectorAll('.li-ingredient');
    let i = 60;
    lengthLiElements = liElements.length
    for (let j = 0; j < lengthLiElements; j++) {
        const liElementText = liElements[j].innerText;

        if (recipe && j == 13) {
            i = 120;
        } else if (recipe && j > 13) {
            doc.text(20, i, `[   ]  ${liElementText}`);
        } else {
            doc.text(margin, i, `[   ]  ${liElementText}`);

        }
        i += 10;
    }
}

const generateInstructions = (doc, instructions) => {
    const instructionsS = instructions.split('<br>');
    const instructionsSAdd = instructionsS.join(" ");
    lengthArrayInstructions = instructionsSAdd.length;
    let start = 0;
    let multiple = 80;
    let j = 210;

    for (let i = 0; i < lengthArrayInstructions; i++) {
        if (i === multiple) {
            const arrayWithString = instructionsSAdd.substring(start, i);
            doc.text(20, j, `${arrayWithString}`);
            start = i;
            multiple += 80;
            j += 10;
        }
        if (j === 260) {
            doc.addPage();
            j = 20;
        }
    }
    const arrayWithString = instructionsSAdd.substring(start);
    doc.text(20, j, `${arrayWithString}`);
}

const generateShoppingListPdf = () => {
    const doc = jsPdf.jsPDF();
    const margin = 30;
    const hTitleDish = document.querySelector("#title-dish").innerText;
    doc.getFontList("Lobster");
    doc.text(90, 20, "Shopping list");
    doc.line(20, 30, 190, 30)
    doc.text(30, 45, `${hTitleDish}`);
    doc.getFontList("Arial");
    doc.setFontSize(13);
    generateListIngredientsPdf(doc, margin);
    doc.save("shoppingList.pdf");
}

const generateRecipePdf = () => {
    recipe = true;
    const doc = jsPdf.jsPDF();
    const hTitleDish = document.querySelector("#title-dish").innerHTML;
    const imgDish = document.querySelector("#img-dish");
    const instructions = document.querySelector(".instructions").innerHTML;
    const margin = 120;

    doc.getFontList("Lobster");
    doc.text(70, 20, `${hTitleDish}`);
    doc.line(20, 30, 190, 30)
    doc.text(margin, 45, "Ingredients");
    doc.text(90, 200, "Instructions");
    doc.getFontList("Arial");
    doc.setFontSize(13);
    doc.addImage(imgDish, 'JPEG', 20, 45, 80, 60);
    generateListIngredientsPdf(doc, margin, recipe);

    generateInstructions(doc, instructions);

    const title = hTitleDish.replace(' ', '_')
    doc.save(`Recip_${title}.pdf`);
}

const buttonGenerateListPDF = document.querySelector("#button-generate-list");

buttonGenerateListPDF.addEventListener('click', () => {
    generateShoppingListPdf();
});

const buttonGenerateRecipePDF = document.querySelector("#button-generate-recipe");

buttonGenerateRecipePDF.addEventListener('click', () => {
    generateRecipePdf();
});

const getData = (key) => {
    if (!localStorage) return;

    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        console.error(`error getting item ${key} to localStorage`, err);
    }
}

const storeData = (key, item) => {
    if (!localStorage) return;

    try {
        return localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
        console.error(`error storing item ${key} to localStorage`, err);
    }
}

const iconAddRecipe = document.querySelector('#icon-add-recipe');


const addRecipeToLocalStorage = () => {

    const hTitleDish = document.querySelector("#title-dish").innerHTML;
    const key = "Recipe";

    const state = {
        idMeals: idMealPage,
        title: hTitleDish
    }

    let tabWithIdMealLocalStoage = [];
    const dataLocalS = getData(key);
    if (dataLocalS === null) {
        tabWithIdMealLocalStoage.push(state);
        storeData(key, tabWithIdMealLocalStoage);
        tabWithIdMealLocalStoage = [];
    } else {
        let listRecipe = tabWithIdMealLocalStoage.concat(dataLocalS);
        listRecipe.push(state);
        storeData(key, listRecipe);
    }
};

iconAddRecipe.addEventListener('click', () => {

    addRecipeToLocalStorage();
});

const buttonFavourite = document.querySelector("#favorite");

let isClick = 0;

buttonFavourite.addEventListener('click', () => {

    buttonFavourite.style.backgroundImage = 'url("../img/heartClick.png")';
    isClick++;
});

buttonFavourite.addEventListener('click', () => {
    if (isClick === 2) {
        buttonFavourite.style.backgroundImage = 'url("../img/heart.png")';
        isClick = 0;
    }

});

const addTryAgain = () => {
    const tryAgain = document.querySelector(".try-again");

    if (pageIsFluke) {

        tryAgain.addEventListener('click', () => {
            apiDownoand = downloadSuitableApi(pageIsFluke);
            addElementsFromApi();
            removalAddedElementsToHtml(apiDownoand);
        });
    } else if (!pageIsFluke) {
        tryAgain.style.visibility = "hidden";
    }
}

addTryAgain();