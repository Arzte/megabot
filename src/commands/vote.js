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
    try {
      const client = await Helpers.login.user(msg.author.id)
      await client.post(`forums/${Constants.UV.Forum_ID}/suggestions/${suffix}/votes.json`) // we don't care about the result of this, so no const for it.
      const message = await msg.addReaction(`<:f1:401095659656183848>`)
      setTimeout(() => message.removeReaction(`<:f1:401095659656183848>`), Constants.Timeouts.removeReaction)
    } catch (error) {
      logger.error(error)
    }
  }
}
