const API = require('./api')
const Ticket = require('./ticket')

/**
 * 商店应用API
 */
class ISVAppAPI extends API {
  /**
   * 根据suiteId和suiteSecret创建SuiteAPI的构造函数
   * @param {String} suiteId 企业的套件ID
   * @param {String} suiteSecret 企业的套件ID对应的密钥
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (appId, secret, getToken, saveToken) {
    super({
      appId,
      secret,
      accessTokenKey: 'app_access_token'
    }, getToken, saveToken)
  }

  /**
   * 获取企业微信Suite的access_token的
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const ticketToken = await this.getTicketToken('app')
    console.log('ticket to use:', ticketToken);
    if (!ticketToken || !new Ticket(ticketToken.ticket, ticketToken.expireTime).isValid()) {
      const err = new Error('App ticket is invalid.')
      err.name = 'LarkISVAPIError'
      throw err
    }

    const {appId, secret} = this.config
    return this.request({
      method: 'post',
      url: 'auth/v3/app_access_token/',
      data: {
        app_id: appId,
        app_secret: secret,
        app_ticket: ticketToken.ticket
      },
      ignoreAccessToken: true
    }).then(({app_access_token, expire}) => {
      return {
        access_token: app_access_token,
        expires_in: expire
      }
    })
  }

  /**
   * 获取企业微信Suite的access_token的
   * @returns {Promise.<TResult>}
   */
  async requestAppTicket () {
    const {appId, secret} = this.config
    return this.request({
      method: 'post',
      url: 'auth/v3/app_ticket/resend/',
      data: {
        app_id: appId,
        app_secret: secret
      },
      ignoreAccessToken: true
    });
  }

  /**
   *
   * @param type
   * @returns {Promise.<null>}
   */
  async resolveTicket (type) {
    if (type === 'app') {
      // 套件的ticket是由微信服务器推送过来的
      throw new Error('App ticket could not resolve')
    }
    return Promise.resolve(null)
  }
}

module.exports = ISVAppAPI
