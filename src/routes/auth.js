const { getHashedPassword, generateAuthToken } = require('../utils/auth')
const { setAuthToken } = require('../config/authTokens')
const db = require('../models')
const vonage = require('../api/vonage')

async function getRegister(req, res) {
  res.render('register');
}

async function postRegister(req, res) {
  const { email, firstName, lastName, password, confirmPassword, phoneNumber } = req.body;

  // Check if the password and confirm password fields match
  if (password === confirmPassword) {
    // Check if user with the same email is also registered
    const user = await db.User.findOne({ where: { email: email } });

    if (user) {
      res.render('register', {
        message: 'User already registered.',
        messageClass: 'alert-danger'
      });

      return;
    }

    const hashedPassword = getHashedPassword(password)

    await db.User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber
    });

    res.render('login', {
        message: 'Registration Complete. Please login to continue.',
        messageClass: 'alert-success'
    });
  } else {
    res.render('register', {
      message: 'Password does not match.',
      messageClass: 'alert-danger'
    });
  }
}

async function getLogin(req, res) {
  if (req.query.message) {
    return res.render('login', {
      message: req.query.message,
      messageClass: req.query.messageClass
    })
  }

  res.render('login')
}

async function postLogin(req, res) {
  const { email, password } = req.body;
  const hashedPassword = getHashedPassword(password);
  const user = await db.User.findOne({ where: { email: email, password: hashedPassword } });

  if (user) {
    const authToken = generateAuthToken();

    // Store authentication token
    setAuthToken(authToken, user)

    // Setting the auth token in cookies
    res.cookie('AuthToken', authToken);

    // Redirect user to the protected page
    res.redirect('/protected');
  } else {
    res.render('login', {
      message: 'Invalid username or password',
      messageClass: 'alert-danger'
    });
  }
}

// Password Reset page rendered
async function getPasswordReset(req, res) {
  res.render('password-reset');
}

// Password reset form submitted
async function postPasswordReset(req, res) {
  const { email } = req.body;

  // Check if user with the same email is also registered
  const user = await db.User.findOne({ where: { email: email } });

  if (!user) {
    res.render('login', {
      message: 'Invalid email',
      messageClass: 'alert-danger'
    });
  }

  const vonageRes = await vonage.createVerification(user.phone)

  if (vonageRes !== null) {
    await user.update({ requestId: vonageRes })
    await user.save()

    return res.redirect('password-reset-code')
  }

  return res.redirect('login')
}

async function getPasswordResetCode(req, res) {
  const { messageClass, message } = req.query

  if (message) {
    res.render('password-reset-code', {
      message: message,
      messageClass: messageClass
    })

    return;
  }

  res.render('password-reset-code')
}

async function postPasswordResetCode(req, res) {
  const { email, password, password2, code } = req.body

  // Check if user with the same email is also registered
  const user = await db.User.findOne({ where: { email: email } })

  if (!user) {
    res.redirect('/login?message=Invalid email&messageClass=alert-danger')
  }

  if (password !== password2) {
    res.render('register', {
      message: 'Passwords do not match.',
      messageClass: 'alert-danger'
    })
  }

  const vonageRes = await vonage.verify(user.requestId, code)

  if (vonageRes !== null) {
    const hashedPassword = getHashedPassword(password)

    await user.update({ requestId: null, password: hashedPassword })
    await user.save()

    let message = 'Password successfully reset, please log in with your new credentials.'
    let messageClass = 'alert-success'

    return res.redirect(`/login?message=${message}&messageClass=${messageClass}`)
  }

  let message = 'No password-reset in progress. Please restart.'
  let messageClass = 'alert-danger'

  return res.redirect(`/login?message=${message}&messageClass=${messageClass}`)
}

async function getLogout(req, res) {
  res.clearCookie("AuthToken")
  res.redirect("/")
}

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getPasswordReset,
  postPasswordReset,
  getPasswordResetCode,
  postPasswordResetCode,
  getLogout
}