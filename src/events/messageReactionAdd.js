const Reactions = require('./src/internal/directory-loader')('./src/commands/reactions')

module.exports = function (ctx) {
  if (ctx[0].author.bot) return
  if (Reactions[ctx[0]]) {
    Reactions[ctx[0]](Array.from(ctx).slice(1))
  }
}
