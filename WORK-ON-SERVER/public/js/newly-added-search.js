const formId = document.querySelector('#formId')
const conterenek = document.querySelector('#conteiner-result')
const newContainer = document.querySelector('#new-container')



formId.addEventListener('submit', async function (e) {
   const searchInputData = document.querySelector('#searchInputData')
   e.preventDefault()
   const valueOfInput = searchInputData.value
   const respones = await fetch('/more-added-search', {
      method: 'POST',
      body: JSON.stringify({
         name: valueOfInput
      }),
      headers: {
         "Content-Type": "application/json"
      }
   })
   const data = await respones.json()

   // DATABASE CONTENT TO SHOW   
   const keyData1 = data.key

   if (valueOfInput == "") {

      conterenek.style.display = "flex"
      newContainer.style.display = 'none'
      window.location.reload()
   } else if (valueOfInput !== "") {

      const contentDisplay = () => {
         const {
            name,
            _id,
            images
         } = keyData1
         const imgData = images.imgThumb
         conterenek.style.display = "none";
         const html = `<div class="new-added">
               <div class="new-content">
                  <div class="header">
                     <h3 id='dish-name1'>${name}</h3>
                  </div> 
                  <div class="image-content" id='new-image'>
                     <img 
                     id='new-image-content'
                      src="data:image/png;base64,${imgData}" height='300px' width='300px' alt=""> 
                  </div>
                  <div class="buttonn">
                     <a href="/fluke?db_id=${_id}" class="btn-verify">
                        <button type="submit">more</button>
                     </a>
                     </div> 
                  </div>
               </div>`

         newContainer.innerHTML = html
         newContainer.classList.add('fade-in')
         searchInputData.value = ''

      }

      contentDisplay()
   }







})