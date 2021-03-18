const Editor = require('../models/composerModel');
const editor = new Editor();
const io = require('../ioInstance').get();

const strip_route = (string) => {
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
    const route = req.params.route || strip_route(instrument)
    const index = parts.findIndex(instrument => instrument.route == route)
    const staves = serverLocalStorage.getItem(parts[index].route)
    res.render('view_part', {
        data: staves,
        route: route
    });
}

const add_part = (req, res) => {
    const instrument = req.params.instrument
    const route = strip_route(instrument)
    const part = {
        instrument,
        route
    }
    editor.addPart(part)
    //res.redirect('/') not working?
}

const add_part_svg = (req, res, next) => {
    const parts = JSON.parse(serverLocalStorage.parts)
    const instrument = req.params.instrument
    const svg = req.params.svg_path
    const route = strip_route(instrument)
    const staff = {
        instrument,
        route,
        svg,
        state: undefined
    }

    editor.addStaff(staff);

    const index = parts.findIndex(instrument => instrument.route == route)
    const staves = serverLocalStorage.getItem(parts[index].route)

    io.to(route).emit('update', {
        staves
    })
}

const scroll_part = (req, res) => {
    const instrument = req.params.instrument
    const route = strip_route(instrument)
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
    res.redirect('/interpreter');
}

const toggle_staff = (req, res) => {
    const instrument = req.params.instrument
    //const route = strip_route(instrument)
    const id = req.params.id
    editor.toggleStaff(instrument, id)
}

io.on('connection', (client) => {
    client.on("staff completed", (staff) => {
        //console.log(staff)
        editor.toggleStaff(staff.instrument, staff.id)
    })

    client.on("staff state", (route, staffId, newState) => { //filter by room
        //console.log()
        //editor.staffState(staff.instrument, staff.id, staff.state)
        editor.staffState(route, staffId, newState)
    })
});

module.exports = {
    index,
    view_part,
    add_part,
    add_part_svg,
    scroll_part,
    delete_part,
    toggle_staff //unused... not sure where to put the request. should be accesible from outside?
}