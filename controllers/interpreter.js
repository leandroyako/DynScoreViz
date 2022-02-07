//const Interpreter = require('../models/interpreterModel'); //sin uso?
const role = 'interpreter'

const index = (req, res) => {
    serverLocalStorage.getItem('parts') || serverLocalStorage.setItem('parts', JSON.stringify([]))
    const parts = JSON.parse(serverLocalStorage.getItem('parts'))

    res.render('index', {
        parts: parts,
        role: role,
        title: 'Elegir Instrumento'
    });
}

const view_part = (req, res) => {
    const instrument = req.params.instrument
    const route = req.params.route || instrument.replace(/ /g, '').toLowerCase()
    const route_stavesConsolidated = `${route}_consolidated`;
    const stavesConsolidated = serverLocalStorage.getItem(route_stavesConsolidated);
    const staves = stavesConsolidated || []
    const bpm = serverLocalStorage.getItem('bpm')

    res.render('view_part', {
        staves,
        route,
        bpm,
        role
    })
}

const settings = (req, res) => {
    let settings
    try {
        settings = serverLocalStorage.getItem('settings')
    } catch {
        console.log("Error loading settings")
    }
    try {
        settings = JSON.parse(settings)
    } catch {
        console.log("Error parsing settings")
    }

    res.render('settings', {
        settings,
        role
    });
}

module.exports = {
    index,
    view_part,
    settings
}