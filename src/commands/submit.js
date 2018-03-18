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
  fn: async (msg, suffix) => {
    msg.channel.sendTyping()
    const index = suffix.split(' | ')
    const category = (!Constants.UV.Channels.default) ? Constants.UV.Channels.channels[msg.channel.id] : Constants.UV.Channels.default //eslint-disable-line
    try {
      const client = await Helpers.login.user(msg.author.id)
      const result = await client.post(`admin/suggestions`, `title=${index[0]},body=${index[1]},links.forum=${Constants.UV.Forum_ID},links.category=${category}`)
      console.log(result)
      await msg.channel.createMessage('Your submission \n``' + result.suggestions[0].title + ':\n' + result.suggestions[0].body + '``\n has been submitted!')
    } catch (error) {
      logger.error(error)
    }
  }
}
