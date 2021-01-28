
const fetch = require('node-fetch');

const nodeFetch = arr => Promise.all(arr.map(id => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
.then(res => res.json())))


module.exports = nodeFetch