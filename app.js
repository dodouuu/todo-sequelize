const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000
app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs' // make .handlebars extname to .hbs
}))
app.set('view engine', 'hbs')
// set body-parser middleware
app.use(express.urlencoded({ extended: true }))
// set methodOverride middleware
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.send('hello world~~')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  res.send('register')
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})