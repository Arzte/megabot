const r = require('../models/rethinkdb')

module.exports = {
  newFeedCard: async (msg) => {
    try {
      const card = await r.table('queue').insert({
        id: msg.id,
        approvers: [],
        deniers: [],
        approved: 0,
        denied: 0,
        type: 'newFeedCard',
        embed: msg.embeds[0],
        UvId: msg.embeds[0].footer.text.split('ID: ')[1]
      })
      await card.run()
      await msg.addReaction('approve:302137375092375553')
      await msg.addReaction('deny:302137375113609219')
    } catch (error) {
      logger.error(error)
    }
  },
  newCard: async (msg) => {
    try {
      const card = await r.table('queue').insert({
        id: msg.id,
        deniers: [],
        completionists: [],
        starters: [],
        dupers: [],
        bugers: [],
        monkeys: [],
        jokers: [],
        denied: 0,
        completed: 0,
        started: 0,
        dupe: 0,
        bug: 0,
        monkey: 0,
        joke: 0,
        type: 'queueCard',
        embed: msg.embeds[0],
        UvId: msg.embeds[0].footer.text.split('ID: ')[1]
      })
      await card.run()
      await msg.addReaction('deny:302137375113609219') // deny (Red transparent X)
      await msg.addReaction('💯') // complete (100 emoji)
      await msg.addReaction('▶') // started (arrow forward (looks like play button))
      await msg.addReaction('dupeplsmerge:319762779403845632') // dupe (dupe plz merge)
      await msg.addReaction('🕷') // bug (spider)
      await msg.addReaction('🙈') // inappropriate (aka monkey)
      await msg.addReaction('cracked:285445175407411201') // jokes / shitpost idea (broke bulb)
    } catch (error) {
      logger.error(error)
    }
  }
}
