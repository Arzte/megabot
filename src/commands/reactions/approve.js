const Constants = require('../../internal/constants')
const Helpers = {
  login: require('../../engines/login')
}
const r = require('../../models/rethinkdb')

module.exports = async (ctx) => {
  try {
    // We need to fetch the reaction, in case the message isn't cached by the bot.
    const msg = await bot.getMessage(ctx[0].channel.id, ctx[0].id)
    const card = await r.table('queue').get(msg.id).run()
    const client = await Helpers.login.owner
    const result = await client.get(`admin/suggestions/${card.UvId}`)
    const suggestion = result.suggestions[0]
    const feedMessage = await bot.createMessage(Constants.Guild.pubFeed, {
      title: suggestion.title,
      description: suggestion.body,
      url: suggestion.portal_url,
      timestamp: suggestion.created_at
    })
    const react = async () => {
      await feedMessage.addReaction(Constants.UV.Emoji.upvote)
      await feedMessage.addReaction(Constants.UV.Emoji.report)
    }

    if (msg.channel.id === Constants.Guild.feed) {
      if (await msg.getReaction(Constants.UV.Emoji.approve).length === Constants.Guild.reportThres) {
        const userReactArray = await msg.getReaction(Constants.Emoji.approve, 100, '', bot.user)
        const userIdArray = userReactArray.map(user => user.id)
        await react
        await card.update({
          id: r.row('id').update(feedMessage.id),
          approvers: r.row('approvers').default([]).append(userIdArray),
          approved: r.row('approved').uppdate(userIdArray.length).default(0)
        }).run()
        msg.delete('approved by custodians.')
      }

      const message = await msg.addReaction(Constants.UV.Emoji.f1)
      setTimeout(() => message.removeReaction(Constants.UV.Emoji.f1), Constants.Timeouts.removeReaction)
    } else if (msg.channel.id === Constants.Guild.adminFeed) {
      const message = await msg.addReaction(Constants.UV.Emoji.f1)
      setTimeout(() => message.delete('Approved by Employee'), Constants.Timeouts.removeReaction)
      await react
    }
  } catch (error) {
    logger.error(error)
  }
}
