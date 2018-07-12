
let devBase = 'http://www.iscas.com:8081/iscs/'
let prodBase = 'http://www.iscas.com:8081/iscs/'
let dev = {
  API_SERVER: devBase
}
let prod = {
  API_SERVER: prodBase
}
let env = {}

if (process.env.NODE_ENV === 'production') {
  env = prod
} else {
  env = dev
}

export default env
