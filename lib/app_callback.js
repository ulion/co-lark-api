const http = require('http');
const LarkCrypt = require('./api_crypto');

// Patch http.ServerResponse for easy reply
http.ServerResponse.prototype.status = function(code) {
    this.statusCode = code;
    return this;
};

http.ServerResponse.prototype.json = function(body) {
    const json = Buffer.from(JSON.stringify(body));
    this.setHeader("Content-Type", "application/json");
    this.setHeader("Content-Length", json.length);
    return this.end(json);
}

// https://open.lark.cn/document/ukTMukTMukTM/uUTNz4SN1MjL1UzM
module.exports = function(config, callback) {
    let fsCrypt = new LarkCrypt(config.token, config.encodingAESKey, config.appId);

    const TICKET_EXPIRES_IN = config.ticket_expires_in || 1000 * 60 * 59 //59分钟
    return function(req, res, next) {
        console.log('query', req.query);
//        console.log('body', req.body, req.body.length);
        let msg = req.body;
        let encrypt = msg.encrypt;

        if (msg.encrypt) {
            try {
                msg = fsCrypt.decrypt(msg.encrypt);
                console.log('decrypted body:', msg);
            }
            catch (e) {
                return res.status(400).end('Invalid encrypt request');
            }
        }

        if (msg.token !== config.token) {
            return res.status(401).end('Invalid token');
        }

        if (msg.challenge) {
            // url_verification
            console.log('auto replied lark callback:', msg.type);
            return res.json({
                challenge: msg.challenge
            });
        }

        /*
{ uuid: 'ab569e1caf2a17f8ebd06da303df520f',
I20200219-16:09:14.332(8)?   event:
I20200219-16:09:14.332(8)?    { app_id: '',
I20200219-16:09:14.336(8)?      app_ticket: '1ec138612ac731cfdc1e33b6ffb807aa0d806e88',
I20200219-16:09:14.336(8)?      type: 'app_ticket' },
I20200219-16:09:14.337(8)?   token: '',
I20200219-16:09:14.337(8)?   ts: '1582099754.204331',
I20200219-16:09:14.337(8)?   type: 'event_callback' }
*/

        res.reply = function() {
            res.json({});
        }
        if (msg.type === 'event_callback') {
            const event = msg.event;
            if (event.appId && event.appId !== config.appId) {
                return res.status(403).end('Invalid appId');
            }
            if (config.saveTicket && event.type === 'app_ticket') {
                const data = {
                    ticket: event.app_ticket,
                    expireTime: Number(msg.ts)*1000 + TICKET_EXPIRES_IN
                }
                config.saveTicket(data);
                return res.reply();
            } else {
                return callback(msg, req, res, next);
            }
        }

        return res.status(500).end('Unknow message type');
    }
}

