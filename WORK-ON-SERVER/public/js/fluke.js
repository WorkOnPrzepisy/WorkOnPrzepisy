const jsPdf = window.jspdf;

const apiMeal = "http://localhost:7000/meals/";
let idMealPage = '';

let apiDownoand;

const isFluke = function() {
    let pageIsFluke;
    const hrefInPage = window.location.href;
    pageIsFluke = hrefInPage.slice(hrefInPage.indexOf("=") + 1, hrefInPage.indexOf("&"));
    return Boolean(pageIsFluke);
};
const pageIsFluke = isFluke();


const urlParams = Object.fromEntries(new URLSearchParams(document.location.search));

const downloadApi = async(api, random) => {
    apiDownoand = await (await fetch(api)).json();
    if (random) {
        const idMeal = await apiDownoand[0]._id; // zmienilam zobacz czy dziala
        //const idMeal = await apiDownoand.meals[0].idMeal;
        const idObj = { _id: idMeal };
        const btnAdd = document.querySelector('#favorite');
        btnAdd.addEventListener('click', async function(e) {

            await fetch('/users/user-images', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(idObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });
        return apiDownoand[0];
    } else {
        const idMeal = await apiDownoand._id; // zmienilam zobacz czy dziala
        //const idMeal = await apiDownoand.meals[0].idMeal;
        const idObj = { _id: idMeal };
        const btnAdd = document.querySelector('#favorite');
        btnAdd.addEventListener('click', async function(e) {

            await fetch('/users/user-images', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(idObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });
        return apiDownoand;
    }


};

const downloadDb = async db_id => {
    const query = new URLSearchParams({ db_id });

    try {
        const response = await fetch("/users/fluke_id?" + query.toString()).then(_ => _.json());

        another(response)
    } catch (error) {
        console.error(error);
    }
};

const downloadSuitableApi = async(params) => {
    let random = false;
    if (params.db_id) {
        // const btnAdd = document.querySelector('#favorite');
        // btnAdd.style.visibility = "";
        const buttonFluke = document.querySelector(".try-again");
        buttonFluke.style.display = "none";
        await downloadDb(params.db_id);

    } else if (params.api_id) {
        console.log(params.api_id);
        // const btnAdd = document.querySelector('#favorite');
        // btnAdd.style.visibility = "";
        const buttonFluke = document.querySelector(".try-again");
        buttonFluke.style.display = "none";
        const title = document.querySelector("title");
        title.innerText = "Recipe";
        let apiDownoandSuitable = await downloadApi(`${apiMeal}${params.api_id}`, random);
        apiDownoand = apiDownoandSuitable;
        addElementsFromApi();

    } else {
        random = true;
        let buttonFluke = document.querySelector("#button-draw-recipe");
        buttonFluke.removeAttribute("style");
        const title = document.querySelector("title");
        title.innerText = "Fluke";
        let apiDownoandSuitable = await downloadApi(`${apiMeal}random`, random);
        console.log("tttttt", apiDownoandSuitable);
        apiDownoand = apiDownoandSuitable;
        addElementsFromApi();
    }
};

const another = async(params) => {
    const response = await params
        //VALUES FROM DATABSE
    const { strMeal, images, strInstructions, strIngredient1 } = response
    const arrayOfIngridients = []
    const imageBuffer = images.strMealThumb

    for (const ingridient of strIngredient1) {
        for (const item in ingridient) {
            arrayOfIngridients.push(ingridient[item])
        }
    }

    const hTitleDish = document.querySelector("#title-dish");
    const imgDish = document.querySelector("#img-dish");
    const listIngredients = document.querySelector("#list-ingredients");
    const description = document.querySelector(".content-description");
    const p = document.createElement("p");
    p.classList.add("instructions");

    hTitleDish.innerText = strMeal
    imgDish.src = `data:image/png;base64, ${imageBuffer}`
    p.innerText = strInstructions;
    description.appendChild(p);

    for (let i = 0; i < arrayOfIngridients.length; i++) {
        const li = document.createElement("li");
        li.classList.add("li-ingredient");
        li.innerText = `${arrayOfIngridients[i]}`;
        listIngredients.appendChild(li);
    }

    const idImage = await response._id
    const btnDATA = document.querySelector('#favorite')

    btnDATA.addEventListener('click', async function(e) {
        console.log(btnDATA);
        await fetch('/userek/fave', {
            method: 'POST',
            body: JSON.stringify({ id: idImage }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    })

}

const addElementsFromApi = () => {

    const { _id, name, imageUrl, ingredients, instructions } = apiDownoand;

    idMealPage = ''
    idMealPage += _id;

    const hTitleDish = document.querySelector("#title-dish");
    const imgDish = document.querySelector("#img-dish");
    const listIngredients = document.querySelector("#list-ingredients");
    const listIngredientscol2 = document.querySelector(
        "#list-ingredients-col2"
    );
    const description = document.querySelector(".content-description");
    const p = document.createElement("p");

    hTitleDish.innerText = name;
    imgDish.src = imageUrl;

    p.classList.add("instructions");
    p.innerText = instructions;
    description.appendChild(p);

    for (let i = 0; i < ingredients.length; i++) {
        const li = document.createElement("li");
        li.classList.add("li-ingredient");

        if (i < 10) {
            li.innerText = `${ingredients[i].measure} - ${ingredients[i].name}`;
            listIngredients.appendChild(li);
        } else {
            li.innerText = `${ingredients[i].measure} - ${ingredients[i].name}`;
            listIngredientscol2.appendChild(li);
        }
    }
}

const removalAddedElementsToHtml = () => {
    const hTitleDish = document.querySelector("#title-dish");
    const imgDish = document.querySelector("#img-dish");
    const listIngredients = document.querySelectorAll(".li-ingredient");
    const instructions = document.querySelector(".instructions");

    hTitleDish.innerText = "";
    imgDish.src = "";
    console.log(listIngredients);
    for (let i = 0; i < listIngredients.length; i++) {
        console.log(listIngredients[i]);
        listIngredients[i].remove();
    }
    instructions.remove();
};

downloadSuitableApi(urlParams);

const buttonFluke = document.querySelector("#button-draw-recipe");

buttonFluke.addEventListener("click", () => {
    downloadSuitableApi(urlParams);
    removalAddedElementsToHtml();
});

const generateListIngredientsPdf = (doc, margin, recipe) => {
    const liElements = document.querySelectorAll('.li-ingredient');
    let i = 60;
    const lengthLiElements = liElements.length
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
    console.log(instructionsSAdd);
    console.log(instructions);
    const lengthArrayInstructions = instructionsSAdd.length;
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
    doc.getFontList("Lobster");
    doc.setFontSize(13);
    generateListIngredientsPdf(doc, margin);
    doc.save("shoppingList.pdf");
}
const generateRecipePdf = () => {
    let recipe = true;
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
    console.log("tutaj");
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


const addRecipeToLocalStorage = (params) => {

    const hTitleDish = document.querySelector("#title-dish").innerHTML;
    const key = "Recipe";

    const state = {
        idMeals: params.db_id ? params.db_id : idMealPage,
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

    addRecipeToLocalStorage(urlParams);
});

const addTryAgain = () => {
    const tryAgain = document.querySelector(".try-again");

    if (pageIsFluke) {

        tryAgain.addEventListener('click', () => {
            downloadSuitableApi(urlParams);
            removalAddedElementsToHtml();
        });
    } else if (!pageIsFluke) {
        tryAgain.style.visibility = "hidden";
    }
}

addTryAgain();

console.log(urlParams);