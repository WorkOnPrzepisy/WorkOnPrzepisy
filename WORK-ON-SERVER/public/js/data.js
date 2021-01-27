const formId = document.querySelector('#formId')
const container = document.querySelector('#conteiner-result')
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

         if(keyData == undefined){ 
          const {idMeal,strMeal,strMealThumb} = keyData1
          return objApi = { 
             idMeal,strMeal,strMealThumb
          }
         } else if(keyData1 == undefined){ 
            const {name, _id, images} = keyData
            const imgData = images.imgThumb
            const obj = { 
               name,_id,imgData
            } 
            return obj

         }
      }
      const usersFave= contentDisplay()
      

      })  




