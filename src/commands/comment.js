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
    Helpers.login.user(msg.author.id).then(client => {
      client.post(`admin/comments`, `body=${comt},links.suggestion=${suggst}`).then(res => {
        console.log(res)
        msg.channel.createMessage('Your comment \n``' + res + '``\n has been submitted!')
      })
    })
  }
}
