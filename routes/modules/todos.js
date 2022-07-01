const express = require('express')
const router = express.Router()

// import Todo model
const db = require('../../models')
const Todo = db.Todo

router.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

module.exports = router
