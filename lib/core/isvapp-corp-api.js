const CorpAPI = require('./corp-api')

/**
 * 企业套件应用API
 */
class ISVAppCorpAPI extends CorpAPI {
  /**
   * 根据suiteApi、authCorpId和permanentCode创建套件应用API的构造函数
   * @param {SuiteAPI} suiteApi 当前应用对应的企业套件API实例
   * @param {String} authCorpId 当前套件授权的企业ID
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (isvAppApi, authCorpId, getToken, saveToken) {
    super(authCorpId, '', getToken, saveToken)

    this.isvAppApi = isvAppApi
  }

  /**
   * 获取企业微信套件应用的access_token
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const {corpId} = this.config
    return this.isvAppApi.getCorpToken(corpId)
  }
}

module.exports = ISVAppCorpAPI
