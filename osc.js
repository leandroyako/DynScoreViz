module.exports = function(io) {
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
}