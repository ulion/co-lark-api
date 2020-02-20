
/**
 * 获取通讯录授权范围
 * https://open.lark.cn/document/ukTMukTMukTM/ugjNz4CO2MjL4YzM 
 */
exports.getAuthScope = async function () {
  return this.request({
    url: 'contact/v1/scope/get'
  })
}
