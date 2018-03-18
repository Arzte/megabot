const Redis = require('../models/redis')

module.exports = {
  meta: {
    level: 0
  },
  fn: async (msg, suffix) => {
    try {
      await Redis.set('email:' + msg.author.id, suffix)
      await msg.channel.createMessage('done')
    } catch (error) {
      logger.error(error)
      await msg.channel.createMessage('error!')
    }
  }
}
