const EXP = require('./exp-driver')
const Constants = require('../../internal/constants')

module.exports = {
  autoRole: (bot) => {
    bot.Users.fetchMembers().then(() => {
      return EXP.getEveryone()
    }).then(users => {
      for (const user in users) { //eslint-disable-line
        for (const role in Constants.AutoRole.thresholds) {
          if (user.exp >= Constants.AutoRole.thresholds[role]) {
            const member = bot.Users.get(user.id).memberOf(Constants.Guild.id)
            if (member) {
              return member.assignRole(role)
            }
          }
        }
      }
    }).catch(console.error)
  }
}
