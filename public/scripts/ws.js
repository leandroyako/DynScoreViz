var socket = io();
var activeObject = document.querySelector(".staves .active");
var inactiveObject = document.querySelector(".staves .inactive");
var bpmDisplay = document.querySelector(".metronome .bpm");
var metronomeBox = document.querySelector(".metronome");
var activeObjectSvgRoute;
var inactiveObjectSvgRoute;

/*
let data = '<%- data%>';
let route = '<%- route%>';
*/
let staves = JSON.parse(data);

function initStaff(staves) {
    if (staves.length > 0) {
        const index = staves.length - 1
        activeObjectSvgRoute = `../svg/${staves[index].route}/${staves[index].svg}.cropped.svg`
        activeObject.data = activeObjectSvgRoute
        activeObject.classList.remove('hidden')
        if (staves.length > 1) {
            const index = staves.length - 2;
            inactiveObjectSvgRoute = `../svg/${staves[index].route}/${staves[index].svg}.cropped.svg`
            inactiveObject.data = inactiveObjectSvgRoute
            inactiveObject.classList.remove('hidden')
        }
    } else {
        activeObject.innerHTML = "Esperando partitura...";
        inactiveObject.innerHTML = "Esperando partitura...";

    }
}
initStaff(staves);

function update(data) {
    activeObject.innerHTML = ""
    let oldObjectSvgRoute = activeObjectSvgRoute

    if (oldObjectSvgRoute) {
        inactiveObject.classList.remove('hidden')
        inactiveObject.data = oldObjectSvgRoute
    }

    activeObject.classList.remove('hidden')
    activeObjectSvgRoute = `../svg/${data.route}/${data.svg}.cropped.svg`
    activeObject.data = activeObjectSvgRoute


    console.log(oldObjectSvgRoute);
    console.log(inactiveObject);
    console.log(activeObject);
};

socket.on('beat', function(data) {
    metronomeBox.classList.add('blink');
    setTimeout(function() {
        metronomeBox.classList.remove('blink')
    }, 30);
});

socket.on('bpm', function(data) {
    bpmDisplay.innerHTML = data.bpm;
});

socket.on('update', function(data) {
    if (data.route == route) {
        update(data)
    }
});