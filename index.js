const Ticket = require('./lib/core/ticket')
const AccessToken = require('./lib/core/access-token')

const API = require('./lib/core/api')
const CorpAPI = require('./lib/core/corp-api')
const ISVAppAPI = require('./lib/core/isvapp-api')
const ISVAppCorpAPI = require('./lib/core/isvapp-corp-api')
const ProviderAPI = require('./lib/core/provider-api')

const LarkCallback = require('./lib/app_callback')

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
function mixin (API, obj) {
  for (let key in obj) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: ' + key)
    }
    API.prototype[key] = obj[key]
  }
}

// crypto
//mixin(API, require('./lib/api_crypto'))

/*  微信企业应用 */
// 授权
mixin(CorpAPI, require('./lib/corp_oauth'))
mixin(CorpAPI, require('./lib/corp_auth'))

// JS SDK
mixin(CorpAPI, require('./lib/corp_js'))
// 成员管理
mixin(CorpAPI, require('./lib/corp_user'))
// 部门管理
mixin(CorpAPI, require('./lib/corp_department'))
// 标签管理
mixin(CorpAPI, require('./lib/corp_tag'))
// 异步任务
mixin(CorpAPI, require('./lib/corp_batch'))

/* 微信企业套件 */
// 第三方应用
mixin(ISVAppAPI, require('./lib/isvapp'))
// 第三方应用登录
//mixin(SuiteAPI, require('./lib/suite_3rd_oauth'))

/* 微信企业服务商 */
// 商户授权
mixin(ProviderAPI, require('./lib/provider_oauth'))

module.exports = {
  LarkCallback,
  Ticket,
  AccessToken,
  API,
  CorpAPI,
  ISVAppAPI,
  ISVAppCorpAPI,
  ProviderAPI,
  mixin
}
