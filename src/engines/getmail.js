const UV = require('../models/uservoice')
const Constants = require('../internals/constants')
const Redis = require('../models/redis')

module.exports = {
  getMail: (userid) => {
    return new Promise((resolve, reject) => {
      if (process.env.DEBUG) return resolve(Constants.debug_email)
      UV.v2.loginAsOwner().then(client => {
        return client.get(`admin/external_users/${userid}`)
      }).then(result => {
        if (!result.users || result.users.length !== 1) return reject(false)
        else {
          Redis.set(`email:${userid}`, result.users[0].email)
          return resolve(result.users[0].email)
        }
      }).catch(console.error)
    })
  },
  getMailCached: (userid) => {
    return new Promise((resolve, reject) => {
      Redis.get(`email:${userid}`).then(res => {
        if (res !== null) return resolve(res)
        return module.exports.getMail(userid).then(resolve)
      }).catch((e) => {
        console.error(e)
        return module.exports.getMail(userid).then(resolve)
      })
    })
  }
}