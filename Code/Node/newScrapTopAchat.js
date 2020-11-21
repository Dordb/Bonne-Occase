// le fichier mysqlQueries contient des fonctions qui réalisent les queries dans la base de données.
const queries = require('./mysqlQueries');


const { sendError, sendMessage } = require("./message");

const fs = require('fs');

function scrap() {
    const cheerio = require('cheerio');
    const puppeteer = require('puppeteer');

    const phones = [];
    var result = [];

    var fs = require('fs');

    const url = 'https://www.topachat.com/pages/produits_cat_est_telephonie_puis_rubrique_est_wt_smartp_puis_nblignes_est_200_puis_ordre_est_R_puis_sens_est_DESC.html';

    //console.log("Scrapping from", url);

    puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then(function() {
                return page.content();
            });
        })
        .then(html => {
            const $ = cheerio.load(html);
            $('.produits > .grille-produit').each(function() {
                name = $(this).find('.libelle > a > h3').text();
                price = $(this).find('.prod_px_euro').text();
                phones.push({
                    model: name,
                    price: price,
                });
            });


            const regexXR = /XR/gi;

            // Recup marque modele et prix 
            phones.forEach((e) => {
                e.brand = e.model.split(' ')[0]
                e.model = e.model.replace(regexXR, 'Xr')
                e.model = e.model.split(' -')[0].split(' ')
                e.model.splice(0, 1)
                e.model = e.model.join(' ')
                e.model = e.model.split(',')[0]
                e.model = e.model.split(' Go')[0]
                e.model = e.model.split(' 32')[0]
                e.model = e.model.split(' 64')[0]
                e.model = e.model.split(' 128')[0]
                e.model = e.model.split(' 256')[0]
                e.model = e.model.split(' Noir')[0]
                e.model = e.model.split(' Rose')[0]
                e.model = e.model.split(' Or')[0]
                e.model = e.model.split(' Argent')[0]
                e.model = e.model.split(' Bleu')[0]
                e.model = e.model.split(' Dual SIM')[0]
                e.model = e.model.split(' (')[0]
                e.model = e.model.split(' (4G)')[0]
                e.model = e.model.split(' (5G)')[0]
                e.model = e.model.split(' (4G+)')[0]
                e.model = e.model.split(' Gris')[0]

            })

            var marques = [];
            var modeles = [];
            var prices = [];

            // Enleve les doublons et garde le prix le plus bas
            phones.forEach((e) => {
                if (!modeles.includes(e.model)) {
                    marques.push(e.brand);
                    modeles.push(e.model);
                    prices.push(e.price);
                } else {
                    k = modeles.indexOf(e.model);
                    if (prices[k] > e.price) {
                        prices[k] = e.price;
                    }
                }
            })

            // Création du fichier
            for (let i = 0; i < modeles.length; i++) {
                result.push({
                    brand: marques[i],
                    model: modeles[i],
                    price: prices[i],
                });
            }


            let file = "./Results/topachat-phones-" + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + ".json";

            fs.writeFile(
                file,
                JSON.stringify(result),
                function(err) {
                    if (err) {
                        console.error('Crap happens');
                    }
                }
            );

        })
        .catch(console.error);


    return new Promise(resolve => {
        setTimeout(function() {
            resolve(result);
        }, 5000);
    });
}



var d = new Date();

// ici, pour réaliser séquentiellement plusieurs requêtes mySQL (ce
// qui devra être fait pour répondre à certaines requêtes de votre
// appli Angular, on va utiliser l'opérateur "await "(voir ci-dessous).
// A noter que toutes les fonctions qui utilisent ce mot clef doivent
// être déclarées comme asynchrones via le mot clef async
async function newScrapTopAchat(req, res) {
    marques = [];
    modeles = [];
    prices = [];
    result = [];

    d = new Date();

    //console.log("Tentative de scrap topachat");
    process.stdout.write("Tentative de scrap topachat ...");

    scraps = await scrap();

    process.stdout.write("✔✔✔\n");

    // on renvoie au format JSON la liste des cours demandés par l'utilisateur

    sendMessage(res, scraps);
}


module.exports = newScrapTopAchat;