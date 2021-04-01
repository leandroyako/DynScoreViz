//const Interpreter = require('../models/interpreterModel'); //sin uso?

const index = (req, res) => {
    serverLocalStorage.getItem('parts') || serverLocalStorage.setItem('parts', JSON.stringify([]))
    const parts = JSON.parse(serverLocalStorage.getItem('parts'))
    res.render('index', {
        data: parts,
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
    const staves = JSON.parse(stavesConsolidated) || []
    const bpm = serverLocalStorage.getItem('bpm')
    res.render('view_part', {
        data: staves,
        route: route,
        bpm: bpm
    })
}

module.exports = {
    index,
    view_part
}