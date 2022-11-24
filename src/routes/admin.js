const requireAuth = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect("/login")
  }
}

async function getProtected(req, res) {
  if (req.user) {
    res.render('protected')
  } else {
    res.redirect("/login")
  }
}

module.exports = {
  getProtected,
  requireAuth,
}