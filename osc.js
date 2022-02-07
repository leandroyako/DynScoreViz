const http = require("http")

var iface = 'wlp3s0';
var localip = require('local-ip')(iface);
//console.log('My local ip address on ' + iface + ' is ' + localip);

//OSC
const OSC = require('osc-js');
const editor = require('./controllers/composer.js').editor;

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

osc.on('open', () => {
    const message = new OSC.Message('/status', 'DynScore server on ' + localip)
    osc.send(message)
})

osc.on('newStaff', message => {
    http
        .request({
                hostname: "localhost",
                port: 3000,
                path: encodeURI(`/composer/addStaff/${message.args[0]}/${message.args[1]}`)
            },
            res => {
                let data = ""

                res.on("data", d => {
                    data += d
                })
                res.on("end", () => {
                    data
                })
            }
        )
        .end();
})

osc.on('newPart', message => {
    http
        .request({
                hostname: "localhost",
                port: 3000,
                path: encodeURI(`/composer/addPart/${message.args[0]}/${message.args[1]}`)
            },
            res => {
                let data = ""

                res.on("data", d => {
                    data += d
                })
                res.on("end", () => {
                    data
                })
            }
        )
        .end()
})

osc.on('deletePart', message => {
    http
        .request({
                hostname: "localhost",
                port: 3000,
                path: encodeURI(`/composer/delete/${message.args[0]}`)
            },
            res => {
                let data = ""

                res.on("data", d => {
                    data += d
                })
                res.on("end", () => {
                    data
                })
            }
        )
        .end()
})

osc.on('scroll', message => {
    http
        .request({
                hostname: "localhost",
                port: 3000,
                path: encodeURI(`/composer/scroll/${message.args[0]}`)
            },
            res => {
                let data = ""

                res.on("data", d => {
                    data += d
                })
                res.on("end", () => {
                    data
                })
            }
        )
        .end()
})