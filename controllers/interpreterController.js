//const { result } = require('lodash');
//const Interpreter = require('../models/interpreterModel'); //sin uso?

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
    // console.log(staves[0]);
    // console.log(route);
    res.render('view_part', {
        data: staves,
        route: route
    });
}

module.exports = {
    index,
    view_part
}