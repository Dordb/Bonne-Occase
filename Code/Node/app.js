// on crée le serveur web sur le port 3000
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// body-parser permet de récupérer facilement les données passées en POST
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// permet d'éviter le problème de CORS que l'on avait déjà vu
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// ici, on met en place les routes qui seront servies par le serveur web :
// chaque route correspond à un fichier que l'on charge via un require. Ce
// fichier exporte juste une fonction, que l'on appelle quand l'utilisateur
// demande à accéder à la route.
const newScrapTopAchat = require('./newScrapTopAchat');
const getAllPhoneBrands = require('./getAllPhoneBrands');
const getBrandModels = require('./getBrandModels');
const getPhonePrices = require('./getPhonePrices');
const addScrapToDB = require('./addscraptodb');
const addPhoneToDB = require('./addPhoneToDB');
const checkLogin = require('./checkLogin');
const getDeviceInfos = require('./getDeviceInfos');


app.post('/newScrapTopAchat', (req, res) => { newScrapTopAchat(req, res); });
app.post('/getAllPhoneBrands', (req, res) => { getAllPhoneBrands(req, res); });
app.post('/getBrandModels', (req, res) => { getBrandModels(req, res); });
app.post('/getPhonePrices', (req, res) => { getPhonePrices(req, res); });
app.post('/addScrapToDB', (req, res) => { addScrapToDB(req, res); });
app.post('/addPhoneToDB', (req, res) => { addPhoneToDB(req, res); });
app.post('/checkLogin', (req, res) => { checkLogin(req, res); });
app.post('/getDeviceInfos', (req, res) => { getDeviceInfos(req, res); });


app.listen(port, () => { console.log(`listening on port ${port}`) });