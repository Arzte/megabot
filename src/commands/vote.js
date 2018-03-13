const Constants = require('../internals/constants')
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
    Helpers.login.userv1(msg.author.id).then(client => {
      client.post(`forums/${Constants.UV.Forum_ID}/suggestions/${suffix}/votes.json`).then(result => {
        msg.addReaction(`<:f1:401095659656183848>`).then(message => {
          setTimeout(() => message.removeReaction(`<:f1:401095659656183848>`), Constants.Timeouts.removeReaction)
        })
      }).catch(console.error)
    }).catch(console.error)
  }
}
