//const Interpreter = require('../models/interpreterModel'); //sin uso?

const index = (req, res) => {
    serverLocalStorage.getItem('parts') || serverLocalStorage.setItem('parts', JSON.stringify([]))
    const parts = JSON.parse(serverLocalStorage.getItem('parts'))
    const role = 'interpreter'
    res.render('index', {
        parts: parts,
        role: role,
        title: 'Elegir Instrumento'
    });
}

const view_part = (req, res) => {
    //const parts = JSON.parse(serverLocalStorage.parts)
    const instrument = req.params.instrument
    const route = req.params.route || instrument.replace(/ /g, '').toLowerCase()
    //const index = parts.findIndex(instrument => instrument.route == route)
    const route_stavesConsolidated = `${route}_consolidated`;
    const stavesConsolidated = serverLocalStorage.getItem(route_stavesConsolidated);
    const staves = stavesConsolidated || []
    const bpm = serverLocalStorage.getItem('bpm')
    const role = 'interpreter'
    res.render('view_part', {
        staves,
        route,
        bpm,
        role
    })
}

module.exports = {
    index,
    view_part
}