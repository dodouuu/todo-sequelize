// if NOT production mode => use .env to set environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
// Flash message package is about HINT for user
const flash = require('connect-flash')

// divide the routes into routes document
const routes = require('./routes')
const app = express()

// if operate in Heroku => PORT = process.env.PORT
// if operate in Local host => PORT = 3000
const PORT = process.env.PORT

app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs' // make .handlebars extname to .hbs
}))
app.set('view engine', 'hbs')

app.use(express.static('public')) // setting static files

app.use(session({
  secret: 'ThisIsMySecret', // session use secret to verify string of session id
  resave: false, // if resave = true, force session save in session store everytime
  saveUninitialized: true // force Uninitialized session save in session store
}))

// app.use(session()) must before app.use(passport.session()) in config/passport.js
const usePassport = require('./config/passport')
usePassport(app)
// usePassport(app) must before routes

// set body-parser middleware
app.use(express.urlencoded({ extended: true }))
// set methodOverride middleware
app.use(methodOverride('_method'))

app.use(flash()) // Flash message package is about HINT for user

// set local variables: res.locals for all templates in views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  // res.locals.isAuthenticated go to views/layouts/main.hbs

  res.locals.localUser = req.user
  // req.user come from passport.deserializeUser() in config/passport.js
  // localUser go to views/layouts/main.hbs

  res.locals.userAccount = req.flash('wrongAccont')
  // wrongAccont come from config/passport.js
  // userAccount go to views/login.hbs
  res.locals.userPasswd = req.flash('wrongPasswd')
  // wrongPasswd come from config/passport.js
  // userPasswd go to views/login.hbs

  res.locals.success_msg = req.flash('success_msg')
  // success_msg come from routes/modules/users.js
  // res.locals.success_msg go to views/partials/message.hbs

  res.locals.warning_msg = req.flash('warning_msg')
  // warning_msg come from middleware/auth.js
  // res.locals.warning_msg go to views/partials/message.hbs

  res.locals.login_error = req.flash('error')
  // req.flash('error') come from config/passport.js
  // login_error go to views/partials/message.hbs

  res.locals.errorFromHandler = req.flash('error_messages')
  // req.flash('error_messages') come from middleware/error-handler.js
  // errorFromHandler go to views/partials/message.hbs
  next()
})

// after all middlewares
app.use(routes)
// before error handler

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
