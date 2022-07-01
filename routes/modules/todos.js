const express = require('express')
const router = express.Router()

// import Todo model
const db = require('../../models')
const Todo = db.Todo

// go to views/new.hbs
router.get('/new', (req, res) => {
  return res.render('new')
})

// Create New todos
router.post('/', async (req, res) => {
  try {
    const UserId = req.user.id
    // use semicolon to separate many todos, so we can create many todos at one time
    // eg. job1;job2;job3 = insert 3 rows
    const todos = String(req.body.name).split(';').map(todo => ({
      name: todo,
      UserId: UserId
    }))
    await Todo.bulkCreate(
      todos
    )
    return res.redirect('/')
  } catch (error) {
    return res.status(422).json(error)
  }
})

// go to views/detail.hbs
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

module.exports = router
