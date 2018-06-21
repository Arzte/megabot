const Reactions = require('../internal/directory-loader')('./src/commands/reactions')

export default async function (ctx) {
  try {
    // We don't get the message author object, just an id, so we need to get that object
    if (await bot.getRESTUser(ctx[2]).bot) return
    if (Reactions[ctx[1].name]) {
      Reactions[ctx[1].name](ctx)
    }
  } catch (error) {
    logger.error(error)
  }
}
