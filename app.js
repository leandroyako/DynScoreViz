const LocalStorage = require('node-localstorage').LocalStorage
serverLocalStorage = new LocalStorage('./localStorage')

const express = require('express')
const morgan = require('morgan')

// express app
const app = express()
// load server, websockets, link, osc server and call its constructor, passing the app, server and socket objects in order
// that module constructor function will return each object
const server = require('./server')(app)
const io = require('./ioInstance').init(server)
require('./ioHandlers')(io)

const abletonLink = require('./abletonLink')(io)
const osc = require('./osc')

// register view engine
app.set('view engine', 'ejs')

// middleware & static files
app.use(express.static('public'))
//app.use(express.static('node_modules/socket.io/'))
app.use(express.urlencoded({
    extended: true
}))
app.use(morgan('dev'))
app.use((req, res, next) => {
    res.locals.path = req.path
    next()
})

// routes
const interpreter = require('./routes/interpreter')
const composer = require('./routes/composer')

app.get('/', (req, res) => {
    res.redirect('/interpreter')
    //res.redirect('/composer')
})

// interpreter routes
app.use('/interpreter', interpreter)

// composer routes
app.use('/composer', composer)

// 404 page
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404'
    })
})

module.exports = app