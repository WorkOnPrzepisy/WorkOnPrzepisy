const formId = document.querySelector('#formId')
const conterenek = document.querySelector('#conteiner-result')
const newContainer = document.querySelector('#new-container')



formId.addEventListener('submit', async function(e){ 
         const searchInputData = document.querySelector('#searchInputData')
         e.preventDefault()
         const valueOfInput= searchInputData.value
         const respones= await fetch('/users/favorites',{ 
            method: 'POST',
            body: JSON.stringify({name: valueOfInput}),
            headers: { 
            "Content-Type": "application/json"
            }
         })  
         const data =  await respones.json()
         
      // DATABASE CONTENT TO SHOW 
         const keyData = data.key  
         const keyData1 = data.key1

         const contentDisplay =()=>{ 

            if(valueOfInput== ""){ 
               conterenek.style.display = "flex"
               newContainer.style.display= 'none'
               window.location.reload()
            }

        else if(keyData == undefined){ 
         
         const {idMeal,strMeal,strMealThumb} = keyData1
         
         conterenek.style.display = "none";

         const html = `<div class="new-added">
            <div class="new-content">
               <div class="header">
                  <h3 id='dish-name1'>${strMeal}</h3>
               </div>  
               <div class="image-content" id='new-image'>
                  <img 
                  id='new-image-content'
                  src="${strMealThumb}" height='300px' width='300px' alt=""> 
               </div> 
               <div class="buttonn">
                  <a href="/users/happines?api_id=${idMeal}" class="btn-verify">
                     <button type="submit">more</button>
                  </a>
                  </div> 
            </div>
         </div>` 
         newContainer.innerHTML = html
         newContainer.classList.add('fade-in')
         searchInputData.value = ''
         } else if(keyData1 == undefined){ 
            
            const {strMeal, _id, images} = keyData
            const imgData = images.imgThumb
            conterenek.style.display = "none";

            const html=  `<div class="new-added">
            <div class="new-content">
               <div class="header">
                  <h3 id='dish-name1'>${strMeal}</h3>
               </div> 
               <div class="image-content" id='new-image'>
                  <img 
                  id='new-image-content'
                  src="data:image/png;base64,${imgData}" height='300px' width='300px' alt=""> 
               </div>
               <div class="buttonn">
                  <a href="/users/happines?db_id=${_id}" class="btn-verify">
                     <button type="submit">more</button>
                  </a>
                  </div> 
               </div>
            </div>`
            
            newContainer.innerHTML = html
            newContainer.classList.add('fade-in')
            searchInputData.value = ''
         }
      }
       contentDisplay() 
      })  




