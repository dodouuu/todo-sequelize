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
router.post('/register', async (req, res) => {
  try {
    const body = { ...req.body }
    const errors = []
    if (!body.name) {
      errors.push({ message: 'unfilled Name' })
    }
    if (!body.email) {
      errors.push({ message: 'unfilled Account' })
    }
    if (!body.password) {
      errors.push({ message: 'unfilled Password' })
    }
    if (!body.confirmPassword) {
      errors.push({ message: 'unfilled confirmPassword' })
    }
    if (body.password !== body.confirmPassword) {
      errors.push({ message: 'Password、confirmPassword NOT match' })
    }
    if (errors.length) {
      return res.render('register', { errors, body })
    }

    const todo = await User.findOne({
      where: {
        email: body.email
      }
    })
    if (todo !== null) { // find a same account
      errors.push({ message: 'the Account is already registered' })
      return res.render('register', { errors, body }) // keep data in fields, dont clear
    } else { // account not exist
      const salt = await bcrypt.genSalt(10) // saltRounds = 10
      const hash = await bcrypt.hash(body.password, salt)
      await User.create({
        name: body.name,
        email: body.email,
        password: hash
      })
      return res.redirect('/')
    }
  } catch (error) {
    return res.status(422).json(error)
  }
})

module.exports = router
