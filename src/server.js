const express = require('express')
const cors = require('cors')
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const routes = require('./routes')
const { getAuthToken } = require('./config/authTokens')
const port = 3000;

async function serve() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // To parse cookies from the HTTP Request
  app.use(cookieParser());

  // required for `req.ip` to be populated if behind a proxy i.e. ngrok
  app.set('trust proxy', true)

  app.set('views', __dirname + '/views');

  app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs', 
    defaultLayout: "main"
  }));

  app.set('view engine', 'hbs');

  app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = getAuthToken(authToken);

    next();
  });

  app.use(routes())

  const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

  return {
    app,
    server,
  }
}

module.exports = {
  serve,
}
