const Constants = require('../../internal/constants')
const r = require('../../models/rethinkdb')

module.exports = async (ctx) => {
  try {
    const msg = ctx[0]
    const card = await r.table('queue').get(msg.id)
    const doc = await card.run()
    await doc.update({
      approvers: r.row('approvers').default([]).append(msg.author.id),
      approved: r.row('approved').add(1).default(0)
    })
    await doc.run()
    await doc.reports++
    if (await doc.approved === Constants.Guild.reportThres) {
      var reportsArr = await msg.fetchReactions('approve:302137375092375553')
      for (let reaction in reportsArr) {
        await msg.removeReaction('approve:302137375092375553', reaction[0])
      }
      await msg.addReaction('f1:401095659656183848')
      // TODO: Send a card to the queue, can't be bothered to setup that boilerplate right now.
    }
    await card.run()
    const message = await msg.addReaction('f1:401095659656183848')
    setTimeout(() => message.removeReaction(`<:f1:401095659656183848>`), Constants.Timeouts.removeReaction)
  } catch (error) {
    logger.error(error)
  }
}
