const Constants = require('../../internal/constants')
const Helpers = {
  login: require('../../engines/login')
}
const r = require('../../models/rethinkdb')

module.exports = async (ctx) => {
  try {
    const msg = ctx[0]

    if (await msg.getReaction(Constants.Emoji.approve).length() === Constants.Guild.reportThres) {
      const card = await r.table('queue').get(msg.id).run()
      const userReactArray = await msg.getReactions(Constants.Emoji.approve, 100, '', bot.user)
      const userIdArray = userReactArray.map(user => user.id)
      const client = await Helpers.login.owner
      const result = await client.get(`admin/suggestions/${card.UvId}`)
      const suggestion = result.suggestions[0]
      const message = await bot.createMessage(Constants.Guild.pubFeed, {
        title: suggestion.title,
        description: suggestion.body,
        url: suggestion.portal_url,
        timestamp: suggestion.created_at
      })
      await card.update({
        id: r.row('id').update(message.id),
        approvers: r.row('approvers').default([]).append(userIdArray),
        approved: r.row('approved').uppdate(userIdArray.length).default(0)
      }).run()
      msg.delete('approved by custodians.')
    }

    const message = await msg.addReaction(Constants.Emoji.f1)
    setTimeout(() => message.removeReaction(Constants.Emoji.f1), Constants.Timeouts.removeReaction)
  } catch (error) {
    logger.error(error)
  }
}
