// const driver = require('../internal/database-selector')
const masters = process.env['WILDBEAST_MASTERS'].split('|')

module.exports = {
  calculate: (guild, member) => {
    return new Promise((resolve, reject) => {
      if (masters.includes(member.id)) return resolve(Infinity)
      if (guild === false) return resolve(0) // no guild = probably DM
      if (guild.ownerID === member.id) return resolve(10)
      /* driver.getPerms(guild).then(data => {
        let result = data.users[member.id] || 0
        for (let role in data.roles) {
          if (result < 0) break
          if (member.roles.includes(role)) {
            if (data.roles[role] > result) result = data.roles[role]
            if (data.roles[role] < 0) result = data.roles[role]
          }
        }
        return resolve(result)
      })
    */ })
  }
}
