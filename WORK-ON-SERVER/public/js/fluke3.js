
const apiRandomMeal = "https://www.themealdb.com/api/json/v1/1/random.php";
// $("#carouselFade").carousel();

const isFluke = function() {
    let pageIsFluke;
    const hrefInPage = window.location.href;
    pageIsFluke = hrefInPage.slice(hrefInPage.indexOf("=") + 1, hrefInPage.indexOf("&"));
    return Boolean(pageIsFluke);
};
const pageIsFluke = isFluke();

const urlParams = Object.fromEntries(new URLSearchParams(document.location.search))

const downloadApi = async(api) => {
      apiDownoand = await (await fetch(api)).json();
      return apiDownoand.meals[0];
};

const downloadDb = async db_id => {
    const query = new URLSearchParams({ db_id });

    try {
        const response = await fetch("/users/fluke_id?" + query.toString()).then(_ => _.json());

         another(response)
    }
    catch (error) {
        console.error(error);
    }
};

 const downloadSuitableApi = async (params) => {
    if (params.db_id) {
      await downloadDb(params.db_id);

    }
    else if (params.api_id) {
        const title = document.querySelector("title");
        title.innerText = "Recipe";
        let apiDownoandSuitable = downloadApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.api_id}`);
        return apiDownoandSuitable;
        /* TODO przycisk more na innych stronach !!! */
    }
    else {
        let buttonFluke = document.querySelector("#button-draw-recipe");
        //console.log(buttonFluke);
        buttonFluke.removeAttribute("style");
        const title = document.querySelector("title");
        title.innerText = "Fluke";
        let apiDownoandSuitable = downloadApi(apiRandomMeal);
        console.log(apiDownoandSuitable);
        return apiDownoandSuitable;
    }
}; 

 const another = async(params)=> { 
   const response = await params
   //VALUES FROM DATABSE
   const { strMeal, images, strInstructions,strIngredient1}= response
   const arrayOfIngridients = []
   const imageBuffer= images.strMealThumb

   for (const ingridient of strIngredient1){
      for(const item in ingridient){ 
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

   for (let i = 0; i< arrayOfIngridients.length; i++) {
      const li = document.createElement("li");
      li.classList.add("li-ingredient");
      li.innerText = `${arrayOfIngridients[i]}`;
      listIngredients.appendChild(li);
   }
   listIngredients.lastChild.remove()


   
   }


const addElementsFromApi = () => {
    let apiDownoand = downloadSuitableApi(urlParams);

    //console.log(apiDownoand);

    const addInHTMl = apiDownoand
        .then((resp) => {
            //console.log(resp);
            const { strMeal, strMealThumb, strInstructions } = resp;
            const tabObiectIngredients = [];
            let i = 1;
            //console.log(resp[`strIngredient${i}`] !== "" && resp[`strIngredient${i}`] != null);
            while (!!(resp[`strIngredient${i}`] !== "" && resp[`strIngredient${i}`] != null)) {
                tabObiectIngredients.push({
                    measure: resp[`strMeasure${i}`],
                    ingredient: resp[`strIngredient${i}`],
                });
                i++;
            }
            //console.log(tabObiectIngredients);
            //console.log(strMeal, strMealThumb,tabObiectIngredients);
            return { strMeal, strMealThumb, tabObiectIngredients, strInstructions };
        })
        .catch((e) => {
            console.dir(`
            error in unpacking api: ${e}`);
        });

    addInHTMl
        .then((resp) => {
            //console.log(resp);
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

addElementsFromApi();
const buttonFluke = document.querySelector("#button-draw-recipe");
const buttonFluke1 = document.querySelector(".try-again");

buttonFluke.addEventListener("click", () => {
    let apiDownoand = downloadSuitableApi(pageIsFluke);
    addElementsFromApi();
    removalAddedElementsToHtml();
});
buttonFluke1.addEventListener("click", () => {
   let apiDownoand = downloadSuitableApi(pageIsFluke);
   addElementsFromApi();
   removalAddedElementsToHtml();
});

const buttonGeneratePDF = document.querySelector("#icon-add-recipe");


