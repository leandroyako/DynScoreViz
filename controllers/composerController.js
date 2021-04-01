const Editor = require('../models/composerModel');
const editor = new Editor();
const io = require('../ioInstance').get();

const strip_route_path = (string) => {
    return string.replace(/ /g, '').toLowerCase()
};

const index = (req, res) => {
    serverLocalStorage.getItem('parts') || serverLocalStorage.setItem('parts', JSON.stringify([]))
    const parts = JSON.parse(serverLocalStorage.getItem('parts'))
    res.render('index', {
        data: parts,
        title: 'Elegir Instrumento'
    });
}

const view_part = (req, res) => {
    const parts = JSON.parse(serverLocalStorage.parts)
    const instrument = req.params.instrument
    const route = req.params.route || strip_route_path(instrument)
    const index = parts.findIndex(instrument => instrument.route == route)
    const route_stavesConsolidated = `${route}_consolidated`;
    const stavesConsolidated = serverLocalStorage.getItem(route_stavesConsolidated);
    const staves = stavesConsolidated || []
    const bpm = serverLocalStorage.getItem('bpm')

    res.render('view_part', {
        staves,
        route,
        bpm
    });
}

const add_part = (req, res) => {
    const instrument = req.params.instrument
    const route = strip_route_path(instrument)
    const part = {
        instrument,
        route
    }
    editor.addPart(part)
    //res.redirect('/') not working?
}

const add_staff = (req, res, next) => {
    const parts = JSON.parse(serverLocalStorage.parts)
    const instrument = req.params.instrument
    const svg = req.params.svg_path
    const route = strip_route_path(instrument)

    const staff = {
        instrument,
        route,
        svg,
    }

    editor.addStaff(staff);
    const index = parts.findIndex(instrument => instrument.route == route)
    const route_stavesConsolidated = `${parts[index].route}_consolidated`;
    const stavesConsolidated = serverLocalStorage.getItem(route_stavesConsolidated);
    const staves = stavesConsolidated || []
    io.to(route).emit('update', staves)
}

const scroll_part = (req, res) => {
    const instrument = req.params.instrument
    const route = strip_route_path(instrument)
    editor.scroll(route)
    const route_stavesConsolidated = `${route}_consolidated`;
    const stavesConsolidated = serverLocalStorage.getItem(route_stavesConsolidated);
    const staves = stavesConsolidated || []
    io.to(route).emit('update', staves)
}

const delete_part = (req, res) => {
    const route = req.params.route;
    let parts = serverLocalStorage.getItem('parts');
    parts = JSON.parse(parts);
    parts = parts.filter(part => part.route !== route)
    serverLocalStorage.setItem('parts', JSON.stringify(parts));
    editor.deletePart(route); //delete part folder recursively
    io.to(route).emit("delete currentInstrument")
    res.redirect('/interpreter');
}

module.exports = {
    index,
    view_part,
    add_part,
    add_staff,
    scroll_part,
    delete_part,
}