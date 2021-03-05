const http = require("http")
//OSC
const OSC = require('osc-js');
const editor = require('./controllers/composerController.js').editor;

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
    const message = new OSC.Message('/status', 'LivecodeScores connected')
    osc.send(message)
})

osc.on('newStaff', message => {
    //console.log(message);
    http
        .request({
                hostname: "localhost",
                port: 3000,
                path: encodeURI(`/composer/add/${message.args[0]}/${message.args[1]}`)
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
                path: encodeURI(`/composer/add/${message.args[0]}`)
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