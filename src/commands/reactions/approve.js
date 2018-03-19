const Constants = require('../../internal/constants')
const r = require('../../models/rethinkdb')

module.exports = async (ctx) => {
  try {
    const msg = ctx[0]
    const emoji = msg.channel.guild.emojis
    const approve = emoji.find(emoji => emoji.name === 'approve')
    const f1 = emoji.find(emoji => emoji.name === 'f1')

    if (await msg.getReaction(`${approve.name}:${approve.id}`).length() === Constants.Guild.reportThres) {
      const card = await r.table('queue').get(msg.id).run()
      const userReactArray = await msg.getReactions(`${approve.name}:${approve.id}`, 100, '', bot.user)
      const userIdArray = userReactArray.map(user => user.id)

      await card.update({
        approvers: r.row('approvers').default([]).append(userIdArray),
        approved: r.row('approved').add(userIdArray.length).default(0)
      }).run()
      // TODO: Send a card to the queue, can't be bothered to setup that boilerplate right now.
    }

    const message = await msg.addReaction(`${f1.name}:${f1.id}`)
    setTimeout(() => message.removeReaction(`${f1.name}:${f1.id}`), Constants.Timeouts.removeReaction)
  } catch (error) {
    logger.error(error)
  }
}
