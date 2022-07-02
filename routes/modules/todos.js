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
router.get('/:id', async (req, res) => {
  try {
    const TodoId = req.params.id
    let todo = await Todo.findByPk(TodoId)
    todo = todo.toJSON()
    return res.render('detail', { todo })
  } catch (error) {
    return res.status(422).json(error)
  }
})

// go to edit.hbs of a todo
router.get('/:id/edit', async (req, res) => {
  try {
    console.log('go to edit.hbs')
    const UserId = req.user.id
    const TodoId = req.params.id
    let todo = await Todo.findOne({
      where: {
        id: TodoId,
        UserId
      }
    })
    todo = todo.toJSON()
    // console.log('toJSON todo=', todo)
    return res.render('edit', { todo })
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router
