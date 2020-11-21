const fs = require('fs');
const fileName = './topachat-phones-15-5-2020.json';
const file = require(fileName);

file.forEach((e) => {
    e.brand = e.model.split(' ')[0]
    e.model = e.model.split(' -')[0].split(' ')
    e.model.splice(0, 1)
    e.model = e.model.join(' ')
})

// const result = file.filter((phone, phoneIndex, phones) =>
//     phones.findIndex(t => (t.model === phone.model)) === phoneIndex
// )

fs.writeFile("res.json", JSON.stringify(file), function writeJSON(err) {
    if (err) return console.log(err)
    console.log('writing to ' + fileName)
});