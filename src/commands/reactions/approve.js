const Constants = require('../../internal/constants')
const r = require('../../models/rethinkdb')

module.exports = async (ctx) => {
  try {
    const msg = ctx[0]
    const emoji = msg.channel.guild.emojis
    const approve = emoji.find(emoji => emoji.name === 'approve')
    const f1 = emoji.find(emoji => emoji.name === 'f1')
    const card = await r.table('queue').get(msg.id)
    const doc = await card.run()
    await doc.update({
      approvers: r.row('approvers').default([]).append(msg.author.id),
      approved: r.row('approved').add(1).default(0)
    })
    await doc.run()
    await doc.reports++
    if (await doc.approved === Constants.Guild.reportThres) {
      var reportsArr = await msg.fetchReactions(`${approve.name}:${approve.id}`)
      for (let reaction in reportsArr) {
        await msg.removeReaction(`${approve.name}:${approve.id}`, reaction[0])
      }
      await msg.addReaction(`${f1.name}:${f1.id}`)
      // TODO: Send a card to the queue, can't be bothered to setup that boilerplate right now.
    }
    await card.run()
    const message = await msg.addReaction(`${f1.name}:${f1.id}`)
    setTimeout(() => message.removeReaction(`${f1.name}:${f1.id}`), Constants.Timeouts.removeReaction)
  } catch (error) {
    logger.error(error)
  }
}
