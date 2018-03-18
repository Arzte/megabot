const Dash = require('rethinkdbdash')

module.exports = new Dash('DFB', [{ host: '127.0.0.1', port: 28015 }])
