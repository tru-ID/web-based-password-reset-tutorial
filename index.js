const express = require('express')
const app = express()
const port = 3000

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Login form submitted
app.post('/login', (req, res) => {
  res.send('POST login')
})

// Login page rendered
app.get('/login', (req, res) => {
  res.send('GET login')
})

// Password Reset page rendered
app.get('/password-reset', (req, res) => {
  res.send('GET password-reset')
})

// Password reset form submitted
app.post('/password-reset', (req, res) => {
  res.send('POST password-reset')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})