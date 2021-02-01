const jdpsf = window.jspdf;

const urlParamsBasket = Object.fromEntries(new URLSearchParams(document.location.search));

const api = "http://localhost:7000/meals/";

const getDataBasket = (key) => {
    if (!localStorage) return;

    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        console.error(`error getting item ${key} to localStorage`, err);
    }
}

const storeDataBasket = (key, item) => {
    if (!localStorage) return;

    try {
        return localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
        console.error(`error storing item ${key} to localStorage`, err);
    }
}

const tdIntable1 = document.querySelector("#table--1 > tbody");

const downoandApiBasket = async(api) => {

    const apiDownoand = await (await fetch(api)).json();

    return apiDownoand;

}

const downloadDbBasket = async db_id => {
    const query = new URLSearchParams({ db_id });

    try {
        const response = await fetch("/users/fluke_id?" + query.toString()).then(_ => _.json());
        return response;
    } catch (error) {
        console.error(error);
    }
};

const addElementInTableHtmlBasket = (i, idMeal, title, count) => {
    const tr = document.createElement('tr');
    tr.classList.add(`tr--${i}`);


    const tdcol1 = document.createElement('td');
    tdcol1.classList.add(`col--1`, `col-checkbox`);
    const divCheckbox = document.createElement('div');
    divCheckbox.classList.add('div-checkbox');
    const labelCheckbox = document.createElement('label');
    labelCheckbox.classList.add('label-checkbox');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.classList.add('input-checkbox');
    inputCheckbox.id = idMeal;
    inputCheckbox.setAttribute('type', 'checkbox');
    const spanCheckbox = document.createElement('span');
    spanCheckbox.classList.add('span-checkbox');
    spanCheckbox.setAttribute('title', 'Select');
    labelCheckbox.appendChild(inputCheckbox);
    labelCheckbox.appendChild(spanCheckbox);
    divCheckbox.appendChild(labelCheckbox);

    const tdcol2 = document.createElement('td');
    tdcol2.classList.add(`col--2`, `col-title`);
    const tdcol2h4 = document.createElement('h4');
    tdcol2h4.classList.add('h4-title-Recipe');
    tdcol2h4.innerText = title;
    const aElement = document.createElement('a');
    aElement.classList.add('aElementTitle');
    if (idMeal.length > 6) {
        aElement.href = `/fluke?db_id=${idMeal}`;
    } else {
        aElement.href = `/fluke?api_id=${idMeal}`;
    }


    aElement.appendChild(tdcol2h4)
    const divTitle = document.createElement('div');
    divTitle.classList.add('div-title-Recipe');
    divTitle.appendChild(aElement);


    const tdcol3 = document.createElement('td');
    tdcol3.classList.add(`col--3`, `col-remove`);
    const divCol3 = document.createElement('div');
    divCol3.classList.add('div-col-3');
    const divRemove = document.createElement('div');
    divRemove.classList.add('div-remove');
    divRemove.setAttribute('title', 'Remove this recipe');
    const buttonRemoveValue = document.createElement('button');
    buttonRemoveValue.classList.add('button-remove-value');
    const inputValue = document.createElement('input');
    inputValue.classList.add('inputCountRecipe');
    inputValue.setAttribute('type', 'number');
    inputValue.value = count;
    const buttonAddValue = document.createElement('button');
    buttonAddValue.classList.add('button-add-value');
    const divAddRemoveInput = document.createElement('div');
    divAddRemoveInput.classList.add('add-remove-input');

    divAddRemoveInput.appendChild(buttonRemoveValue);
    divAddRemoveInput.appendChild(inputValue);
    divAddRemoveInput.appendChild(buttonAddValue);

    divCol3.appendChild(divAddRemoveInput);
    divCol3.appendChild(divRemove)

    tdcol1.appendChild(divCheckbox);
    tdcol2.appendChild(divTitle);
    tdcol3.appendChild(divCol3);
    tr.appendChild(tdcol1);
    tr.appendChild(tdcol2);
    tr.appendChild(tdcol3);

    tdIntable1.appendChild(tr);
}

const removeItemHtmlBasket = (removeTbody) => {

    for (let el of removeTbody) {
        el.remove();
    }
}

const countArrWthMealsBasket = () => {
    const arrWithMeals = addDataFromLocalStorageBasket();
    const copyArrWithMeals = JSON.parse(JSON.stringify(arrWithMeals));

    return arrWithMeals;
}

const addItemHTMLBasket = () => {

    const copyArrWithMeals = countArrWthMealsBasket();
    for (let i = 0; i < copyArrWithMeals.length; i++) {
        addElementInTableHtmlBasket(i, copyArrWithMeals[i].idMeals, copyArrWithMeals[i].title, copyArrWithMeals[i].countMeal);
    }
}

const addDataFromLocalStorageBasket = () => {
    const key = "Recipe";
    return getDataBasket(key);
}

const buttonSelectAll = document.querySelector(".button-select-basket");
const inputSelectAll = document.querySelector(".input-checkbox-select");
let isClick = 0;

const selectBasket = () => {

    const inputCheckbox = document.querySelectorAll(".input-checkbox");

    for (let el of inputCheckbox) {
        if (!el.checked) {
            el.checked = true;
        }
    }
    isClick++;
}

buttonSelectAll.addEventListener('click', selectBasket);

buttonSelectAll.addEventListener('click', () => {
    if (isClick === 2) {
        const inputCheckbox = document.querySelectorAll(".input-checkbox");
        for (let el of inputCheckbox) {
            if (el.checked) {
                el.checked = false;
            }
        }
        isClick = 0;
    }
});

inputSelectAll.addEventListener('click', selectBasket);

inputSelectAll.addEventListener('click', () => {
    if (isClick === 2) {
        const inputCheckbox = document.querySelectorAll(".input-checkbox");
        for (let el of inputCheckbox) {
            if (el.checked) {
                el.checked = false;
            }
        }
        isClick = 0;
    }
});

const selectBasketBasket = (key, getTabeWithData) => {

    storeDataBasket(key, getTabeWithData);
    const removeTbody = document.querySelectorAll('.tbody-table-1 tr');
    removeItemHtmlBasket(removeTbody);
    const local = getData('Recipe');
    const countBasketRecipePInnerText = local.length;
    countBasketRecipeP.innerText = countBasketRecipePInnerText.toString();
    addItemHTMLBasket();
}

const removeIconButtonTbodyBasket = document.querySelector(".tbody-table-1");

removeIconButtonTbodyBasket.addEventListener('click', (e) => {
    if (e.target.tagName === "DIV" && e.target.classList.contains("div-remove")) {
        const whichTr = e.target.parentNode.parentNode.parentNode;

        let getTabeWithData = countArrWthMealsBasket();
        const whichTrIndex = whichTr.classList.value;
        const indexTr = whichTrIndex.slice((whichTrIndex.lastIndexOf('-') + 1), );
        getTabeWithData.splice(indexTr, 1);
        const key = "Recipe";

        selectBasketBasket(key, getTabeWithData);

    }
})

const getNrIndexMealnputCheckedBasket = () => {
    const inputCheckbox = document.querySelectorAll(".input-checkbox");

    let tableWithIndexTr = [];
    for (let el of inputCheckbox) {
        if (el.checked) {
            const whichTr = el.parentNode.parentNode.parentNode.parentNode;
            const whichTrIndex = whichTr.classList.value;
            const indexTr = whichTrIndex.slice((whichTrIndex.lastIndexOf('-') + 1), );
            tableWithIndexTr.push(indexTr);
        }
    }
    return tableWithIndexTr;

}

const removeButtonBasket = document.querySelector("#remove-checked");
removeButtonBasket.addEventListener('click', () => {
    let getTabeWithData = addDataFromLocalStorageBasket();
    let tableWithIndexTr = getNrIndexMealnputCheckedBasket();
    for (let i = tableWithIndexTr.length - 1; i >= 0; i--) {
        getTabeWithData.splice(tableWithIndexTr[i], 1);
    }
    const key = "Recipe";
    selectBasketBasket(key, getTabeWithData);
})

const imdexInTableWithMealsBasket = (e) => {
    const arrWithCountMeals = addDataFromLocalStorageBasket();
    const key = "Recipe";
    const wichMealId = e.target.parentNode.parentNode.parentNode.parentNode;
    let nrIndexTab = wichMealId.classList.value.slice(wichMealId.classList.value.lastIndexOf('-') + 1)

    return { key, nrIndexTab, arrWithCountMeals }
}

removeIconButtonTbodyBasket.addEventListener('click', (e) => {

    if (e.target.tagName === "BUTTON" && e.target.classList.contains('button-add-value')) {
        const { key, nrIndexTab, arrWithCountMeals } = imdexInTableWithMealsBasket(e);
        arrWithCountMeals[nrIndexTab].countMeal += 1;
        selectBasketBasket(key, arrWithCountMeals);
    }
    if (e.target.tagName === "BUTTON" && e.target.classList.contains('button-remove-value')) {
        const { key, nrIndexTab, arrWithCountMeals } = imdexInTableWithMealsBasket(e);
        arrWithCountMeals[nrIndexTab].countMeal -= 1;

        if (arrWithCountMeals[nrIndexTab].countMeal === 0) {
            const modal = document.querySelector(".modal");
            modal.style.display = 'block';
            const buttonCancel = modal.querySelector('.button-cancel');
            const buttonDelete = modal.querySelector('.button-delete');

            buttonCancel.addEventListener('click', () => {
                arrWithCountMeals[nrIndexTab].countMeal += 1;
                modal.style.display = 'none';

            })
            buttonDelete.addEventListener('click', () => {
                arrWithCountMeals.splice(nrIndexTab, 1);
                modal.style.display = 'none';
                selectBasketBasket(key, arrWithCountMeals);
            })

        }
        selectBasketBasket(key, arrWithCountMeals);
    }
    if (e.target.tagName === "INPUT" && e.target.classList.contains('inputCountRecipe')) {

        const inputCountRecipe = e.target;

        inputCountRecipe.addEventListener('blur', (a) => {
            const { key, nrIndexTab, arrWithCountMeals } = imdexInTableWithMealsBasket(e);
            arrWithCountMeals[nrIndexTab].countMeal = parseInt(inputCountRecipe.value);

            selectBasketBasket(key, arrWithCountMeals);

        })
    }

})

const getIngredientsBasket = async(idMeal) => {

    const tabDb = [];
    if (idMeal.length > 6) {

        const tab = await downloadDbBasket(idMeal)

        const tabBdIngredients = tab.strIngredient1;
        for (let i = 0; i < tabBdIngredients.length; i++) {
            tabDb.push({ ingredient: tabBdIngredients[i][`strIngridient${i + 1}`] });
        }

        return tabDb;

    } else {
        let apiRecipe = api;
        apiRecipe += idMeal;

        let tabObiectIngredients = [];
        const dataFromApi = await downoandApiBasket(apiRecipe);

        const tabIngredientsFromApi = dataFromApi.ingredients;

        for (let el of tabIngredientsFromApi) {
            tabObiectIngredients.push({
                measure: el.measure,
                ingredient: el.name,
            });
        }
        return tabObiectIngredients;
    }

}

const splitIngredientsBasket = (tabWithIngredients) => {
    const regex = /[^0-9]/i;
    let tabWithIngred = [];
    for (let i = 0; i < tabWithIngredients.length; i++) {
        let meal = {
            measure: '',
            ingredient: ''
        }
        if (tabWithIngredients[i].measure) {
            let measure = tabWithIngredients[i].measure;

            for (let j = 0; j < measure.length; j++) {

                if (measure[j].search(regex)) {

                    meal.measure += measure[j];

                } else if (measure[j] == '/') {

                    meal.measure += measure[j];

                } else if (measure[j] == ' ') {
                    meal.measure += measure[j];
                } else {

                    meal.ingredient += measure[j];

                }
            }
            meal.ingredient += ` ${tabWithIngredients[i].ingredient}`;
            tabWithIngred.push(meal);


        } else {

            let ingredient = tabWithIngredients[i].ingredient;
            for (let j = 0; j < ingredient.length; j++) {

                if (ingredient[j].search(regex)) {

                    meal.measure += ingredient[j];

                } else if (ingredient[j] == '/') {

                    meal.measure += ingredient[j];

                } else if (ingredient[j] == ' ' && j > 0 && ingredient[j - 1].search(regex)) {
                    meal.measure += ingredient[j];
                } else {

                    meal.ingredient += ingredient[j];

                }
            }
            tabWithIngred.push(meal);

        }


    }
    return tabWithIngred;
}

const countTheSameIngredientsBasket = (tabWithIngredients) => {


    for (let i = 0; i < tabWithIngredients.length; i++) {

        let ingredient1 = tabWithIngredients[i].ingredient.trim().replace("  ", " ");

        for (let j = i + 1; j < tabWithIngredients.length; j++) {
            let ingredient2 = tabWithIngredients[j].ingredient.trim().replace("  ", " ");

            if (ingredient1.toLowerCase() === ingredient2.toLowerCase()) {
                let measure1 = tabWithIngredients[i].measure;
                let measure2 = tabWithIngredients[j].measure;

                measure1 = measure1.trim();
                measure2 = measure2.trim();



                if (measure1 === "" || measure2 === "") {

                    measure1 += measure2;

                } else if (((measure1.indexOf(' ') != -1) || (measure2.indexOf(' ') != -1)) && ((measure1.indexOf('/') != -1) || (measure2.indexOf('/') != -1))) {


                    if (measure1.indexOf(' ') === -1 && measure2.indexOf('/') != -1) {


                        if (measure1.indexOf('/')) {
                            let measure1Split = measure1.split('/');
                            let measure2Split = measure2.split(' ');
                            let measure2Split2 = measure2Split[1].split('/');
                            let measureFr1 = parseInt(measure1Split[0]) + parseInt(measure2Split2[0]);
                            if (measureFr1 === parseInt(measure1Split[1])) {
                                let measureF = parseInt(measure2[0]) + 1;
                                tabWithIngredients[i].measure = measureF.toString();
                            } else {
                                let measureF = `${measure2[0]} ${measureFr1}/${measureFr2}`;
                                tabWithIngredients[i].measure = measureF;
                            }
                        } else {
                            let measure2Split = measure2.split(' ');
                            let measureFr1 = parseInt(measure1) + parseInt(measure2Split[0]);

                            let measureF = parseInt(measure1) + parseInt(measure2Split[0])
                            measureF = measureF.toString() + `${ measureFr1 }`;
                            tabWithIngredients[i].measure = measureF;
                        }
                    } else if (measure2.indexOf(' ') === -1 && measure1.indexOf('/') != -1) {

                        let measureF = '';
                        if (measure2.indexOf('/')) {
                            let measure2Split = measure2.split('/');
                            let measure1Split = measure1.split(' ');
                            let measure1Split2 = measure1Split[1].split('/');
                            let measureFr2 = parseInt(measure2Split[0]) + parseInt(measure1Split2[0]);
                            if (measureFr2 === parseInt(measure2Split[1])) {
                                let measureF = parseInt(measure1[0]) + 1;
                                tabWithIngredients[i].measure = measureF.toString();
                            } else {
                                let measureF = `
                            $ { measure1[0] }
                            $ { measureFr2 }
                            /${measureFr1}`;
                                tabWithIngredients[i].measure = measureF;
                            }
                        } else {
                            let measure1Split = measure1.split(' ');
                            let measureFr2 = parseInt(measure2) + parseInt(measure1Split[0]);

                            let measureF = parseInt(measure2) + parseInt(measure1Split[0]);
                            measureF = measureF.toString() + `${measureFr2}`;
                            tabWithIngredients[i].measure = measureF;
                        }
                    } else {

                        let measure2Split = measure2.split(' ');
                        let measure1Split = measure1.split(' ');
                        let measure1Split2 = measure1Split[1].split('/');
                        let measure2Split2 = measure2Split[1].split('/');
                        let measureFr2 = parseInt(measure2Split2[0]) + parseInt(measure1Split2[0]);

                        if (measureFr2 === parseInt(measure2Split2[1])) {
                            let measureF = parseInt(measure2Split[0]) + parseInt(measure1Split[0]) + 1;

                            tabWithIngredients[i].measure = measureF.toString();
                        } else {
                            let measureF = `${measure1[0]} ${measureFr2}/${measureFr1}`;
                            tabWithIngredients[i].measure = measureF;
                        }
                    }
                } else if ((measure1.indexOf('/') != -1) || (measure2.indexOf('/') != -1)) {

                    if (measure1.indexOf('/') != -1 && measure2.indexOf('/') != -1) {

                        //let measureF = '';
                        let measure1Split = measure1.split('/');
                        let measure2Split = measure2.split('/');
                        let measureFr1 = parseInt(measure1Split[0]) + parseInt(measure2Split[0]);
                        if (measureFr1 === parseInt(measure1Split[1])) {
                            let measureF = 1;
                            tabWithIngredients[i].measure = measureF.toString();
                        } else {
                            let measureF = `${measureFr1}/${measure1Split[1]}`;
                            tabWithIngredients[i].measure = measureF;
                        }
                    } else if (measure1.indexOf('/') != -1 && measure2.indexOf('/') === -1) {

                        let measureF = `${measure2} ${measure1}`;
                        tabWithIngredients[i].measure = measureF;
                    } else if (measure1.indexOf('/') === -1 && measure2.indexOf('/') != -1) {

                        let measureF = `${measure1} ${measure2}`;
                        tabWithIngredients[i].measure = measureF;
                    }
                } else if (typeof(parseInt(measure1)) != 'NaN' && typeof(parseInt(measure1)) != 'NaN') {

                    measure1 = parseInt(measure1);
                    measure2 = parseInt(measure2);

                    measure1 += measure2;

                    tabWithIngredients[i].measure = measure1.toString();
                }

                tabWithIngredients.splice(j, 1);
            }

        }
    }

    return tabWithIngredients;
}

const generateIngredientsPdfBasket = (doc, arrcountTheSameIngredientsBasket) => {
    let i = 60;
    let margin = 20;
    let pageCount = 0;
    let elementsLength = arrcountTheSameIngredientsBasket.length;
    doc.getFontList("Lobster");
    doc.text(90, 20, "Shopping list");
    doc.line(20, 30, 190, 30)
    doc.getFontList("Arial");
    doc.setFontSize(13);

    for (let j = 0; j < elementsLength; j++) {
        let { measure, ingredient } = arrcountTheSameIngredientsBasket[j];
        measure = measure.trim();
        if ((i < 260 && pageCount === 0) || (i < 260 && pageCount === 1)) {

            doc.text(margin, i, `[   ]  ${measure} ${ingredient}`);
        }
        if (i === 260 && pageCount === 0) {

            doc.text(margin, i, `[   ]  ${measure} ${ingredient}`);
            margin = 120;
            pageCount = 1;
            i = 50;
        }
        if (i === 260 && pageCount === 1) {

            doc.text(margin, i, `[   ]  ${measure} ${ingredient}`);
            pageCount = 2;
        }
        if (i === 260 && pageCount === 2) {

            doc.addPage();
            doc.getFontList("Lobster");
            doc.text(90, 20, "Shopping list");
            doc.line(20, 30, 190, 30);
            doc.getFontList("Arial");
            doc.setFontSize(13);
            margin = 20;
            pageCount = 0;
            i = 50;
        }
        i += 10;
    }
    doc.save("shoppingList.pdf");
}

const generateShoppingListPdfBasket = async() => {
    const arrWithCountMeals = addDataFromLocalStorageBasket();
    let arrWithSelectedDishes = getNrIndexMealnputCheckedBasket();
    if (arrWithSelectedDishes.length === 0) {
        selectBasket();
        arrWithSelectedDishes = getNrIndexMealnputCheckedBasket();
    }
    let doc = jspdf.jsPDF();
    let tabWithIngredients = [];


    for (let j = 0; j < arrWithSelectedDishes.length; j++) {

        const el = arrWithSelectedDishes[j]
        const idMeal = arrWithCountMeals[el].idMeals;
        const countMeal = arrWithCountMeals[el].countMeal;
        const regex = /[^0-9]/i;



        let i = 0;
        while (i !== countMeal) {
            const prom = await getIngredientsBasket(idMeal)
            Array.prototype.push.apply(tabWithIngredients, prom);

            i++;
        }
    }

    const tabWithAllIngerdients = splitIngredientsBasket(tabWithIngredients);

    const tabcountTheSameIngredientsBasket = countTheSameIngredientsBasket(tabWithAllIngerdients);

    generateIngredientsPdfBasket(doc, tabcountTheSameIngredientsBasket);

}

const buttonGenerateShoppingListBasket = document.querySelector('#generate-shopping-list-basket');

buttonGenerateShoppingListBasket.addEventListener('click', () => {
    generateShoppingListPdfBasket();
})

const hiddenSlider = () => {
        if (window.location.href.match('/users/basket')) {
            //const btnAdd = document.querySelectorAll('.slider-container');
            //btnAdd[1].style.display = 'none';
        }
    }
    //hiddenSlider();
addItemHTMLBasket();