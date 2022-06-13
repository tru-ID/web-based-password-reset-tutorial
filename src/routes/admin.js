async function getProtected(req, res) {
  res.render('protected');
}

module.exports = {
  getProtected,
}