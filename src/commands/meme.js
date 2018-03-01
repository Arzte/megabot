const meme = {
  brace: 61546,
  mostinteresting: 61532,
  fry: 61520,
  onedoesnot: 61579,
  yuno: 61527,
  success: 61544,
  allthethings: 61533,
  doge: 8072285,
  drevil: 40945639,
  skeptical: 101711,
  notime: 442575,
  yodawg: 101716,
  ermahgerd: 101462,
  hipsterariel: 86601,
  imagination: 163573,
  grumpycat: 405658,
  morpheus: 100947,
  '1stworldproblems': 61539,
  facepalm: 1509839,
  wtf: 245898,
  batmanslaprobin: 438680,
  takemymoney: 176908,
  gollum: 681831,
  grindmygears: 356615,
  consuela: 160583,
  ineedyouto: 89655,
  chucknorrisapproves: 241304,
  asianfather: 61559,
  foreveralone: 61528,
  grandmainternet: 61556,
  zoidberg: 61573,
  troll: 101484,
  familyguybrian: 674967,
  obama: 185239,
  badluckbrian: 61585,
  philosoraptor: 61516,
  '3rdworldsuccess': 101287,
  ancientaliens: 101470
}

module.exports = {
  meta: {
    name: 'meme',
    help: 'I\'ll create a meme with your suffixes! meme <memetype> "<Upper line>" "<Bottom line>" **Quotes are important!**',
    alias: ['makeameme'],
    timeout: 10,
    level: 0,
    addons: [
      `\nAvailable meme types: ${Object.getOwnPropertyNames(meme).join(', ')}`
    ]
  },
  fn: function (msg, suffix) {
    const tags = suffix.split('"')
    const memetype = tags[0].split(' ')[0]
    const Imgflipper = require('imgflipper')
    const imgflipper = new Imgflipper(process.env.IMGFLIP_USERNAME, process.env.IMGFLIP_PASSWORD)
    imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : '', tags[3] ? tags[3] : '', (err, image) => {
      if (err) {
        msg.channel.createMessage(`<@${msg.author.id}>, Please try again, use \`help meme\` if you do not know how to use this command.`)
      } else {
        const user = global.bot.user
        if (msg.channel.guild) {
          msg.channel.createMessage(image)
        } else if (msg.channel.guild.members.get(user.id).permission.json.manageMessages) {
          msg.delete()
          msg.channel.createMessage(image)
        } else {
          msg.channel.createMessage(image)
        }
      }
    })
  }
}
