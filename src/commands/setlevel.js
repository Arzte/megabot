let perms = require('../engines/permissions')

module.exports = {
  meta: {
    level: 7,
    timeout: 0,
    alias: ['set'],
    help: "Change someone's access level."
  },
  fn: async (msg, suffix) => {
    const mentions = mapMentions(suffix)
    const roles = mapMentions(suffix, /<@&([0-9]*)>/g)
    let to = suffix.split(' ')[suffix.split(' ').length - 1]
    if (to > 10) { // haha no
      return global.i18n.send('PERMISSIONS_OVERFLOW', msg.channel)
    }
    if (to === 0) to = null
    let data = {
      users: {},
      roles: {}
    }
    for (let user of mentions) {
      data.users[user] = to
    }
    for (let role of roles) {
      data.roles[role] = to
    }
    await perms.modifyBulk(msg.channel.guild, data)
    global.i18n.send('PERMISSIONS_UPDATED', msg.channel)
  }
}

function mapMentions (string, reg = /<@!?([0-9]*)>/g) {
  let res = []
  let x
  while ((x = reg.exec(string)) !== null) {
    res.push(x[1])
  }
  return res
}
