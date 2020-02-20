const crypto = require('crypto');

/**
 * 加解密信息构造函数
 *
 * @param {String} token          设置的Token
 * @param {String} encodingAESKey 设置的EncodingAESKey
 * @param {String} id             suiteid
 */
const LarkCrypt = function (token, encodingAESKey, id) {
    if (!token || !id) {
        throw new Error('please check arguments');
    }
    this.token = token;
    this.id = id;
    if (encodingAESKey) {
        this.key = crypto.createHash('sha256').update(encodingAESKey, 'utf8').digest();
    }
};

/**
 * 对密文进行解密
 *
 * @param {String} text 待解密的密文
 */
LarkCrypt.prototype.decrypt = function(text) {
    let buf = Buffer.from(text, 'base64');
    let decipher = crypto.createDecipheriv('aes-256-cbc', this.key, buf.slice(0, 16));
    let deciphered = Buffer.concat([decipher.update(buf.slice(16)), decipher.final()]);
    return JSON.parse(deciphered.toString());
};


module.exports = LarkCrypt;



//let crypt = new LarkCrypt('along', 'zvb9pr3w6hpol1re9sk85d37me4i7liazikiunslci8', 'suite4xxxxxxxxxxxxxxx');
//console.log('da59f9e658057569616f9fdb26f3e16ec5b6a904' === dingCrypt.getSignature('1466505128368', '3nH71pLV', 'D6vOBD1kWeyb+bzC1oJNdEzm6Owrb7HPS8P01omJXyzyk5/u/e4OfH1YXHNgJ1snZb0ZIg/4HA6aePhhl2lxtsw8nJVQKi+A9GDb3qIw0YKuUdBQGFC50gPodlqS3Rdz4FLdEkOwyS+BxNXVFfzdTqB+JrtYN1ifrrMm78qGMap59HlNNiAye3/xkGo4Kq3iZmXQPBtp4KS1YzvpmMueoQ=='));
//
//let result = crypt.decrypt('D6vOBD1kWeyb+bzC1oJNdEzm6Owrb7HPS8P01omJXyzyk5/u/e4OfH1YXHNgJ1snZb0ZIg/4HA6aePhhl2lxtsw8nJVQKi+A9GDb3qIw0YKuUdBQGFC50gPodlqS3Rdz4FLdEkOwyS+BxNXVFfzdTqB+JrtYN1ifrrMm78qGMap59HlNNiAye3/xkGo4Kq3iZmXQPBtp4KS1YzvpmMueoQ==');
//console.log(JSON.parse(result.message))
//
