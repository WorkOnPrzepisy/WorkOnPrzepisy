const term =  'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata'
const formSearch = document.querySelector('#search-form')
const inputSearch = document.querySelector('#search-input') 
const valueContainer = document.querySelector('#search-ul')
// API
const randomMeal = 'https://www.themealdb.com/api/json/v1/1/random.php'
const allMeals = 'https://www.themealdb.com/api/json/v1/1/categories.php'





window.addEventListener('DOMContentLoaded', async (event) => {

  const api = await fetch(allMeals)
  const json = await api.json()
  const allMeal = json.categories

   
   // const size = 3;
   // const items = allMeal.slice(0, size)
   
   const random = Math.floor(Math.random() * allMeal.length)
   const random1 = Math.floor(Math.random() * allMeal.length)
   const random2 = Math.floor(Math.random() * allMeal.length)

      const radomMeal= allMeal[random]
      const randomMeal1 = allMeal[random1]
      const randomMeal2 = allMeal[random2]



   // Images links
   const img = document.querySelector('#new-image-content')
   const img2 = document.querySelector('#new-image-content-2')
   const img3 = document.querySelector('#new-image-content-3')
   
   // Header Names of Disehs
   const header1 = document.querySelector('#dish-name1')
   const header2 = document.querySelector('#dish-name2')
   const header3 = document.querySelector('#dish-name3')

         // Pictues
         img.src =  radomMeal.strCategoryThumb
         img2.src =  randomMeal1.strCategoryThumb
         img3.src =  randomMeal2.strCategoryThumb
         
         // Headings

         header1.textContent = radomMeal.strCategory
         header2.textContent = randomMeal1.strCategory
         header3.textContent = randomMeal2.strCategory

  })


formSearch.addEventListener('submit', async (e)=>{ 
      
      
      e.preventDefault()
      const inputValue = inputSearch.value
      const resp= await  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
      const result = await resp.json()

      result.meals.forEach((item)=>{ 
         // To finish
         console.log(item);

      })

})  





