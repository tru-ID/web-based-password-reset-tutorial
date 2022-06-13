const server = require('./src/server')

server.serve()

// const express = require('express');
// const app = express();
// const exphbs = require('express-handlebars');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const db = require('./models');

// const port = 3000;

// // This will hold the users and authToken related to users
// const authTokens = {};

// const requireAuth = (req, res, next) => {
//   if (req.user) {
//       next();
//   } else {
//     res.render('login', {
//       message: 'Please login to continue',
//       messageClass: 'alert-danger'
//     });
//   }
// };

// // To support URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // To parse cookies from the HTTP Request
// app.use(cookieParser());

// app.engine('.hbs', exphbs.engine({ 
//   extname: '.hbs', 
//   defaultLayout: "main"
// }));

// app.set('view engine', 'hbs');

// app.use((req, res, next) => {
//   // Get auth token from the cookies
//   const authToken = req.cookies['AuthToken'];

//   // Inject the user to the request
//   req.user = authTokens[authToken];

//   next();
// });

// app.get('/', (req, res) => {
//   res.render('home');
// })




// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })