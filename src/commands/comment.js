const Constants = require('../internal/constants')
const Helpers = {
  login: require('../engines/login')
}

module.exports = {
  meta: {
    level: 0,
    cooldown: {
      global: 500,
      user: 20000
    }
  },
  fn: (msg, suffix) => {
    msg.bot.sendTyping()
    let suggst = suffix.split(' | ')[0]
    let comt = suffix.split(' | ')[1]
    Helpers.login.user(`forums/${Constants.UV.Forum_ID}/suggestions/${suggst}/comments.json`, {
      comment: {
        text: comt
      }
    }).then(res => {
      console.log(res)
      msg.channel.createMessage('Your comment \n``' + res + '``\n has been submitted!')
    })
  }
}
