import { Guild, UV, Emoji, Timeouts } from '../../internal/constants'
import { table, row } from '../../models/rethinkdb'
const Helpers = {
  login: require('../../engines/login')
}

export default async (ctx) => {
  try {
    // We need to fetch the reaction, in case the message isn't cached by the bot.
    const msg = await bot.getMessage(ctx[0].channel.id, ctx[0].id)
    const card = await table('queue').get(msg.id).run()
    const client = await Helpers.login.owner

    if (msg.channel.id === Guild.feed) {
      if (await msg.getReaction(UV.Emoji.approve).length === Guild.reportThres) {
        const userReactArray = await msg.getReaction(Emoji.deny, 100, '', bot.user)
        const userNameArray = userReactArray.map(user => user.name)
        const userIdArray = userReactArray.map(user => user.id)
        const result = await client.get(`admin/suggestions/${card.UvId}`)
        const suggestion = result.suggestions[0]
        const feedMessage = await bot.createMessage(Guild.adminFeed, {
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
        await feedMessage.addReaction(UV.Emoji.approve)
        await feedMessage.addReaction(UV.Emoji.deny)
        await card.update({
          id: row('id').update(feedMessage.id),
          approvers: row('deniers').default([]).append(userIdArray),
          approved: row('denied').uppdate(userIdArray.length).default(0)
        }).run()
        await msg.delete('denied by custodians.')
      }

      const reacMessage = await msg.addReaction(UV.Emoji.f1)
      setTimeout(() => reacMessage.removeReaction(UV.Emoji.f1), Timeouts.removeReaction)
    } else if (msg.channel.id === Guild.adminFeed) {
      const message = await msg.addReaction(UV.Emoji.f1)
      setTimeout(() => message.delete('Denied by Employee'), Timeouts.removeReaction)
      await client.delete(`admin/suggestions/${card.UvId}`)
    }
  } catch (error) {
    logger.error(error)
  }
}
