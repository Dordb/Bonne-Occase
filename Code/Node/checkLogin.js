const queries = require('./mysqlQueries');
var sha256 = require('js-sha256');

const { sendError, sendMessage } = require("./message");

const auth = require('./auth');

async function checkLogin(req, res) {
    if (typeof req.body.username === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée username');
    const username = req.body.username;

    if (typeof req.body.password === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée password');
    const password = req.body.password;

    hash = sha256(password);

    const users = await queries.getUser(username, hash);

    if (users.length === 1) {
        session = {
            'userId': users[0]['userID']
        }
        auth.setSessionCookie(req, res, session);
        console.log("Connexion de login:" + username);

        const result = users;

        // on renvoie au format JSON la liste des cours demandés par l'utilisateur
        sendMessage(res, req.cookies.SESSIONID);
    } else {
        sendError(res, false);
    }

}


module.exports = checkLogin;