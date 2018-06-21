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
    const result = await client.get(`admin/suggestions/${card.UvId}`)
    const suggestion = result.suggestions[0]
    const feedMessage = await bot.createMessage(Guild.pubFeed, {
      title: suggestion.title,
      description: suggestion.body,
      url: suggestion.portal_url,
      timestamp: suggestion.created_at
    })
    const react = async () => {
      await feedMessage.addReaction(UV.Emoji.upvote)
      await feedMessage.addReaction(UV.Emoji.report)
    }

    if (msg.channel.id === Guild.feed) {
      if (await msg.getReaction(UV.Emoji.approve).length === Guild.reportThres) {
        const userReactArray = await msg.getReaction(Emoji.approve, 100, '', bot.user)
        const userIdArray = userReactArray.map(user => user.id)
        await react
        await card.update({
          id: row('id').update(feedMessage.id),
          approvers: row('approvers').default([]).append(userIdArray),
          approved: row('approved').uppdate(userIdArray.length).default(0)
        }).run()
        msg.delete('approved by custodians.')
      }

      const message = await msg.addReaction(UV.Emoji.f1)
      setTimeout(() => message.removeReaction(UV.Emoji.f1), Timeouts.removeReaction)
    } else if (msg.channel.id === Guild.adminFeed) {
      const message = await msg.addReaction(UV.Emoji.f1)
      setTimeout(() => message.delete('Approved by Employee'), Timeouts.removeReaction)
      await react
    }
  } catch (error) {
    logger.error(error)
  }
}
