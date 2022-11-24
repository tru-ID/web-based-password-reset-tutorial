const crypto = require('crypto')

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex')
}
  
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256')
  const hash = sha256.update(password).digest('base64')

  return hash;
}

module.exports = {
  generateAuthToken,
  getHashedPassword,
}