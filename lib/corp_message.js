/**
 * 发送消息
 * https://open.feishu.cn/document/ukTMukTMukTM/uUjNz4SN2MjL1YzM
 */
exports.sendMessage = async function (data) {
  return this.request({
    method: 'post',
    url: 'message/v4/send/',
    data
  })
}

