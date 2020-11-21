const { sendError, sendMessage } = require("./message");
const queries = require('./mysqlQueries');

//Ajout du JWT
const sessionJwt = require('./sessionJWT');

// l'idée de ce fichier est de réaliser toute l'authentification. Pour
// l'instant, le temps de tester vos fonctions getCours, getTopics, etc,
// le fichier va rester relativement vide, à l'exception de getSession
// qui renverra un objet JavaScript contenant uniquement un champ codé en
// dur avec l'ID de l'utilisateur qui a fait la requête. Cet ID vous
// servira notamment pour vos requêtes mySQL.
function getSession(req) {
    //return { userId: 1 };
    return sessionJwt.decodeSessionCookie(req);
}
module.exports.getSession = getSession;


// cette fonction ajoute le cookie de session au headers du
// message qui sera renvoyé à Angular. Si le cookie actuel
// est "vieux", on en recrée ici un nouveau.
function setSessionCookie(req, res, session) {
    sessionJwt.createSessionCookie(req, res, session);
}
module.exports.setSessionCookie = setSessionCookie;

// fonction pour récupérer le userId provenant du cookie
// de session. Si ce dernier n'existe pas, on renvoie
// l'ID -1.
function getUserId(session) {
    if (typeof session.userId === 'undefined') return -1;
    return session.userId;
}
module.exports.getUserId = getUserId;