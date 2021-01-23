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

const api = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const tdIntable1 = document.querySelector("#table--1 > tbody");

//console.log(tdIntable1);
/*
const downoandApi = async(api, generateList) => {

    const apiDownoand = await (await fetch(api)).json();
    //bez sensu?
    if (!generateList) {
        strMeals = '';
        strMeals += apiDownoand.meals[0].strMeal;
        //console.log(1, strMeals);
    } else {
        return apiDownoand.meals[0];
    }
}
*/
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
    // console.log(removeTbody);
    // if (removeTbody.length > 1) {
    //     console.log("remove", removeTbody);
    for (el of removeTbody) {
        ///console.log(el);
        el.remove();
        //     }
        // } else {
        //     removeTbody.remove();
    }
}

//const addApiInHTML = (apiWithId) => {

//}

const countArrWthMeals = () => {
    const arrWithMeals = addDataFromLocalStorage();
    //console.log(arrWithMeals);
    const copyArrWithMeals = JSON.parse(JSON.stringify(arrWithMeals));

    console.log(arrWithMeals);



    for (let i = 0; i < copyArrWithMeals.length; i++) {
        let arrWithCountMeals = [];
        //arrWithCountMeals.push(copyArrWithMeals[i]);
        copyArrWithMeals[i].countMeal = (copyArrWithMeals[i].countMeal || 1);
        //let last = 0;
        console.log("i1", i);
        console.log("arr", arrWithCountMeals);
        for (let j = i; j < copyArrWithMeals.length; j++) {


            if (copyArrWithMeals[i].idMeals === copyArrWithMeals[j].idMeals) {
                console.log();
                console.log(copyArrWithMeals[i].idMeals, "===", copyArrWithMeals[j].idMeals);


                console.log("i", i);
                console.log("j", j);
                copyArrWithMeals[i].countMeal += 1;
                console.log(copyArrWithMeals[i]);
                console.log(copyArrWithMeals[i].countMeal);
                last = copyArrWithMeals[i].countMeal - 1;
                arrWithCountMeals.push(j);

            }
            console.log("last", last);
        }
        copyArrWithMeals[i].countMeal -= 1;
        for (el of copyArrWithMeals) {
            console.log("pcM", el);
        }
        for (let i = arrWithCountMeals.length - 1; i > 0; i--) {
            console.log("remove", arrWithCountMeals[i]);
            copyArrWithMeals.splice(arrWithCountMeals[i], 1);
        }

        console.log("pi", i, "pl", last);

        for (el of copyArrWithMeals) {
            console.log("cM", el);
        }
        for (el of arrWithCountMeals) {
            console.log("aM", el);
        }


    }

    console.log("tab:", copyArrWithMeals);
    console.log("tab1", arrWithMeals);

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



    // for (let i = 0; i < arrWithMeals.length; i++) {

    //     //let count =


    //     //const apiWithId = api + arrWithMeals[i].idMeals;
    //     //console.log(apiWithId);
    //     //await downoandApi(apiWithId, false);
    //     //addElementInTableHtml(i, arrWithMeals[i].idMeals, arrWithMeals[i].title);

    // }
}

const addDataFromLocalStorage = () => {
    const key = "Recipe";
    return getData(key);
}

const buttonSelectAll = document.querySelector(".button-select-basket");

let isClick = 0;

buttonSelectAll.addEventListener('click', function select() {

    const inputCheckbox = document.querySelectorAll(".input-checkbox");

    for (el of inputCheckbox) {
        //console.log("el.checked", el.checked);

        if (!el.checked) {
            //console.log(el.checked);
            el.checked = true;
            //console.log(el.checked);
        }
    }
    //console.log(isClick);
    isClick++;
});

buttonSelectAll.addEventListener('click', function onselect() {
    if (isClick === 2) {
        const inputCheckbox = document.querySelectorAll(".input-checkbox");
        for (el of inputCheckbox) {
            //console.log(isClick);
            if (el.checked) {
                el.checked = false;
            }
        }
        isClick = 0;
    }
});

const removeAddTable = (key, getTabeWithData) => {

    storeData(key, getTabeWithData);
    console.log(storeData);
    const removeTbody = document.querySelectorAll('.tbody-table-1 tr');
    removeItemHtml(removeTbody);
    addItemHTML();
}

const removeIconButtonTbody = document.querySelector(".tbody-table-1");

removeIconButtonTbody.addEventListener('click', (e) => {
    if (e.target.tagName === "DIV" && e.target.classList.contains("div-remove")) {
        const whichTr = e.target.parentNode.parentNode.parentNode;

        let getTabeWithData = countArrWthMeals();
        console.log(getTabeWithData);

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

const removeButton = document.querySelector("#remove-checked");
removeButton.addEventListener('click', () => {
    const inputCheckbox = document.querySelectorAll(".input-checkbox");
    let getTabeWithData = addDataFromLocalStorage();
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
    for (let i = tableWithIndexTr.length - 1; i >= 0; i--) {
        getTabeWithData.splice(tableWithIndexTr[i], 1);
        //console.log("tab", getTabeWithData);
    }
    const key = "Recipe";
    removeAddTable(key, getTabeWithData);
})

addItemHTML();