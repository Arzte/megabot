module.exports = {
  Guild: {
    id: '268811439588900865',
    feed: '258274103935369219',
    pubFeed: '302112999794278400',
    adminFeed: '294530473290498049', // #mods in DFeedback
    reportThres: '5' // Probably needs to be moved, just don't know where
  },
  UVRegex: /https?:\/\/[\w.]+\/forums\/(\d{6,})(?:-[\w-]+)?\/suggestions\/(\d{7,})(?:-[\w-]*)?/,
  AutoRole: {
    enabled: true,
    thresholds: {
      // RoleID: EXP
    },
    addons: {
      // RoleID: [{Datapoint: Threshold}]
    },
    decay: {
      enabled: true, // should EXP decay at all?
      threshold: 7, // how many days should somebody be inactive for their EXP to start decaying?
      speed: 1.25, // how fast should EXP decay once they've hit the inactivity mark?
      exponential: true // should decay be exponential?
    }
  },
  UV: {
    Login: {
      forum_id: '',
      subdomain: '' // Uservoice *.uservoice.com subdomain, not your custom domain
    },
    Channels: {
      default: false, // false = ignore !sumbit commands in uncategorized channels. supply a category ID to default to that category. true = submit uncategorized, if possible
      channels: {
        // ChannelID: UVcategoryID
      }
    },
    Emoji: {
      approve: 'approve:302137375092375553',
      deny: 'deny:302137375113609219',
      f1: 'f1:401095659656183848',
      dupe: 'dupeplsmerge:319762779403845632',
      bulb: 'cracked:285445175407411201',
      upvote: `upvote:302138464986595339`,
      report: `report:302137374920671233`
    }
  },
  DefaultPerms: {
    users: {
      '107904023901777920': 10,
      '77812253511913472': 10,
      '110813477156720640': 10
    },
    roles: {
      '268815351360389121': 10,
      '268815286067527690': 10
    }
  },
  Timeouts: { // everything is in ms
    messagedelete: 2500,
    reactiondlete: 2500
  },
  debug_email: 'doctors@doc.tors.life'
}
