const querystring = require('querystring')

/**
 * 获取授权页面的URL地址
 * https://work.weixin.qq.com/api/doc#10028/获取code
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 应用授权作用域，snsapi_base：静默授权，可获取成员的基础信息；snsapi_userinfo：静默授权，可获取成员的详细信息，但不包含手机、邮箱；snsapi_privateinfo：手动授权，可获取成员的详细信息，包含手机、邮箱。
 * @param {String} agentid 当scope是snsapi_userinfo或snsapi_privateinfo时，该参数必填
 */
exports.getAuthorizeURL = function (redirect, state, scope, agentid) {
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize'
  const info = {
    appid: this.config.corpId,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope,
    agentid,
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
/*
{
    'app_access_token':'a-32bd8551db2f081cbfd26293f27516390b9feb04',
    'grant_type':'authorization_code',
    'code':'xMSldislSkdK'
}
*/
  return this.request({
    url: 'authen/v1/access_token',
    data: {
      app_access_token: '',
      grant_type: 'authorization_code',
      code
    }
  })
}

/**
 * 使用user_ticket获取成员详情
 * https://work.weixin.qq.com/api/doc#10028/使用user_ticket获取成员详情
 * @param {String} userTicket getUserIdByCode获取的user_ticket
 */
exports.getUserInfoByTicket = async function (userTicket) {
  return this.request({
    method: 'post',
    url: 'user/getuserdetail',
    data: {
      user_ticket: userTicket
    }
  })
}
