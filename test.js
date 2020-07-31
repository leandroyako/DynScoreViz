const request = require('supertest');
const app = require('./app');


request(app)
    .get('/composer/add/Instrumento Demo')
    .expect('Content-Type', /text/)
    //.expect('Content-Length', '22')
    .expect(302)
    .end(function(err, res) {
        if (err) throw err;
    });

request(app)
    .get('/composer/add/Instrumento Demo/0000.cropped.svg')
    .expect('Content-Type', /text/)
    //.expect('Content-Length', '22')
    .expect(302)
    .end(function(err, res) {
        if (err) throw err;
    });

request(app)
    .get('/composer/add/Instrumento Demo/0000.cropped.svg')
    .expect('Content-Type', /text/)
    //.expect('Content-Length', '22')
    .expect(302)
    .end(function(err, res) {
        if (err) throw err;
    });