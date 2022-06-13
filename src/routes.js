const { Router } = require('express')

const { getRegister, postRegister, getLogin, postLogin, getPasswordReset, postPasswordReset } = require('./routes/auth')
const { getProtected } = require('./routes/admin')

const router = Router()

async function getHome(req, res) {
  res.render('home');
}

function routes() {
  router.get('/', getHome)

  router.get('/register', getRegister)
  router.post('/register', postRegister)

  router.get('/login', getLogin)
  router.post('/login', postLogin)

  router.get('/password-reset', getPasswordReset)
  router.get('/password-reset', postPasswordReset)

  router.get('/protected', getProtected)

  return router
}
  
module.exports = routes
  