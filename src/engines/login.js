const GetMail = require('./getmail')
const UV = require('../models/uservoice')

module.exports = {
  user: (userid) => {
    return new Promise((resolve, reject) => {
      GetMail.getMailCached(userid).then(result => {
        if (!result) return reject(false)
        return UV.v2.loginAs(result).then(resolve).catch(reject)
      }).catch(reject)
    })
  },
  owner: () => {
    return UV.v2.loginAsOwner(process.env.USERVOICE_SECRET_KEY)
  }
}
