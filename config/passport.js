const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

// import User model
const db = require('../models')
const User = db.User

module.exports = app => {
  // initialize Passport middleware
  app.use(passport.initialize())
  app.use(passport.session())

  // set LocalStrategy
  const customFields = {
    // make default verify username to 'email'
    usernameField: 'email',
    // passwordField: 'pw',
    passReqToCallback: true
  }
  const verifyCallback = async (req, email, password, done) => {
    try {
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

  // set FacebookStrategy
  const customFieldsFacebook = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // fields that ask Facebook to provide
  }
  const verifyCallbackFacebook = async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      let user = await User.findOne({ where: { email: email } })

      if (user === null) { // account not exist
        // register a new account using Facebook email
        const randomPassword = Math.random().toString(36).slice(-8) // gen 8 digits random number
        const salt = await bcrypt.genSalt(10) // saltRounds = 10
        const hash = await bcrypt.hash(randomPassword, salt)
        const newUser = await User.create(
          {
            name,
            email: email,
            password: hash // use hash replace password
          }
        )
        return done(null, newUser)
      } else { // account exist, return user
        user = user.toJSON()
        return done(null, user)
      }
    } catch (error) {
      return done(error)
    }
  }
  const facebookStrategy = new FacebookStrategy(customFieldsFacebook, verifyCallbackFacebook)
  passport.use(facebookStrategy)

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
