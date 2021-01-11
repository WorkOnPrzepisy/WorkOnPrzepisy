const apiRandomMeal = "https://www.themealdb.com/api/json/v1/1/random.php"
$('#carouselFade').carousel();

const isFluke = function() {
    let pageIsFluke;
    hrefInPage = window.location.href;
    pageIsFluke = hrefInPage.slice(hrefInPage.indexOf('=') + 1);
    return Boolean(pageIsFluke);
}
const pageIsFluke = isFluke();

if(pageIsFluke){
    const title = document.querySelector('title');
    title.innerText = "Fluke";
}else{
    const title = document.querySelector('title');
    title.innerText = "Recipe";
}


const downloadApi = async() => {
    apiDownoand = await (await fetch(apiRandomMeal)).json();;
    //console.log(apiDownoand.meals[0]);
    return apiDownoand.meals[0]

}

let apiDownoand = downloadApi();

//console.log(apiDownoand);

const addInHTMl = apiDownoand.then( resp => {
    console.log(resp);
    const {strMeal, strMealThumb, strInstructions} = resp;
    const tabObiectIngredients = [];
    for(let i = 1; i <= 20; i++){
        //const {`${strIngredient}$[i]`}
        if(resp[`strIngredient${i}`] !== "" && resp[`strIngredient${i}`] != null) {
            tabObiectIngredients.push({ measure : resp[`strMeasure${i}`], ingredient : resp[`strIngredient${i}`]});
        }else{
            break;
        }   
    }
    //console.log(strMeal, strMealThumb,tabObiectIngredients);
    return {strMeal, strMealThumb,tabObiectIngredients, strInstructions};
}). catch(e => {
    console.dir(`
    error in unpacking api: ${e}`)});
    
addInHTMl.then( resp => {
    console.log(resp);
    const hTitleDish = document.querySelector('#title-dish');
    const imgDish = document.querySelector('#img-dish');
    const listIngredients = document.querySelector('#list-ingredients');
    const listIngredientscol2 = document.querySelector('#list-ingredients-col2');
    hTitleDish.innerText = resp.strMeal;
    imgDish.src = resp.strMealThumb;

    tabObiectIngredientsLength = resp.tabObiectIngredients.length;

    for(let i = 0; i < resp.tabObiectIngredients.length; i++){
        const li = document.createElement('li');
        li.classList.add("li-ingredient");

        if(i < 10){
        li.innerText = `${resp.tabObiectIngredients[i].measure} - ${resp.tabObiectIngredients[i].ingredient}`;
        listIngredients.appendChild(li);
        } else{
            li.innerText = `${resp.tabObiectIngredients[i].measure} - ${resp.tabObiectIngredients[i].ingredient}`;
            listIngredientscol2.appendChild(li);
        }
    }
}).catch(e => {
    console.dir(`
    error in unpacking api: ${e}`)});
