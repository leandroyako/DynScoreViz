const Editor = require('../models/composerModel');
const editor = new Editor();
const io = require('../io').get();

const index = (req, res) => {
    const parts = JSON.parse(localStorage.getItem('parts'));
    res.render('index', {
        data: parts,
        title: 'Elegir Instrumento'
    });
}

const view_part = (req, res) => {
    const parts = JSON.parse(localStorage.parts);
    const route = req.params.route;
    localStorage.setItem("currentInstrument", JSON.stringify(route));
    const index = parts.findIndex(instrument => instrument.route == route);
    const staves = localStorage.getItem(parts[index].route);
    //console.log(staves);
    res.render('view_part', {
        data: staves,
        route: route
    });
}

const add_part = (req, res) => {
    const instrument = req.params.instrument;
    const route = instrument.replace(/ /g, '').toLowerCase(); //move upper tree
    const part = {
        instrument,
        route
    };
    editor.addPart(part);
    res.redirect('/'); //wrong path?
}

const add_part_svg = (req, res) => {
    const instrument = req.params.instrument;
    const svg = req.params.svg_path;
    const route = instrument.replace(/ /g, '').toLowerCase();
    const staff = {
        instrument,
        route,
        svg
    };
    editor.addStaff(staff);
    io.emit('update', {
        route,
        svg
    })
    res.redirect(`../interpreter/${route}`);
}

const delete_part = (req, res) => {
    const route = req.params.route;
    const stored = localStorage.getItem('parts');
    const allParts = JSON.parse(stored);
    const parts = allParts.filter(part => part.route !== route)
    localStorage.setItem('parts', JSON.stringify(parts));

    res.redirect('/');
}

module.exports = {
    index,
    view_part,
    add_part,
    add_part_svg,
    delete_part
}