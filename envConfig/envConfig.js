let EXTERNAL_CONFIG_URL = ''
let env = {}
if (process.env.NODE_ENV === 'production') {
  EXTERNAL_CONFIG_URL = './envConfig/devConfig.json'
} else {
  EXTERNAL_CONFIG_URL = './envConfig/devConfig.json'
}

getArgv()

env = {EXTERNAL_CONFIG_URL: EXTERNAL_CONFIG_URL}

function getArgv () {
  if (!process.env.npm_config_argv) {
    return
  }
  let npmArgs = require('minimist')(JSON.parse(process.env.npm_config_argv).original)
  EXTERNAL_CONFIG_URL = npmArgs['configFile'] ? './envConfig/' + npmArgs['configFile'] : EXTERNAL_CONFIG_URL
}
module.exports = env
