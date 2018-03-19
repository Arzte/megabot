module.exports = {
  prefix: async (guild, msg) => {
    let tag = global.bot.user.mention
    if (msg.content.startsWith(tag)) return tag + ' '
    else {
      if (process.env['BOT_PREFIX']) return process.env['BOT_PREFIX']
      global.logger.error('No prefix defined! WildBeast will now exit...', true)
    }
  }
}