const Editor = require('../models/composerModel');
const editor = new Editor();
const io = require('../ioInstance').get();
const role = 'composer'
const iface = 'wlp3s0'; //hardcoded
const localip = require('local-ip')(iface);

const strip_route_path = (string) => {
    return string.replace(/ /g, '').toLowerCase()
};

const index = (req, res) => {
    serverLocalStorage.getItem('parts') || serverLocalStorage.setItem('parts', JSON.stringify([]))
    const parts = JSON.parse(serverLocalStorage.getItem('parts'))
    res.render('index', {
        parts,
        role,
        localip,
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
        bpm,
        role,
        localip
    });
}

/*
const settings = (req, res) => {
   
    console.log('My local ip address on ' + iface + ' is ' + localip);

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
        role,
        localip
    });
}
*/

const add_part = (req, res) => {
    const name = req.params.name
    const route = strip_route_path(req.params.route)
    const part = {
        name,
        route
    }
    editor.addPart(part)
    //res.redirect('/') not working?
}

const add_staff = (req, res, next) => {
    const parts = JSON.parse(serverLocalStorage.parts)
    const svg = req.params.svg_path
    const route = strip_route_path(req.params.route)

    const staff = {
        route,
        svg,
    }

    editor.addStaff(staff);
    const index = parts.findIndex(part => part.route == route)
    const route_stavesConsolidated = `${parts[index].route}_consolidated`;
    const stavesConsolidated = serverLocalStorage.getItem(route_stavesConsolidated);
    const staves = stavesConsolidated || []
    io.to(route).emit('update', staves)
}

const scroll_part = (req, res) => {
    const route = req.params.route
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
    res.redirect('/composer');
}

module.exports = {
    index,
    view_part,
    add_part,
    add_staff,
    scroll_part,
    delete_part,
    //    settings,
}