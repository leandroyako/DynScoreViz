const http = require("http")

module.exports = function(io) {
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

    // osc.on('/param/density', (message, rinfo) => {
    //   console.log(message.args)
    //   console.log(rinfo)
    // })
    // osc.on('/{foo,bar}/*/param', message => {
    //     console.log(message.args)
    // })

    osc.on('open', () => {
        const message = new OSC.Message('/status', 'LivecodeScores connected')
        osc.send(message)
    })

    osc.on('newStaff', message => {
        //console.log(message.args);
        const route = message.args[0];
        const file = message.args[1];
        emitUpdate(`${route}/${file}`)
    })

    const emitUpdate = updateData => {
        io.emit('update', {
            updateData
        })
    }

    osc.on('newPart', message => {
        console.log(message.args);
        /*
        const instrument = message.args[0];
        const route = instrument.replace(/ /g, '').toLowerCase(); //move upper tree, delete duplicate code
        const part = {
            instrument,
            route
        };
        editor.addPart(part);
*/

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
                        console.log(data)
                    })
                }
            )
            .end()

    })

}