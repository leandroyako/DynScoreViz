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
//let initStavesLength;

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
    switch (initStavesLength) {
        case 0:
            break
        case 1:
            staffOne.classList.add('next')
            staffTwo.classList.add('afterNext')
            staffTwo.classList.add('hidden')
            break
        case 2:
            staffOne.classList.remove('hidden')
            staffOne.classList.add('current')

            twoSvg = `../svg/${staves[secondLast].route}/${staves[secondLast].svg}.cropped.svg`
            staffTwo.data = twoSvg
            next.classList.remove('hidden')
            staffTwo.classList.add('next')

            initStavesLength = 2
            break
        default:
            oneSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffOne.data = oneSvg
            //staffOne.classList.remove('hidden')
            staffOne.classList.add('current')

            twoSvg = `../svg/${staves[secondLast].route}/${staves[secondLast].svg}.cropped.svg`
            staffTwo.data = twoSvg
            //staffTwo.classList.remove('hidden')
            staffTwo.classList.add('next')

            threeSvg = `../svg/${staves[thirdLast].route}/${staves[thirdLast].svg}.cropped.svg`
            staffThree.data = threeSvg
            staffThree.classList.add('hidden')
            staffThree.classList.add('afterNext')

            initStavesLength = 3
            break
    }
};

socket.on('scroll', function(data) {
    if (data.route == route) {
        /*
        scroll staves one step forward
        */
    }
});