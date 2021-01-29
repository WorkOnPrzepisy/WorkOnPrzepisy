const jdpsf = window.jspdf;

const urlParams = Object.fromEntries(new URLSearchParams(document.location.search));

const api = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

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

console.log(urlParams);

const tdIntable1 = document.querySelector("#table--1 > tbody");

const downoandApi = async(api) => {

    const apiDownoand = await (await fetch(api)).json();
    const meal = apiDownoand.meals[0];

    return meal;

}

const downloadDb = async db_id => {
    const query = new URLSearchParams({ db_id });

    try {
        const response = await fetch("/users/fluke_id?" + query.toString()).then(_ => _.json());

        console.log(response);
        return response;
        //another(response)
    } catch (error) {
        console.error(error);
    }
};

const addElementInTableHtml = (i, idMeal, title, count) => {
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

const removeItemHtml = (removeTbody) => {

    for (el of removeTbody) {
        el.remove();
    }
}

const countArrWthMeals = () => {
    const arrWithMeals = addDataFromLocalStorage();
    const copyArrWithMeals = JSON.parse(JSON.stringify(arrWithMeals));

    console.log(arrWithMeals);



    for (let i = 0; i < copyArrWithMeals.length; i++) {
        let arrWithCountMeals = [];
        //arrWithCountMeals.push(copyArrWithMeals[i]);
        copyArrWithMeals[i].countMeal = (copyArrWithMeals[i].countMeal ? copyArrWithMeals[i].countMeal : 1);
        //let last = 0;
        //console.log("i1", i);
        //console.log("arr", arrWithCountMeals);
        for (let j = i; j < copyArrWithMeals.length; j++) {


            if (copyArrWithMeals[i].idMeals === copyArrWithMeals[j].idMeals) {
                //console.log();
                //console.log(copyArrWithMeals[i].idMeals, "===", copyArrWithMeals[j].idMeals);


                //console.log("i", i);
                //console.log("j", j);
                copyArrWithMeals[i].countMeal += 1;
                //console.log(copyArrWithMeals[i]);
                console.log(copyArrWithMeals[i].countMeal);
                copyArrWithMeals[i].countMeal - 1;
                arrWithCountMeals.push(j);

            }
            //console.log("last", last);
        }

        copyArrWithMeals[i].countMeal -= 1;
        // for (el of copyArrWithMeals) {
        //     console.log("pcM", el);
        // }
        for (let i = arrWithCountMeals.length - 1; i > 0; i--) {
            console.log(arrWithCountMeals);
            console.log("remove", arrWithCountMeals[i]);
            copyArrWithMeals.splice(arrWithCountMeals[i], 1);
        }

        //console.log("pi", i, "pl", last);

        // for (el of copyArrWithMeals) {
        //     console.log("cM", el);
        // }
        // for (el of arrWithCountMeals) {
        //     console.log("aM", el);
        // }


    }

    console.log("tab:", copyArrWithMeals);
    //console.log("tab1", arrWithMeals);

    storeData("Recipe", copyArrWithMeals)

    return copyArrWithMeals;
}

const addItemHTML = () => {

    const copyArrWithMeals = countArrWthMeals();
    for (let i = 0; i < copyArrWithMeals.length; i++) {

        //const apiWithId = api + arrWithMeals[i].idMeals;
        //console.log(apiWithId);
        //await downoandApi(apiWithId, false);
        addElementInTableHtml(i, copyArrWithMeals[i].idMeals, copyArrWithMeals[i].title, copyArrWithMeals[i].countMeal);

    }
}

const addDataFromLocalStorage = () => {
    const key = "Recipe";
    return getData(key);
}

const buttonSelectAll = document.querySelector(".button-select-basket");
const inputSelectAll = document.querySelector(".input-checkbox-select");
let isClick = 0;

const select = () => {

    const inputCheckbox = document.querySelectorAll(".input-checkbox");

    for (let el of inputCheckbox) {
        if (!el.checked) {
            el.checked = true;
        }
    }
    isClick++;
}

buttonSelectAll.addEventListener('click', select);

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

inputSelectAll.addEventListener('click', select);

inputSelectAll.addEventListener('click', () => {
    if (isClick === 2) {
        const inputCheckbox = document.querySelectorAll(".input-checkbox");
        for (el of inputCheckbox) {
            if (el.checked) {
                el.checked = false;
            }
        }
        isClick = 0;
    }
});

const removeAddTable = (key, getTabeWithData) => {

    storeData(key, getTabeWithData);
    const removeTbody = document.querySelectorAll('.tbody-table-1 tr');
    removeItemHtml(removeTbody);
    addItemHTML();
}

const removeIconButtonTbody = document.querySelector(".tbody-table-1");

removeIconButtonTbody.addEventListener('click', (e) => {
    if (e.target.tagName === "DIV" && e.target.classList.contains("div-remove")) {
        const whichTr = e.target.parentNode.parentNode.parentNode;

        let getTabeWithData = countArrWthMeals();
        //console.log(getTabeWithData);

        //console.log(whichTr);
        const whichTrIndex = whichTr.classList.value;
        //console.log(whichTrIndex);
        const indexTr = whichTrIndex.slice((whichTrIndex.lastIndexOf('-') + 1), );
        //console.log("tu", indexTr);
        getTabeWithData.splice(indexTr, 1);
        const key = "Recipe";

        removeAddTable(key, getTabeWithData);
    }
})

const getNrIndexMealnputChecked = () => {
    const inputCheckbox = document.querySelectorAll(".input-checkbox");

    //console.log("yable:", getTabeWithData);
    let tableWithIndexTr = [];
    for (let el of inputCheckbox) {
        //console.log("el1", el);
        if (el.checked) {
            //console.log("el2", el);
            const whichTr = el.parentNode.parentNode.parentNode.parentNode;
            //console.log(whichTr);
            const whichTrIndex = whichTr.classList.value;
            //console.log(whichTrIndex);
            const indexTr = whichTrIndex.slice((whichTrIndex.lastIndexOf('-') + 1), );
            //console.log("tu", indexTr);
            tableWithIndexTr.push(indexTr);
            //console.log(tableWithIndexTr);
        }
    }
    return tableWithIndexTr;

}

const removeButton = document.querySelector("#remove-checked");
removeButton.addEventListener('click', () => {
    let getTabeWithData = addDataFromLocalStorage();
    let tableWithIndexTr = getNrIndexMealnputChecked();
    for (let i = tableWithIndexTr.length - 1; i >= 0; i--) {
        getTabeWithData.splice(tableWithIndexTr[i], 1);
        //console.log("tab", getTabeWithData);
    }
    const key = "Recipe";
    removeAddTable(key, getTabeWithData);
})

const imdexInTableWithMeals = (e) => {
    const arrWithCountMeals = addDataFromLocalStorage();
    const key = "Recipe";
    const wichMealId = e.target.parentNode.parentNode.parentNode.parentNode;
    let nrIndexTab = wichMealId.classList.value.slice(wichMealId.classList.value.lastIndexOf('-') + 1)
    console.log(wichMealId);
    console.log(nrIndexTab);

    return { key, nrIndexTab, arrWithCountMeals }
}

removeIconButtonTbody.addEventListener('click', (e) => {

    if (e.target.tagName === "BUTTON" && e.target.classList.contains('button-add-value')) {
        const { key, nrIndexTab, arrWithCountMeals } = imdexInTableWithMeals(e);
        arrWithCountMeals[nrIndexTab].countMeal += 1;
        removeAddTable(key, arrWithCountMeals);
    }
    if (e.target.tagName === "BUTTON" && e.target.classList.contains('button-remove-value')) {
        const { key, nrIndexTab, arrWithCountMeals } = imdexInTableWithMeals(e);
        arrWithCountMeals[nrIndexTab].countMeal -= 1;

        if (arrWithCountMeals[nrIndexTab].countMeal === 0) {
            const modal = document.querySelector(".modal");
            modal.style.display = 'block';
            console.log("hello");
            const buttonCancel = modal.querySelector('.button-cancel');
            const buttonDelete = modal.querySelector('.button-delete');

            console.log(buttonCancel);

            buttonCancel.addEventListener('click', () => {
                arrWithCountMeals[nrIndexTab].countMeal += 1;
                modal.style.display = 'none';

            })
            buttonDelete.addEventListener('click', () => {
                arrWithCountMeals.splice(nrIndexTab, 1);
                modal.style.display = 'none';
                removeAddTable(key, arrWithCountMeals);
            })

        }
        console.log("tuu", arrWithCountMeals[nrIndexTab].countMeal);

        removeAddTable(key, arrWithCountMeals);
    }
    if (e.target.tagName === "INPUT" && e.target.classList.contains('inputCountRecipe')) {
        //zmiana wartosci
        console.log(e.target);
        const inputCountRecipe = e.target;
        console.log("1", inputCountRecipe.value);
        inputCountRecipe.addEventListener('blur', (a) => {
            const { key, nrIndexTab, arrWithCountMeals } = imdexInTableWithMeals(e);
            //console.log({ key, nrIndexTab, arrWithCountMeals });
            arrWithCountMeals[nrIndexTab].countMeal = parseInt(inputCountRecipe.value);
            //console.log("ar", arrWithCountMeals[nrIndexTab].countMeal);
            //console.log("in", inputCountRecipe.value);
            //console.log("tab", arrWithCountMeals);
            removeAddTable(key, arrWithCountMeals);
            //console.log(inputCountRecipe.value);
        })
    }

})

const getIngredients = async(idMeal) => {

    const tabApi = [];
    const tabDb = [];
    if (idMeal.length > 6) {

        const tab = await downloadDb(idMeal)

        const tabBdIngredients = tab.strIngredient1;
        for (let i = 0; i < tabBdIngredients.length; i++) {
            tabDb.push({ ingredient: tabBdIngredients[i][`strIngridient${i + 1}`] });
        }
        console.log(tabDb);
        return tabDb;

    } else {
        let apiRecipe = api;
        apiRecipe += idMeal;
        console.log(apiRecipe);
        let j = 1;
        let tabObiectIngredients = [];
        const tab = await downoandApi(apiRecipe);
        //console.log("tu", prom);
        const { strMeal } = tab;
        console.log(strMeal);

        //console.log("juuu", prom[`strIngredient${j}`]);
        while (!!(tab[`strIngredient${j}`] !== "" && tab[`strIngredient${j}`] != null)) {
            //console.log("juuu", prom[`strIngredient${j}`]);
            tabObiectIngredients.push({
                measure: tab[`strMeasure${j}`],
                ingredient: tab[`strIngredient${j}`],
            });
            j++;
        }
        //console.log("huhu", tabObiectIngredients);
        return tabObiectIngredients;
    }

}

const splitIngredients = (tabWithIngredients) => {
    console.log("split", tabWithIngredients);
    const regex = /[^0-9]/i;
    let tabWithIngred = [];
    for (let i = 0; i < tabWithIngredients.length; i++) {
        console.log("co to", tabWithIngredients[i]);
        let meal = {
            measure: '',
            ingredient: ''
        }
        if (tabWithIngredients[i].measure) {
            let measure = tabWithIngredients[i].measure;
            console.log(tabWithIngredients[i].measure);
            console.log();
            for (let j = 0; j < measure.length; j++) {
                console.log("parse", measure[j].search(regex));
                if (measure[j].search(regex)) {

                    meal.measure += measure[j];
                    console.log("1:", meal.measure);
                } else if (measure[j] == '/') {

                    meal.measure += measure[j];
                    console.log("2:", meal.measure);
                } else {

                    meal.ingredient += measure[j];
                    console.log("3:", meal.measure);
                }
            }
            meal.ingredient += ` ${tabWithIngredients[i].ingredient}`;
            tabWithIngred.push(meal);
            //console.log(tabWithIngred);

        } else {
            console.log(tabWithIngredients[i].ingredient);
            let ingredient = tabWithIngredients[i].ingredient;
            for (let j = 0; j < ingredient.length; j++) {
                console.log("parse", ingredient[j].search(regex));
                if (ingredient[j].search(regex)) {

                    meal.measure += ingredient[j];
                    console.log("1:", meal.ingredient);
                } else if (ingredient[j] == '/') {

                    meal.measure += ingredient[j];
                    console.log("2:", meal.ingredient);
                } else {

                    meal.ingredient += ingredient[j];
                    console.log("3:", meal.ingredient);
                }
            }
            tabWithIngred.push(meal);
            //console.log(tabWithIngred);
        }


    }
    return tabWithIngred;
}

const countTheSameIngredients = (tabWithIngredients) => {
    console.log("fn", tabWithIngredients);

    for (let i = 0; i < tabWithIngredients.length; i++) {

        let ingredient1 = tabWithIngredients[i].ingredient.trim().replace("  ", " ");
        console.log("1", ingredient1);
        for (let j = i + 1; j < tabWithIngredients.length; j++) {
            let ingredient2 = tabWithIngredients[j].ingredient.trim().replace("  ", " ");
            console.log("2", ingredient2);
            if (ingredient1.toLowerCase() === ingredient2.toLowerCase()) {
                let measure1 = tabWithIngredients[i].measure;
                let measure2 = tabWithIngredients[j].measure;
                if (measure1 === "" || measure2 === "") {
                    console.log("tutaj");
                    measure1 += measure2;

                } else if (typeof(parseInt(measure1)) != 'NaN' && typeof(parseInt(measure1)) != 'NaN') {

                    console.log(typeof(parseInt(measure1)) === 'number');
                    console.log(typeof(parseInt(measure2)) === 'number');
                    measure1 = parseInt(measure1);
                    measure2 = parseInt(measure2);

                    measure1 += measure2;

                    tabWithIngredients[i].measure = measure1.toString();
                }
                console.log("!!!!!!!!!!!!!!!!!!!", ingredient1, ingredient2);




                tabWithIngredients.splice(j, 1);
            }

        }
    }
    console.log("fn", tabWithIngredients);
    return tabWithIngredients;
}

const generateIngredientsPdf = (doc, arrCountTheSameIngredients) => {
    let i = 60;
    let margin = 20;
    let pageCount = 0;
    let elementsLength = arrCountTheSameIngredients.length;
    doc.getFontList("Lobster");
    doc.text(90, 20, "Shopping list");
    doc.line(20, 30, 190, 30)
    doc.getFontList("Arial");
    doc.setFontSize(13);
    for (let j = 0; j < elementsLength; j++) {
        let { measure, ingredient } = arrCountTheSameIngredients[j];
        if (isNaN(measure)) {
            toString(measure);
            measure = "";
        }
        //console.log(countMeasure, ingredient);
        if ((i < 260 && pageCount === 0) || (i < 260 && pageCount === 1)) {
            //console.log("f", i);
            doc.text(margin, i, `[   ]  ${measure}  ${ingredient}`);
        }
        if (i === 260 && pageCount === 0) {
            //console.log("s", i);
            doc.text(margin, i, `[   ]  ${measure}  ${ingredient}`);
            margin = 120;
            pageCount = 1;
            i = 50;
        }
        if (i === 260 && pageCount === 1) {
            console.log("t", i);
            doc.text(margin, i, `[   ]  ${measure}  ${ingredient}`);
            pageCount = 2;
        }
        if (i === 260 && pageCount === 2) {
            //console.log("fo", i);
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

const generateShoppingListPdf = async() => {
    const arrWithCountMeals = addDataFromLocalStorage();
    let arrWithSelectedDishes = getNrIndexMealnputChecked();
    if (arrWithSelectedDishes.length === 0) {
        select();
        arrWithSelectedDishes = getNrIndexMealnputChecked();
    }
    let doc = jspdf.jsPDF();
    let tabWithIngredients = [];
    //let tabWithIngredientsSplit = [];

    for (let j = 0; j < arrWithSelectedDishes.length; j++) {
        console.log("dł", arrWithSelectedDishes);
        const el = arrWithSelectedDishes[j]
        const idMeal = arrWithCountMeals[el].idMeals;
        const countMeal = arrWithCountMeals[el].countMeal;
        const regex = /[^0-9]/i;

        console.log(idMeal, countMeal);

        let i = 0;
        while (i !== countMeal) {
            const prom = await getIngredients(idMeal)
            Array.prototype.push.apply(tabWithIngredients, prom);

            i++;
        }
    }

    console.log(tabWithIngredients);

    const tabWithAllIngerdients = splitIngredients(tabWithIngredients);

    const tabcountTheSameIngredients = countTheSameIngredients(tabWithAllIngerdients);

    generateIngredientsPdf(doc, tabcountTheSameIngredients);

}

const buttonGenerateShoppingList = document.querySelector('#generate-shopping-list-basket');

buttonGenerateShoppingList.addEventListener('click', () => {
    generateShoppingListPdf();
})
addItemHTML();