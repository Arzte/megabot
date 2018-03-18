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
    msg.bot.sendTyping()
    let suggst = suffix.split(' | ')[0]
    let comt = suffix.split(' | ')[1]
    try {
      const client = await Helpers.login.user(msg.author.id)
      const result = await client.post(`admin/comments`, `body=${comt},links.suggestion=${suggst}`)
      console.log(result)
      msg.channel.createMessage('Your comment \n``' + result + '``\n has been submitted!')
    } catch (error) {
      console.log(error)
    }
  }
}
