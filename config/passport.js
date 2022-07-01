const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// import User model
const db = require('../models')
const User = db.User

module.exports = app => {
  // initialize Passport middleware
  app.use(passport.initialize())
  app.use(passport.session())
  console.log('we are in passpor.js')
  // set LocalStrategy
  const customFields = {
    // make default verify username to 'email'
    usernameField: 'email',
    // passwordField: 'pw',
    passReqToCallback: true
  }
  const verifyCallback = async (req, email, password, done) => {
    try {
      console.log('start findOne email (passport.js')
      // query User email
      const user = await User.findOne({ where: { email } })
      if (user === null) { // account not exist
        req.flash('wrongAccont', email) // keep account in field of views/login.hbs
        req.flash('wrongPasswd', password) // keep password in field of views/login.hbs

        return done(null, false, { message: 'The Account is not registered!' })
        // if first parameter of done() = error => cant reach Database or something wrong
        // if first parameter = null => reach Database successfully
        // if second parameter = false => cant find document in Database
        // third parameter is for warning message
      } else {
        // user.password is a hashed passwd in Database
        // password is raw, not hashed
        // cant compare using ===, need to use bcrypt.compare()
        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) { // wrong password
          req.flash('wrongAccont', email) // keep account in field of views/login.hbs
          req.flash('wrongPasswd', password) // keep password in field of views/login.hbs

          return done(null, false, { message: 'The Password is incorrect.' })
        } else {
          return done(null, user)
          // if second parameter = user => login successfully
        }

      }
    } catch (error) {
      return done(error)
    }
  }
  const localStrategy = new LocalStrategy(customFields, verifyCallback)
  passport.use(localStrategy)

  // set serialize, transform user into user.id
  passport.serializeUser((user, done) => {
    // mongoose use _id
    // Sequelize use id
    done(null, user.id)
  })
  // set deserialize, transform id into user
  passport.deserializeUser((id, done) => {
    // query User id
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON() // convert to plain object
        done(null, user) // req.user could be useful in handlebars
      })
      .catch(err => done(err, null))
  })
}
