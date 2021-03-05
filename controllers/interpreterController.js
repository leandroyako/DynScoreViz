//const { result } = require('lodash');
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
    const parts = JSON.parse(serverLocalStorage.parts);
    const route = req.params.route;
    //serverLocalStorage.setItem("currentInstrument", JSON.stringify(route));
    const index = parts.findIndex(instrument => instrument.route == route);
    const staves = serverLocalStorage.getItem(parts[index].route);
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