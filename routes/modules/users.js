const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
// import Todo model
const db = require('../../models')
const User = db.User

// go to views/login.hbs
router.get('/login', (req, res) => {
  res.render('login')
})

// press Login btn in views/login.hbs
router.post('/login',
  passport.authenticate('local', { // user middleware to validate login
    successRedirect: '/', // login successfully direct to views/index.hbs
    failureRedirect: '/users/login', // login fallaciously direct to views/login.hbs
    failureFlash: true
  })
)

// press Log out btn
router.get('/logout', (req, res) => {
  // delete request.session.passport.user
  req.logout((error) => { // Passport.js function for clear session
    if (error) {
      return next(error)
    } else {
      req.flash('success_msg', 'Log out successfully')
      res.redirect('/users/login')
    }
  })
})

// go to views/register.hbs
router.get('/register', (req, res) => {
  res.render('register')
})

// press Register btn in views/register.hbs
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })

})

module.exports = router
