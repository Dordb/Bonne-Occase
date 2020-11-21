// ici, on se connecte à la base de données. Ainsi, on pourra utiliser
// db (l'équivalent de PDO) pour réaliser les requêtes mySQL.
const config = require("./config");
const db = require("./mysqlConnect");

// chaque requête correspond à une fonction qui renverra ce que l'on appelle
// une Promise (promesse). Une promesse est un objet qui contient une
// fonction (dont on sait qu'elle sera exécutée dans le futur). La promesse
// est renvoyée avant que la fonction ne soit exécutée (fonctionnement donc
// asynchrone). Quand la fonction a été exécutée, la callback appelle la
// fonction resolve qui indique à la promesse qu'elle peut renvoyer la
// réponse en question. Dans le fichier getCours1.js, les lignes 40 et 41
// (celles avec les await) récupèrent ces Promises. L'opérateur await attend
// alors que la promesse soit résolue (resolve) et récupère alors la
// réponse. Ainsi, même si tout ce fonctionnement est asynchrone, la variable
// idsPetitsCours de la ligne 40 du fichier getCours1.js récupérera le
// résultat de la requête mysql quand celui-ci aura été renvoyé par le
// serveur MySQL.

function addPhoneToDB(brand, model) {
    process.stdout.write("Tentative d'ajout du téléphone" + brand + " " + model + " dans la base de données ...");
    let query = `
        INSERT INTO ${config.mysqlPhones} (ID, Marque, Modele)
        VALUES ('', '${brand}', '${model}')`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {
                process.stdout.write("❌❌❌\n");
                return reject(err);
            }
            process.stdout.write("✔✔✔\n");
            resolve(rows);
        });
    });
}
module.exports.addPhoneToDB = addPhoneToDB;

function addExistingScrap(id, price, date, site) {
    process.stdout.write("Tentative d'ajout d'un scrap existant concernant le tel" + id + " sur le site " + site + " le " + date + " Prix = " + price + " ...");
    let query = `
        INSERT INTO ${config.mysqlScraps} (Site, Date, Prix,IDtel,IDScrap)
        VALUES ('${site}', '${date}', '${price}','${id}','')`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {
                process.stdout.write("❌❌❌\n");
                return reject(err);
            }
            process.stdout.write("✔✔✔\n");
            resolve(rows);
        });
    });
}
module.exports.addExistingScrap = addExistingScrap;

function getAllPhoneBrands() {
    process.stdout.write("Tentative de recuperation des marques de telephone ...");
    let query = `
        SELECT DISTINCT Marque FROM ${config.mysqlPhones}`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {
                process.stdout.write("❌❌❌\n");
                return reject(err);
            }
            process.stdout.write("✔✔✔\n");
            resolve(rows);
        });
    });
}
module.exports.getAllPhoneBrands = getAllPhoneBrands;

function getAllBrandModels(Brand) {
    process.stdout.write("Tentative de recuperation des modeles de " + Brand + " ...");
    let query = `
        SELECT DISTINCT Modele FROM ${config.mysqlPhones} WHERE Marque='${Brand}'`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {
                process.stdout.write("❌❌❌\n");
                return reject(err);
            }
            process.stdout.write("✔✔✔\n");
            resolve(rows);
        });
    });
}
module.exports.getAllBrandModels = getAllBrandModels;

function getPhoneID(phoneBrand, phoneModel) {
    process.stdout.write("Tentative de recuperation de l'id du telephone " + phoneBrand + " " + phoneModel + " ...");
    let query = `
        SELECT ID FROM ${config.mysqlPhones} 
        WHERE Marque = "${phoneBrand}" AND Modele = "${phoneModel}"`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {
                process.stdout.write("❌❌❌\n");
                return reject(err);
            }
            process.stdout.write("✔✔✔\n");
            resolve(rows);
        });
    });
}
module.exports.getPhoneID = getPhoneID;

function getPhonePrices(id, Site) {
    process.stdout.write("Tentative de recuperation des prix du telephone ID=" + id + " sur le site " + Site + " ...");
    let query = `
        SELECT Date, Prix FROM ${config.mysqlScraps} 
        WHERE IDtel = "${id}" AND Site = "${Site}"`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {
                process.stdout.write("❌❌❌\n");
                return reject(err);
            }
            process.stdout.write("✔✔✔\n");
            resolve(rows);
        });
    });
}
module.exports.getPhonePrices = getPhonePrices;

function getUser(username, password) {
    console.log("Tentative de connexion : login=" + username + " pwd=" + password);
    let query = `
      SELECT * FROM ${config.mysqlUsers} 
      WHERE login = '${username}' AND password = '${password}'`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getUser = getUser;