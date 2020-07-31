const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');
const express = require('express');
const morgan = require('morgan');
const composerRoutes = require('./routes/composerRoutes');
const interpreterRoutes = require('./routes/interpreterRoutes');
const abletonlink = require('abletonlink');

// express app
const app = express();
// app.listen(3000);

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

const server = require('http').createServer(app);
server.listen(3000, () => {
    console.log("**** listen on localhost:3000 ****");
    console.log("access to http://localhost:3000/ !!");
});

// Ableton Link
const io = require('socket.io')(server);

io.on('connection', function(client) {
    client.on('event', function(data) {});
    client.on('disconnect', function() {});
});

const link = new abletonlink();

const emitBeats = () => {
    let lastBeat = 0.0;
    link.startUpdate(60, (beat, phase, bpm) => {
        beat = 0 ^ beat;
        if (0 < beat - lastBeat) {
            io.emit('beat', {
                beat
            });
            lastBeat = beat;
        }
    });
}

emitBeats();


//OSC
const OSC = require('osc-js');

const options = {
    type: 'udp4', // @param {string} 'udp4' or 'udp6'
    open: {
        host: 'localhost', // @param {string} Hostname of udp server to bind to
        port: 9912, // @param {number} Port of udp server to bind to
        exclusive: false // @param {boolean} Exclusive flag
    },
    send: {
        host: 'localhost', // @param {string} Hostname of udp client for messaging
        port: 57120 // @param {number} Port of udp client for messaging
    }
}

const osc = new OSC({
    plugin: new OSC.DatagramPlugin(options)
})

osc.open()

// osc.on('/param/density', (message, rinfo) => {
//   console.log(message.args)
//   console.log(rinfo)
// })

osc.on('*', message => {
    console.log(message.args);
    const route = message.args[0];
    const file = message.args[1];
    emitUpdate(`${route}/${file}`)
})

// osc.on('/{foo,bar}/*/param', message => {
//     console.log(message.args)
// })

osc.on('open', () => {
    const message = new OSC.Message('/status', 'LivecodeScores connected')
    osc.send(message)
})

const emitUpdate = updateData => {
    io.emit('update', {
        updateData
    })
}

// Export the app object
module.exports = app