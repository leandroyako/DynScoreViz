const request = require('supertest');

const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');
const express = require('express');
const morgan = require('morgan');
const composerRoutes = require('./routes/composerRoutes');
const interpreterRoutes = require('./routes/interpreterRoutes');
// express app
const app = express();
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
// TODO
// serve ableton-link, websockets, lilypond middleware

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
  res.status(404).render('404', { title: '404' });
});

//OSC

const OSC = require('osc-js')

const options = {
  type: 'udp4',         // @param {string} 'udp4' or 'udp6'
  open: {
    host: 'localhost',    // @param {string} Hostname of udp server to bind to
    port: 9912,          // @param {number} Port of udp server to bind to
    exclusive: false      // @param {boolean} Exclusive flag
  },
  send: {
    host: 'localhost',    // @param {string} Hostname of udp client for messaging
    port: 57120           // @param {number} Port of udp client for messaging
  }
}

const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) })

osc.open() // start a WebSocket server on port 8080

osc.on('/param/density', (message, rinfo) => {
  console.log(message.args)
  console.log(rinfo)
})

osc.on('*', message => {
  console.log(message.args)
})

osc.on('/{foo,bar}/*/param', message => {
  console.log(message.args)
})

osc.on('open', () => {
  const message = new OSC.Message('/status', 'connected')
  osc.send(message)
})

/// test

request(app)
  .get('/composer/add/Tuba Demo')
  .expect('Content-Type', /text/)
  //.expect('Content-Length', '23')
  .expect(302)
  .end(function (err, res) {
    if (err) throw err;
  });

request(app)
  .get('/composer/add/Tuba Demo/tuba.cropped_prev.svg')
  .expect('Content-Type', /text/)
  //.expect('Content-Length', '23')
  .expect(302)
  .end(function (err, res) {
    if (err) throw err;
  });

request(app)
  .get('/composer/add/Tuba Demo/tuba.cropped.svg')
  .expect('Content-Type', /text/)
  //.expect('Content-Length', '23')
  .expect(302)
  .end(function (err, res) {
    if (err) throw err;
  });
