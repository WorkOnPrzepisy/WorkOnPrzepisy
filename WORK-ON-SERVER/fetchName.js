
const fetch = require('node-fetch');

const nameAPI  = name =>  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
.then(res=>res.json())


module.exports = nameAPI