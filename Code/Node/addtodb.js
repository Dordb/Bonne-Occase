const fs = require('fs');
const fileName = './Results/res.json';
const file = require(fileName);

const queries = require('./mysqlQueries');



const marques = [];
const modeles = [];

file.forEach((e) => {
    if(!modeles.includes(e.model)){
        marques.push(e.brand);
        modeles.push(e.model);
    }
})

for (let i = 0; i < modeles.length; i++) {
    var x = queries.addPhoneToDB(marques[i],modeles[i]);
}

console.log(modeles);