const jdpsf = window.jspdf;

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



const tdIntable1 = document.querySelector("#table--1 > tbody");

const downoandApi = async(api) => {

    const apiDownoand = await (await fetch(api)).json();
    //console.log(apiDownoand.meals[0]);
    const meal = apiDownoand.meals[0];

    return meal;

}

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
    aElement.href = `../views/fluke.html?page=&${idMeal}`;
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


                console.log("i", i);
                console.log("j", j);
                copyArrWithMeals[i].countMeal += 1;
                //console.log(copyArrWithMeals[i]);
                console.log(copyArrWithMeals[i].countMeal);
                last = copyArrWithMeals[i].countMeal - 1;
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

    for (el of inputCheckbox) {
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
        for (el of inputCheckbox) {
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
    for (el of inputCheckbox) {
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
    let apiRecipe = api;
    apiRecipe += idMeal;
    console.log(apiRecipe);
    let j = 1;
    let tabObiectIngredients = [];
    const tab = downoandApi(apiRecipe)
        .then((prom) => {

            //console.log("tu", prom);
            const { strMeal } = prom;
            console.log(strMeal);

            //console.log("juuu", prom[`strIngredient${j}`]);
            while (!!(prom[`strIngredient${j}`] !== "" && prom[`strIngredient${j}`] != null)) {
                //console.log("juuu", prom[`strIngredient${j}`]);
                tabObiectIngredients.push({
                    measure: prom[`strMeasure${j}`],
                    ingredient: prom[`strIngredient${j}`],
                });
                j++;
            }
            //console.log("huhu", tabObiectIngredients);
            return tabObiectIngredients;

        })
        .catch((e) => {
            console.dir(`error in unpacking api: ${e}`);
        });

    return tab;


}

const countTheSameIngredients = (tabWithIngredientsSplit) => {
    //console.log("fn", tabWithIngredientsSplit);
    let tabDelete = [];
    for (let i = 0; i < tabWithIngredientsSplit.length; i++) {

        for (let j = i + 1; j < tabWithIngredientsSplit.length; j++) {
            //console.log("i", i, "j", j);
            let ingredient1 = tabWithIngredientsSplit[i].ingredient,
                ingredient2 = tabWithIngredientsSplit[j].ingredient
                //console.log(ingredient1.toLowerCase(), ingredient2);
            if (ingredient1.toLowerCase() === ingredient2.toLowerCase()) {
                tabWithIngredientsSplit[i].countMeasure *= 2;
                tabDelete.push(j);
            }
        }
    }
    for (let i = tabDelete.length - 1; i >= 0; i--) {
        //console.log("remove", tabWithIngredientsSplit[i]);
        tabWithIngredientsSplit.splice(tabDelete[i], 1);
    }
    //console.log("fn2", tabWithIngredientsSplit);
    return tabWithIngredientsSplit;
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
        let { countMeasure, ingredient } = arrCountTheSameIngredients[j];
        if (isNaN(countMeasure)) {
            toString(countMeasure);
            countMeasure = "";
        }
        //console.log(countMeasure, ingredient);
        if ((i < 260 && pageCount === 0) || (i < 260 && pageCount === 1)) {
            //console.log("f", i);
            doc.text(margin, i, `[   ]  ${countMeasure}  ${ingredient}`);
        }
        if (i === 260 && pageCount === 0) {
            //console.log("s", i);
            doc.text(margin, i, `[   ]  ${countMeasure}  ${ingredient}`);
            margin = 120;
            pageCount = 1;
            i = 50;
        }
        if (i === 260 && pageCount === 1) {
            console.log("t", i);
            doc.text(margin, i, `[   ]  ${countMeasure}  ${ingredient}`);
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
    let tabWithIngredientsSplit = [];

    for (let j = 0; j < arrWithSelectedDishes.length; j++) {
        //console.log("dł", arrWithSelectedDishes.length);
        const el = arrWithSelectedDishes[j]
        const idMeal = arrWithCountMeals[el].idMeals;
        const countMeal = arrWithCountMeals[el].countMeal;
        const regex = /[^0-9]/i;
        //console.log("dł j", j);
        for (let i = 1; i <= countMeal; i++) {
            await getIngredients(idMeal).then((prom) => {
                Array.prototype.push.apply(tabWithIngredients, prom);
                // console.log("no", tabWithIngredients);
                //console.log("dł j 2", j);
                //console.log("dł 2", arrWithSelectedDishes.length);
                if ((arrWithSelectedDishes.length - 1) === j && countMeal == i) {
                    // console.log("ost");
                    //console.log("no", tabWithIngredients);
                    for (let a = 0; a < tabWithIngredients.length; a++) {
                        //console.log(tabWithIngredients.length);
                        //console.log(a);
                        let strIngredients = (tabWithIngredients[a].measure + " " + tabWithIngredients[a].ingredient);
                        //console.log(strIngredients);
                        const splitStrIngredients = {
                            countMeasure: 0,
                            ingredient: ""
                        }
                        splitStrIngredients.countMeasure = parseInt(strIngredients.slice(0, strIngredients.search(regex)));
                        splitStrIngredients.ingredient = strIngredients.slice(strIngredients.search(regex)).trim().replace("  ", " ");
                        //console.log(splitStrIngredients);
                        //console.log(tabWithIngredientsSplit);
                        tabWithIngredientsSplit.push(splitStrIngredients);
                    }
                    //console.log(tabWithIngredientsSplit);
                    //console.log(typeof tabWithIngredientsSplit);
                    const arrCountTheSameIngredients = countTheSameIngredients(tabWithIngredientsSplit);
                    //console.log("fn3", arrCountTheSameIngredients);
                    generateIngredientsPdf(doc, arrCountTheSameIngredients);

                }
            })
        }
    }

}



const buttonGenerateShoppingList = document.querySelector('#generate-shopping-list-basket');

buttonGenerateShoppingList.addEventListener('click', () => {
    generateShoppingListPdf();
})
addItemHTML();