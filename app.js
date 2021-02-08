const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');
const express = require('express');
const morgan = require('morgan');
const composerRoutes = require('./routes/composerRoutes');
const interpreterRoutes = require('./routes/interpreterRoutes');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.static('node_modules/socket.io-client/dist/'));
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// routes
app.get('/', (req, res) => {
    res.redirect('/interpreter');
});

// interpreter routes
app.use('/interpreter', interpreterRoutes);

// composer routes
app.use('/composer', composerRoutes);


// 404 page
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404'
    });
});

// load server, websockets, link, osc server and call its constructor, passing the app, server and socket objects in order
// that module constructor function will return each object 
const server = require('./server')(app);
const io = require('./io')(server);
const abletonLink = require('./abletonLink')(io);
const osc = require('./osc')(io);

module.exports = app;