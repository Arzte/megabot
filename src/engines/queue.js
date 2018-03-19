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
      const emoji = msg.channel.guild.emojis
      const approve = emoji.find(emoji => emoji.name === 'approve')
      const deny = emoji.find(emoji => emoji.name === 'deny')
      await msg.addReaction(`${approve.name}:${approve.id}`)
      await msg.addReaction(`${deny.name}:${deny.id}`)
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
      const emoji = msg.channel.guild.emojis
      const deny = emoji.find(emoji => emoji.name === 'deny')
      const dupe = emoji.find(emoji => emoji.name === 'dupeplsmerge')
      const cracked = emoji.find(emoji => emoji.name === 'cracked')
      await msg.addReaction(`${deny.name}:${deny.id}`) // deny (Red transparent X)
      await msg.addReaction('💯') // complete (100 emoji)
      await msg.addReaction('▶') // started (arrow forward (looks like play button))
      await msg.addReaction(`${dupe.name}:${dupe.id}`) // dupe (dupe plz merge)
      await msg.addReaction('🕷') // bug (spider)
      await msg.addReaction('🙈') // inappropriate (aka monkey)
      await msg.addReaction(`${cracked.name}:${cracked.id}`) // jokes / shitpost idea (broke bulb)
    } catch (error) {
      logger.error(error)
    }
  }
}
