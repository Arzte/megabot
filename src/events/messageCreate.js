const commands = require('../internal/command-indexer').commands
const aliases = require('../internal/command-indexer').alias
const constants = require('../internal/constants')
const engines = {
  perms: require('../engines/permissions'),
  settings: require('../engines/settings'),
  timeout: require('../engines/timeouts'),
  queue: require('../engines/queue')
}
const masters = process.env['WILDBEAST_MASTERS'].split('|')

module.exports = async (ctx) => {
  const msg = ctx[0]
  if (msg.author.bot) {
    if (msg.author.discriminator === '0000') engines.queue.newFeedCard(msg) // we want to reserve this newCard for the webhook
    if (msg.channel.id === constants.Guild.feed) engines.queue.newCard(msg)
    return
  }
  const prefix = (msg.channel.guild) ? await engines.settings.prefix(msg.channel.guild, msg) : process.env.BOT_PREFIX
  if (msg.content.indexOf(prefix) === 0) {
    global.logger._raven.setContext({
      user: {
        id: msg.author.id,
        username: `${msg.author.username}#${msg.author.discriminator}`
      }
    })
    let cmd = msg.content.substr(prefix.length).split(' ')[0].toLowerCase()
    if (aliases.has(cmd)) cmd = aliases.get(cmd)
    const suffix = msg.content.substr(prefix.length).split(' ').slice(1).join(' ')
    if (commands[cmd]) {
      if (commands[cmd].meta.nsfw && !msg.channel.nsfw) return global.i18n.send('NSFW_NOT_MARKED', msg.channel)
      if (commands[cmd].meta.level === Infinity && !masters.includes(msg.author.id)) {
        return global.i18n.send('BOT_OWNER_ONLY', msg.channel)
      }
      if (!msg.channel.guild && commands[cmd].meta.noDM) {
        return global.i18n.send('NO_DM', msg.channel)
      }
      let time = true
      if (commands[cmd].meta.timeout) time = engines.timeout.calculate((msg.channel.guild ? msg.channel.guild.id : msg.author.id), cmd, commands[cmd].meta.timeout)
      if (time !== true) {
        return global.i18n.send('COOLDOWN', msg.channel, {time: Math.floor(time)})
      }
      const res = (msg.channel.guild) ? await engines.perms.calculate(msg.channel.guild, msg.member) : await engines.perms.calculate(false, msg.author)
      if (res >= commands[cmd].meta.level) {
        try {
          global.logger._raven.captureBreadcrumb({
              message: 'A command is being ran.',
              category: 'command',
              data: {
                cmd: cmd,
                args: suffix
              }
          })
          commands[cmd].fn(msg, suffix)
        } catch (e) {
          global.logger.error(e)
          global.i18n.send('COMMAND_ERROR', msg.channel, {
            message: e.message
          })
        } finally {
          global.logger.command({
            cmd: cmd,
            opts: suffix,
            m: msg
          })
        }
      } else if (res > 0) return global.i18n.send('NO_PERMS', msg.channel)
    }
  }
}
