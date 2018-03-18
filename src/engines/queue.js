const r = require('../models/rethinkdb')

module.exports = {
  newCard: async (msg) => {
    try {
      const card = await r.table('queue').insert({
        id: msg.id,
        approved: 0,
        approvers: [],
        denied: 0,
        deniers: [],
        type: 'newCard',
        embed: msg.embeds[0],
        UvId: msg.embeds[0].footer.text.split('ID: ')[1]
      })
      await card.run()
      await msg.addReaction('approve:302137375092375553')
      await msg.addReaction('deny:302137375113609219')
    } catch (error) {
      logger.error(error)
    }
  }
}
