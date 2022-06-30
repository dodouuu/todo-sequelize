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
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
