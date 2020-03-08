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
 * https://open.feishu.cn/document/ukTMukTMukTM/uEDO4UjLxgDO14SM4gTN
 * @param {String} code 来自请求身份验证(新)流程，用户扫码登录后会自动302到redirect_uri并带上此参数
 */
exports.getUserInfoByCode = async function (code) {
  return this.request({
    method: 'post',
    url: 'authen/v1/access_token',
    data: {
      app_access_token: (await this.ensureAccessToken()).accessToken,
      grant_type: 'authorization_code',
      code
    },
    ignoreAccessToken: true
  })
}

exports.getUserInfoByUserAccessToken = async function (accessToken) {
  return this.request({
    url: 'authen/v1/user_info',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    ignoreAccessToken: true
  })
}


/**
 * 通过 login 接口获取到登录凭证后，开发者可以通过服务器发送请求的方式获取 session_key 和 openId
 * https://open.feishu.cn/document/uYjL24iN/ukjM04SOyQjL5IDN
 * @param {String} 登录时获取的 code
 */
exports.getUserInfoByMiniAppCode = async function (code) {
  return this.request({
    method: 'post',
    url: 'mina/v2/tokenLoginValidate',
    data: {
      code
    }
  })
}


