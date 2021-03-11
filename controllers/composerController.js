const Editor = require('../models/composerModel');
const editor = new Editor();
const io = require('../ioInstance').get();

io.on('connection', (client) => {
    client.on("staff completed", (staff) => {
        console.log(staff)
        editor.toggleStaff(staff.instrument, staff.id)
    })
});

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
    const route = req.params.route || instrument.replace(/ /g, '').toLowerCase()
    const index = parts.findIndex(instrument => instrument.route == route)
    const staves = serverLocalStorage.getItem(parts[index].route)
    res.render('view_part', {
        data: staves,
        route: route
    });
}

const add_part = (req, res) => {
    const instrument = req.params.instrument
    const route = instrument.replace(/ /g, '').toLowerCase() //move upper tree
    const part = {
        instrument,
        route
    }
    editor.addPart(part)
    res.redirect('/') //is this path correct?
}

const add_part_svg = (req, res, next) => {
    const parts = JSON.parse(serverLocalStorage.parts)
    const instrument = req.params.instrument
    const svg = req.params.svg_path
    const route = instrument.replace(/ /g, '').toLowerCase()
    const staff = {
        instrument,
        route,
        svg,
    }

    editor.addStaff(staff);

    const index = parts.findIndex(instrument => instrument.route == route)
    const staves = serverLocalStorage.getItem(parts[index].route)

    io.to(route).emit('update', {
        staves
    })
}

const scroll_part = (req, res) => {
    const instrument = req.params.instrument;
    const route = instrument.replace(/ /g, '').toLowerCase();
    io.to(route).emit('scroll')
}

const delete_part = (req, res) => {
    const route = req.params.route;
    const stored = serverLocalStorage.getItem('parts');
    const allParts = JSON.parse(stored);
    const parts = allParts.filter(part => part.route !== route)
    serverLocalStorage.setItem('parts', JSON.stringify(parts));
    editor.deletePart(route); //delete part folder recursively
    io.to(route).emit("delete currentInstrument")
    res.redirect('/');
}

const toggle_staff = (req, res) => {
    const instrument = req.params.instrument
    const route = instrument.replace(/ /g, '').toLowerCase()
    const id = req.params.id
    editor.toggleStaff(instrument, id)
}

module.exports = {
    index,
    view_part,
    add_part,
    add_part_svg,
    scroll_part,
    delete_part,
    toggle_staff //unused... not sure where to put the request. should be accesible from outside?
}