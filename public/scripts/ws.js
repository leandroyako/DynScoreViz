var socket = io();

/*** Metronome ***/
var bpmDisplay = document.querySelector(".metronome .bpm");
var metronomeBox = document.querySelector(".metronome");

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
var staffOne = document.querySelector(".grid #one");
var staffTwo = document.querySelector(".grid #two");
var staffThree = document.querySelector(".grid #three");

var lastSvg;
var secondLastSvg;
var thirdLastSvg;

let staves = JSON.parse(data);

const state = ["afterNext", "next", "current", "gone"]

function initStaff(staves) {
    const last = staves.length - 1
    const secondLast = staves.length - 2
    const thirdLast = staves.length - 3

    switch (staves.length) {
        case 0:
            staffOne.innerHTML = "Esperando partitura..."
            staffTwo.className = ''
            staffTwo.classList.add('gone')
            staffThree.className = ''
            staffThree.classList.add('gone')
            break
        case 1:
            lastSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffOne.data = lastSvg
            staffOne.classList.add('next')
            staffTwo.classList.add('hidden', 'afterNext')
            staffThree.classList.add('hidden', 'gone')
            break
        case 2:
            secondLastSvg = `../svg/${staves[secondLast].route}/${staves[secondLast].svg}.cropped.svg`
            staffOne.data = secondLastSvg
            staffOne.className = ''
            staffOne.classList.add('current')

            lastSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffTwo.data = lastSvg
            staffTwo.className = ''
            staffTwo.classList.add('next')

            staffThree.className = ''
            staffThree.classList.add('gone')
            break
        default:
            thirdLastSvg = `../svg/${staves[thirdLast].route}/${staves[thirdLast].svg}.cropped.svg`
            staffOne.data = thirdLastSvg
            staffOne.className = ''
            staffOne.classList.add('current')

            secondLastSvg = `../svg/${staves[secondLast].route}/${staves[secondLast].svg}.cropped.svg`
            staffTwo.data = secondLastSvg
            staffTwo.className = ''
            staffTwo.classList.add('next')

            lastSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffThree.data = lastSvg
            staffThree.className = ''
            staffThree.classList.add('hidden', 'afterNext')

            break
    }
}

initStaff(staves);

socket.on('update', function(data) {
    if (data.route == route) {
        update(data)
    }
});

function update(data) {
    console.log(data)
    const last = staves.length - 1
    const secondLast = staves.length - 2
    const thirdLast = staves.length - 3

    switch (staves.length) {
        case 0:
            staffOne.innerHTML = "Esperando partitura..."
            staffTwo.className = ''
            staffTwo.classList.add('gone')
            staffThree.className = ''
            staffThree.classList.add('gone')
            break
        case 1:
            lastSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffOne.data = lastSvg
            staffOne.classList.add('next')
            staffTwo.classList.add('hidden', 'afterNext')
            staffThree.classList.add('hidden', 'gone')
            break
        case 2:
            secondLastSvg = `../svg/${staves[secondLast].route}/${staves[secondLast].svg}.cropped.svg`
            staffOne.data = secondLastSvg
            staffOne.className = ''
            staffOne.classList.add('current')

            lastSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffTwo.data = lastSvg
            staffTwo.className = ''
            staffTwo.classList.add('next')

            staffThree.className = ''
            staffThree.classList.add('gone')
            break
        default:
            thirdLastSvg = `../svg/${staves[thirdLast].route}/${staves[thirdLast].svg}.cropped.svg`
            staffOne.data = thirdLastSvg
            staffOne.className = ''
            staffOne.classList.add('current')

            secondLastSvg = `../svg/${staves[secondLast].route}/${staves[secondLast].svg}.cropped.svg`
            staffTwo.data = secondLastSvg
            staffTwo.className = ''
            staffTwo.classList.add('next')

            lastSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffThree.data = lastSvg
            staffThree.className = ''
            staffThree.classList.add('hidden', 'afterNext')

            break
    }
}

const stepForward = staff => {
    let staffClassList = Array.from(staff.classList)
    let staffState = staffClassList.filter(
        item => state.includes(item)
    ).toString()
    let index = state.indexOf(staffState)
    //console.log(staffClassList)
    console.log(staffState)
    //console.log(index)
    //console.log(staff.classList)
    let nextIndex = (index + 1) % state.length
    console.log(nextIndex)

    let nextState = state[nextIndex]
    console.log(nextState)

    staff.classList.replace(staffState, nextState)
}

socket.on('scroll', function(data) {
    //console.log(`scroll socket func: ${JSON.stringify(data)}`)
    if (data.route == route) {
        stepForward(staffOne)
        stepForward(staffTwo)
        stepForward(staffThree)
    }
});