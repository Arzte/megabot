const Constants = require('../../internal/constants')
const r = require('../../models/rethinkdb')

module.exports = async (ctx) => {
  try {
    const msg = ctx[0]

    if (await msg.getReaction(Constants.Emoji.approve).length() === Constants.Guild.reportThres) {
      const card = await r.table('queue').get(msg.id).run()
      const userReactArray = await msg.getReactions(Constants.Emoji.approve, 100, '', bot.user)
      const userIdArray = userReactArray.map(user => user.id)

      await card.update({
        approvers: r.row('approvers').default([]).append(userIdArray),
        approved: r.row('approved').add(userIdArray.length).default(0)
      }).run()
      // TODO: Send a card to the queue, can't be bothered to setup that boilerplate right now.
    }

    const message = await msg.addReaction(Constants.Emoji.f1)
    setTimeout(() => message.removeReaction(Constants.Emoji.f1), Constants.Timeouts.removeReaction)
  } catch (error) {
    logger.error(error)
  }
}
