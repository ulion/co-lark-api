const API = require('./api')

/**
 * 企业自建应用API
 */
class CorpAPI extends API {
  /**
   * 根据corpId和corpSecret创建API的构造函数
   * @param {String} corpId 企业ID
   * @param {String} corpSecret 企业ID对应的密钥
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (corpId, corpSecret, getToken, saveToken) {
    super({
      corpId,
      corpSecret
    }, getToken, saveToken)
  }

  /**
   * 获取企业微信access_token
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const {corpId, corpSecret} = this.config

    return this.request({
      url: 'gettoken',
      params: {
        corpid: corpId,
        corpsecret: corpSecret
      },
      ignoreAccessToken: true
    })
  }

  /**
   * 获取企业微信ticket
   * @param {String} type 类型
   * @returns {Promise.<TResult>}
   */
  async resolveTicket (type) {
    if (type === 'jsapi') {
      return this.getJsApiTicket()
    }
    return Promise.resolve(null)
  }
}

module.exports = CorpAPI
