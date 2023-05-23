const getLogger = require('loglevel-colored-level-prefix')

const options = {
  prefix: 'mern-server', 
  level: 'trace'
}

const logger = getLogger(options)

module.exports = logger
