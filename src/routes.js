const { Router } = require('express')

const auth = require('./routes/auth')
const admin = require('./routes/admin')
const tru = require('./routes/tru')
const vonage = require('./api/vonage')

const router = Router()

async function getHome(req, res) {
  res.render('home');
}

function routes() {
  router.get('/', getHome)

  router.get('/register', auth.getRegister)
  router.post('/register', auth.postRegister)

  router.get('/login', auth.getLogin)
  router.post('/login', auth.postLogin)

  router.get('/password-reset', auth.getPasswordReset)
  router.get('/password-reset', auth.postPasswordReset)

  router.get('/password-reset', auth.getPasswordReset)
  router.post('/password-reset', auth.postPasswordReset)

  router.get('/password-reset-code', auth.getPasswordResetCode)
  router.post('/password-reset-code', auth.postPasswordResetCode)

  router.get('/api/coverage', tru.checkCoverage)
  router.post('/api/subscriber-check', tru.createSubscriberCheck)
  router.use('/api/sck-password-reset-code', tru.subscriberCheckCallback)

  router.get('/sc-password-reset-code', tru.getScPasswordResetCode)
  router.post('/sc-password-reset-code', tru.postScPasswordResetCode)

  router.get('/protected', admin.requireAuth, admin.getProtected)

  return router
}
  
module.exports = routes
  