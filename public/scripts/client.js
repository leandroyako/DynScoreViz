//const socket = io();

/*** Metronome ***/
const bpmDisplay = document.querySelector(".metronome .bpm");
const metronomeBox = document.querySelector(".metronome");

socket.on('bpm', function(data) {
    bpmDisplay.innerHTML = data.bpm;
    metronomeBox.style.animation = `blinker ${60/data.bpm}s cubic-bezier(0, 1, 0, 1) infinite`;
});

/*
socket.on('beat', function(data) {
    console.log(data);
    sync animation start time here??
});
*/

/*** Scores ***/
const staffOne = document.querySelector(".grid #one");
const staffTwo = document.querySelector(".grid #two");
const staffThree = document.querySelector(".grid #three");

let staves = (staves) => {
    return JSON.parse(staves);
};

let lastStaves = (staves) => {
    const last = staves[staves.length - 1]
    const secondLast = staves[staves.length - 2]
    const thirdLast = staves[staves.length - 3]
    console.log('lastStaves at ws.js')
    console.log({
        thirdLast,
        secondLast,
        last
    })
    return {
        thirdLast,
        secondLast,
        last
    }
}

const svgRoute = (staff) => `../svg/${staff.route}/${staff.svg}.cropped.svg`

const gone = (staff) => {
    staff.className = ''
    staff.classList.add('gone')
}
const current = (staff) => {
    staff.className = ''
    staff.classList.add('current')
}
const next = (staff) => {
    staff.className = ''
    staff.classList.add('next')
}

function initStaff(staves) {
    const last = lastStaves(staves).last
    const secondLast = lastStaves(staves).secondLast
    const thirdLast = lastStaves(staves).thirdLast

    switch (staves.length) {
        case 0:
            staffOne.innerHTML = "Esperando partitura..."
            gone(staffTwo)
            gone(staffThree)
            break
        case 1:
            staffOne.data = svgRoute(last)
            next(staffOne)
            gone(staffTwo)
            current(staffThree)
            staffTwo.classList.add('hidden')
            staffThree.classList.add('hidden')
            break
        case 2:
            staffOne.data = svgRoute(secondLast)
            current(staffOne)
            staffTwo.data = svgRoute(last)
            next(staffTwo)
            gone(staffThree)
            break
        default:
            staffOne.data = svgRoute(thirdLast)
            current(staffOne)
            staffTwo.data = svgRoute(secondLast)
            next(staffTwo)
            staffThree.data = svgRoute(last)
            gone(staffThree)
            staffThree.classList.add('hidden')
            break
    }
}

initStaff(staves(data)); //uses 'data' from request res.render('view_part')

socket.on('update', function(data) {
    if (data.route == route) {
        update(data)
    }
});

function update(data) { //uses data from socket.on('update)
    initStaff(staves(data.staves))
    scrollAll()
}

const state = ["next", "current", "gone"]

const stepForward = staff => {
    let staffClassList = Array.from(staff.classList)
    let staffState = staffClassList.filter(
        item => state.includes(item)
    ).toString()
    let index = state.indexOf(staffState)
    let nextIndex = (index + 1) % state.length
    let nextState = state[nextIndex]
    staff.classList.replace(staffState, nextState)
}

const scrollAll = () => {
    stepForward(staffOne)
    stepForward(staffTwo)
    stepForward(staffThree)
}

socket.on('scroll', function(data) {
    if (data.route == route) {
        scrollAll()
    }
});