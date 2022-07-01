const express = require('express')
const router = express.Router()

// import Todo model
const db = require('../../models')
const Todo = db.Todo

// go to home page views/index.hbs
router.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => {
      return res.render('index', { todos })
    })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router
