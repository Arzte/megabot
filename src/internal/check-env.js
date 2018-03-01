const required = [ // this is the absolute minimum required to run wildbeast
  'BOT_TOKEN',
  'BOT_PREFIX',
  'USERVOICE_SECRET_KEY',
  'WILDBEAST_MASTERS'
]

for (let x of required) {
  if (!process.env[x]) {
    global.logger.error(`Missing environment variable ${x}`, true)
  }
}
