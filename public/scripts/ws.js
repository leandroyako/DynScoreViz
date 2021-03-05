var socket = io();

/*** Metronome ***/
const bpmDisplay = document.querySelector(".metronome .bpm");
const metronomeBox = document.querySelector(".metronome");

socket.on('bpm', function(data) {
    bpmDisplay.innerHTML = data.bpm;
    metronomeBox.style.animation = `blinker ${60/data.bpm}s cubic-bezier(0, 1, 0, 1) infinite`;
    //console.log(data);
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

let staves = () => {
    console.log('staves() at ws.js')
    console.log(data) //this is init data that never changes! need to find a way to access latest server side localStorage or resend request from server on 'update' msgs
    return JSON.parse(data); //'data' defined inside 'view_part.ejs' <script>
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

initStaff(staves());

socket.on('update', function(data) {
    if (data.route == route) {
        update(data)
    }
});

function update(data) {
    console.log('update(data) at ws.js')
    console.log(data)
    initStaff(staves()) //this is still using old same data when page loads first time
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
    //console.log(`scroll socket func: ${JSON.stringify(data)}`)
    if (data.route == route) {
        scrollAll()
    }
});