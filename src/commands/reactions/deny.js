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

    if (msg.channel.id === Constants.Guild.feed) {
      if (await msg.getReaction(Constants.UV.Emoji.approve).length === Constants.Guild.reportThres) {
        const userReactArray = await msg.getReaction(Constants.Emoji.deny, 100, '', bot.user)
        const userNameArray = userReactArray.map(user => user.name)
        const userIdArray = userReactArray.map(user => user.id)
        const result = await client.get(`admin/suggestions/${card.UvId}`)
        const suggestion = result.suggestions[0]
        const feedMessage = await bot.createMessage(Constants.Guild.adminFeed, {
          content: '**The following card was denied in queue, confirming this report will _remove_ this suggestion:**',
          embed: {
            title: suggestion.title,
            description: suggestion.body,
            url: suggestion.portal_url,
            timestamp: suggestion.created_at,
            fields: [{
              name: 'Custodians that denied this suggestion.',
              value: userNameArray.join()
            }]
          }
        })
        await feedMessage.addReaction(Constants.UV.Emoji.approve)
        await feedMessage.addReaction(Constants.UV.Emoji.deny)
        await card.update({
          id: r.row('id').update(feedMessage.id),
          approvers: r.row('deniers').default([]).append(userIdArray),
          approved: r.row('denied').uppdate(userIdArray.length).default(0)
        }).run()
        await msg.delete('denied by custodians.')
      }

      const reacMessage = await msg.addReaction(Constants.UV.Emoji.f1)
      setTimeout(() => reacMessage.removeReaction(Constants.UV.Emoji.f1), Constants.Timeouts.removeReaction)
    } else if (msg.channel.id === Constants.Guild.adminFeed) {
      const message = await msg.addReaction(Constants.UV.Emoji.f1)
      setTimeout(() => message.delete('Denied by Employee'), Constants.Timeouts.removeReaction)
      await client.delete(`admin/suggestions/${card.UvId}`)
    }
  } catch (error) {
    logger.error(error)
  }
}
