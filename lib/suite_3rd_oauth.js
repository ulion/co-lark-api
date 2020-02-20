const querystring = require('querystring')

/**
 * 获取授权页面的URL地址
 * https://work.weixin.qq.com/api/doc#90001/90143/91120获取code
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 应用授权作用域，snsapi_base：静默授权，可获取成员的基础信息；snsapi_userinfo：静默授权，可获取成员的详细信息，但不包含手机、邮箱；snsapi_privateinfo：手动授权，可获取成员的详细信息，包含手机、邮箱。
 */
exports.getAuthorizeURL = function (redirect, state, scope) {
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize'
  const info = {
    appid: this.config.suiteId,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope,
    state: state || ''
  }

  return url + '?' + querystring.stringify(info) + '#wechat_redirect'
}

/**
 * 根据code获取成员信息
 * https://work.weixin.qq.com/api/doc#90001/90143/91121根据code获取成员信息
 * @param {String} code 通过成员授权获取到的code，最大为512字节。每次成员授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
 */
exports.getUserIdByCode = async function (code) {
  return this.request({
    url: 'service/getuserinfo3rd',
    params: {
      access_token: (await this.ensureAccessToken()).accessToken,
      code
    },
    ignoreAccessToken: true
  })
}

/**
 * 使用user_ticket获取成员详情
 * https://work.weixin.qq.com/api/doc#90001/90143/91122使用user_ticket获取成员详情
 * @param {String} userTicket getUserIdByCode获取的user_ticket
 */
exports.getUserInfoByTicket = async function (userTicket) {
  return this.request({
    method: 'post',
    url: 'service/getuserdetail3rd',
    params: {
      access_token: (await this.ensureAccessToken()).accessToken
    },
    data: {
      user_ticket: userTicket
    },
    ignoreAccessToken: true
  })
}
