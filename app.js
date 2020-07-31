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
