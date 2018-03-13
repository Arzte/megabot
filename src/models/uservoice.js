const UserVoice = require('uservoice-nodejs')
const Constants = require('../internal/constants')

module.exports = {
  v2: new UserVoice.ClientV2({
    clientId: Constants.UV.Login.api_key,
    subdomain: Constants.UV.Login.subdomain
  })
}
