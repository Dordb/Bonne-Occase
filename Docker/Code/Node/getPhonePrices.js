// le fichier mysqlQueries contient des fonctions qui réalisent
// les queries dans la base de données.
const queries = require('./mysqlQueries');

// ici, on utilise ce que l'on appelle l'object destructuring de
// JavaScript afin de récupérer les fonctions sendError et sendMessage.
// ce sont les équivalents des fonctions du même nom que vous aviez
// utilisées en PHP (voir helper.php). L'intérêt de l'object destructuring
// réside dans le fait que l'on va pouvoir appeler directement les fonctions
// sendError et sendMessage. Si l'on avait écrit :
// const message = require ("./message");
// on aurait dû, par la suite, appeler message.sendError () et
// message.sendMessage ().
const { sendError, sendMessage } = require("./message");


// ici, pour réaliser séquentiellement plusieurs requêtes mySQL (ce
// qui devra être fait pour répondre à certaines requêtes de votre
// appli Angular, on va utiliser l'opérateur "await "(voir ci-dessous).
// A noter que toutes les fonctions qui utilisent ce mot clef doivent
// être déclarées comme asynchrones via le mot clef async
async function getPhonePrices(req, res) {

    if (typeof req.body.Site === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Site');
    const Site = req.body.Site;

    if (typeof req.body.Brand === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Brand');
    const Brand = req.body.Brand;

    if (typeof req.body.Model === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Model');
    const Model = req.body.Model;

    

    let id = await queries.getPhoneID(Brand,Model);

    id = JSON.parse(JSON.stringify(id))[0].ID;
    var result = await queries.getPhonePrices(id,Site);
    
    sendMessage(res, result);
    

}


module.exports = getPhonePrices;