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
async function getBrandModels(req, res) {

    if (typeof req.body.Brand === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Brand');
    const Brand = req.body.Brand;

    //console.log("Tentative de recuperation des modeles de " + Brand);


    brands = await queries.getAllBrandModels(Brand);

    // on renvoie au format JSON la liste des cours demandés par l'utilisateur
    sendMessage(res, brands);
}


module.exports = getBrandModels;