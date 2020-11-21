const { sendError, sendMessage } = require("./message");

var fonoapi = require('./node_modules/fonoapi-nodejs/index.js');
fonoapi.token = '8496acfc705e348d4645c24b8deb7325d4be2cef146ba412';


function mycallback(queryString, data) {
    element = data[0];
    if (typeof element !== 'undefined') {
        result = {
            name: element.DeviceName,
            dimensions: element.dimensions,
            weight: element.weight,
            sim: element.sim,
            size: element.size,
            resolution: element.resolution,
            card_slot: element.card_slot,
            wlan: element.wlan,
            bluetooth: element.bluetooth,
            gps: element.gps,
            battery: element.battery_c,
            stand_by: element.stand_by,
            talk_time: element.talk_time,
            music_play: element.music_play,
            colors: element.colors,
            os: element.os,
            primary: element.primary,
            secondary: element.secondary,
            video: element.video,
            chipset: element.chipset,
            network_c: element.network_c,
            nfc: element.nfc,
            _3_5mm_jack: element._3_5mm_jack,
            _2g_bands: element._2g_bands,
            _3g_bands: element._3g_bands,
            _4g_bands: element._4g_bands,
        };
        sendMessage(rest, result);
    } else {
        sendError(rest, "Device not found on FonoAPI");
    }
}



var result;
var rest;


async function getDeviceInfos(req, res) {
    rest = res;

    if (typeof req.body.Brand === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Brand');
    const Brand = req.body.Brand;

    if (typeof req.body.Model === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée Model');
    const Model = req.body.Model;

    console.log("Recuperations des infos de " + Brand + " " + Model + " sur FonoAPI");

    result = null;
    await fonoapi.getDevices(mycallback, Model, Brand);


    // setTimeout(function() {
    //     if (result != null) {
    //         sendMessage(res, result);
    //     } else {
    //         sendError(res, "Device not found on FonoAPI");
    //     }
    // }, 1000);

}


module.exports = getDeviceInfos;