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
    msg.channel.sendTyping()
    const index = suffix.split(' | ')
    Helpers.login.userv1(msg.author.id).then(client => {
      return client.post(`forums/${Constants.UV.Forum_ID}/suggestions.json`, {
        suggestion: {
          title: index[0],
          text: index[1],
          votes: 1,
          category_id: (!Constants.UV.Channels.default) ? Constants.UV.Channels.channels[msg.channel.id] : Constants.UV.Channels.default //eslint-disable-line
        }
      }).then(result => {
        return msg.reply('feedback submitted!')
      }).catch(console.error)
    }).catch(console.error)
  }
}
