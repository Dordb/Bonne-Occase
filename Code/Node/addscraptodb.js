const queries = require('./mysqlQueries');
const { sendError, sendMessage } = require("./message");


// ici, pour réaliser séquentiellement plusieurs requêtes mySQL (ce
// qui devra être fait pour répondre à certaines requêtes de votre
// appli Angular, on va utiliser l'opérateur "await "(voir ci-dessous).
// A noter que toutes les fonctions qui utilisent ce mot clef doivent
// être déclarées comme asynchrones via le mot clef async
async function AddScrapToDB(req, res) {

    models = [];
    brands = [];
    prices = [];

    if (typeof req.body.Phones === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Phones');
    const Phones = req.body.Phones;

    Phones.forEach((e) => {
        if (!models.includes(e.model)) {
            brands.push(e.brand);
            models.push(e.model);
            prices.push(e.price);
        } else {
            k = models.indexOf(e.model);
            if (prices[k] > e.price) {
                prices[k] = e.price;
            }
        }
    })

    result = [];
    errors = [];

    for (let i = 0; i < models.length; i++) {
        result.push({
            brand: brands[i],
            model: models[i],
            price: prices[i],
        });
    }

    let d = new Date();
    let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    for (let index = 0; index < result.length; index++) {
        let element = result[index];
        let id = await queries.getPhoneID(element.brand, element.model);
        if (id != "") {
            id = JSON.parse(JSON.stringify(id))[0].ID;
            await queries.addExistingScrap(id, element.price, date, "TopAchat")
                .then(ok => {})
                .catch(err => {
                    errors.push({
                        brand: element.brand,
                        model: element.model,
                        price: element.price,
                        date: date,
                        error: "Scrap deja existant"
                    });
                })
        } else {
            errors.push({
                brand: element.brand,
                model: element.model,
                price: element.price,
                data: date,
                error: "ID non trouvé"
            });
        }
    }

    console.log(errors);

    sendMessage(res, errors);
}


module.exports = AddScrapToDB;