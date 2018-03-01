module.exports = {
  meta: {
    level: 10,
    timeout: 0,
    alias: [],
    help: 'Gives a response if the bot is alive',
  },
  fn: (msg) => {
    let start = new Date(msg.timestamp)
    msg.channel.createMessage('Pong!').then(c => {
      c.edit(`Pong! \`${Math.floor(new Date(c.timestamp) - start)}ms, ${global.bot.shards.random().latency}ms\``) // whatever, latency is pretty consistent across shards anyway
    })
  }
}
