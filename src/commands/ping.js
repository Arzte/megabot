module.exports = {
  meta: {
    level: 10,
    timeout: 0,
    alias: []
  },
  fn: async (msg) => {
    let start = new Date(msg.timestamp)
    try {
      const message = await msg.channel.createMessage('Pong!')
      await message.edit(`Pong! \`${Math.floor(new Date(message.timestamp) - start)}ms, ${global.bot.shards.random().latency}ms\``) // whatever, latency is pretty consistent across shards anyway
    } catch (error) {
      logger.error(error)
    }
  }
}
