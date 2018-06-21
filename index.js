import './src/internal/check-env'

import Eris from 'eris'

require('dotenv').config()

global.logger = require('./src/internal/logger')
global.logger.log('Beginning startup sequence...')
const Events = require('./src/internal/directory-loader')('./src/events')
const bot = new Eris(process.env['BOT_TOKEN'], {
  restMode: true
})

global.bot = bot

bot._ogEmit = bot.emit
bot.emit = function emit () {
  this._anyListeners.forEach(listener => listener.apply(this, [arguments]))
  return this._ogEmit.apply(this, arguments) // eslint-disable-line
}
bot.onAny = function onAny (func) {
  if (!this._anyListeners) this._anyListeners = []
  this._anyListeners.push(func)
}

bot.on('debug', global.logger.debug)

bot.onAny((ctx) => {
  if (Events[ctx[0]]) {
    Events[ctx[0]](Array.from(ctx).slice(1))
  }
})

process.on('unhandledRejection', (err) => {
  global.logger.error(err)
})

process.on('uncaughtException', (err) => {
  // probably not the most stylish way to handle this, but it works
  global.logger.error(err, true) // we're exiting here, uncaughts are scary
})

bot.connect().then(() => {
  // This is mostly filler in case we want something for logger later on.
  logger.log('Connected to discord')
})
