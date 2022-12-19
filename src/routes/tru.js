const truApi = require('../api/tru')
const db = require('../models')
const { getHashedPassword } = require('../utils/auth')

async function createSubscriberCheck(req, res) {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ error_message: 'email parameter is required' })
  }

  const user = await db.User.findOne({ where: { email: email } })

  if (!user) {
    return res.redirect('password-reset')
  }

  try {
    const subscriberCheckRes = await truApi.createSubscriberCheck(
      user.phone
    )

    if (subscriberCheckRes === false) {
      return res.sendStatus(400)
    }

    // Select data to send to client
    return res.status(200).json({
      check_id: subscriberCheckRes.check_id,
      check_url: subscriberCheckRes._links.check_url.href,
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

async function checkCoverage(req, res) {
  try {
    const coverageCheckRes = await truApi.checkCoverage(req, res)

    return res.status(200).json({coverage: coverageCheckRes})
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function subscriberCheckCallback(req, res) {
  const subscriberCheckResult = await truApi.patchSubscriberCheck(req.query.check_id, req.query.code)

  if (subscriberCheckResult === {}) {
    return res.redirect('/password-reset-code')
  } else if (subscriberCheckResult.match === false || subscriberCheckResult.no_sim_change === false) {
    // Not a match or sim changed, return to reset password with message.
    var message = 'Unable to verify, please contact support.'
    var messageClass = 'alert-danger'

    return res.redirect(`/login?message=${message}&messageClass=${messageClass}`)
  } else {
    // Success! Move user to the rest password form.
    return res.redirect(`/sc-password-reset-code?check_id=${req.query.check_id}`)
  }
}

async function getScPasswordResetCode(req, res) {
  const { check_id } = req.query

  if (!check_id) {
    return res.redirect('/login')
  }

  const subscriberCheckStatus = await truApi.getSubscriberCheckStatus(check_id)

  if (subscriberCheckStatus === {} || subscriberCheckStatus.match === false || subscriberCheckStatus.no_sim_change === false) {
    return res.redirect('/login')
  }

  res.render('sc-password-reset-code', { check_id: check_id })
}

async function postScPasswordResetCode(req, res) {
  const { check_id, email, password, password2 } = req.body

  if (!check_id) {
    return res.redirect('/login')
  }

  const subscriberCheckStatus = await truApi.getSubscriberCheckStatus(check_id)

  if (subscriberCheckStatus === {} || subscriberCheckStatus.match === false || subscriberCheckStatus.no_sim_change === false) {
    return res.redirect('/login')
  }

  const user = await db.User.findOne({ where: { email: email } })

  if (!user) {
     return res.render('login', {
      message: 'Invalid email',
      messageClass: 'alert-danger'
    })
  }

  if (password !== password2) {
    return res.render('login', {
      message: 'Passwords don\'t match',
      messageClass: 'alert-danger'
    })
  }

  const hashedPassword = await getHashedPassword(password)
  await user.update({ password: hashedPassword })
  await user.save()

  var message = 'Password has been reset, please log in.'
  res.redirect(`/login?message=${message}&messageClass=alert-success`)
}

module.exports = {
  createSubscriberCheck,
  checkCoverage,
  subscriberCheckCallback,
  getScPasswordResetCode,
  postScPasswordResetCode
}