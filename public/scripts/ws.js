var socket = io();

/*** Metronome ***/
var bpmDisplay = document.querySelector(".metronome .bpm");
var metronomeBox = document.querySelector(".metronome");

socket.on('bpm', function(data) {
    bpmDisplay.innerHTML = data.bpm;
    metronomeBox.style.animation = `blinker ${60/data.bpm}s cubic-bezier(0.16, 1, 0.3, 1) infinite`;
    console.log(data);
});

socket.on('beat', function(data) {
    /*
    metronomeBox.classList.add('blink');
    setTimeout(function() {
        metronomeBox.classList.remove('blink')
    }, 30)
    */
    //console.log(data);

});


/*** Scores ***/
var staffOne = document.querySelector(".staves .one");
var staffTwo = document.querySelector(".staves .two");
var staffThree = document.querySelector(".staves .three");

var oneSvg;
var twoSvg;
var threeSvg;

let staves = JSON.parse(data);
let initStavesLength;

function initStaff(staves) {
    const last = staves.length - 1
    const secondLast = staves.length - 2
    const thirdLast = staves.length - 3

    switch (staves.length) {
        case 0:
            staffOne.innerHTML = "Esperando partitura..."
            staffTwo.innerHTML = "Esperando partitura..."
            initStavesLength = 0
            break
        case 1:
            oneSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffOne.data = oneSvg
            staffOne.classList.add('next')
            staffTwo.classList.add('afterNext')
            staffTwo.classList.add('hidden')
            initStavesLength = 1
            break
        case 2:
            oneSvg = `../svg/${staves[last].route}/${staves[last].svg}.cropped.svg`
            staffOne.data = oneSvg
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