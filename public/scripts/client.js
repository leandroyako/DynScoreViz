/*** Socket ***/
const socket = io();
socket.emit('create', route)

/*** Nav bar ***/
socket.on("delete currentInstrument", () => {
    delete localStorage.currentInstrument;
    document.getElementById("partitura").href = "";
})
document.getElementById("partitura").href = `/interpreter/${localStorage.currentInstrument}`;

/*** Metronome ***/
const bpmDisplay = document.querySelector(".metronome .bpm");
//const metronomeBox = document.querySelector(".metronome");
const metronomeBox = document.querySelector(".metronome #circle");
bpmDisplay.innerHTML = setupBpm || "...";

socket.on('bpm', (data) => {
    bpmDisplay.innerHTML = data.bpm
});

socket.on('beat', function(data) {
    const bpm = parseFloat(data.bpm);
    metronomeBox.animate([
        // keyframes
        {
            background: 'rgba(0, 0, 0, 0.5)'
            //backgroundColor: 'rgba(0, 0, 0, 0.5)'
            //            easing: 'ease-in'
        },
        {
            background: 'rgba(0, 0, 0, 0)'
            //backgroundColor: 'rgba(0, 0, 0, 0)'
            //            easing: 'ease-out'
        }
    ], {
        // timing options
        duration: 60 / bpm * 1000,
        iterations: 1
    });
});

/*** Scores ***/
const slotOne = document.querySelector(".grid #one");
const slotTwo = document.querySelector(".grid #two");
const slotThree = document.querySelector(".grid #three");

let lastStaves = (staves) => {
    const last = staves[staves.length - 1]
    const secondLast = staves[staves.length - 2]
    const thirdLast = staves[staves.length - 3]

    return {
        thirdLast,
        secondLast,
        last
    }
}

const svgRoute = staff => staff ? `../svg/${staff.route}/${staff.svg}.cropped.svg` : ""

const completed = staff => {
    const staffId = parseInt(staff.getAttribute('staffId'))

    try {

        pos = data.map(e => {
            return e.id
        }).indexOf(staffId); //falla porque no encuentra el Id del ultimo objeto

    } catch (error) {

        if (error instanceof TypeError) {
            console.error(`${data} is empty. Cannot look for staff to mark as completed`)
        } else {
            console.log(error)
        }
    }

    try {
        console.log(data)
        console.log(data[pos])
        data[pos].complete = true
        socket.emit("staff completed", data[pos])

    } catch (error) {

        if (error instanceof TypeError) {
            console.error(`Error: ${staffId} undefined. Cannot mark staff as completed`)
        } else {
            console.log(error)
        }
    }

    const getTransitionEndEventName = () => {
        var transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        }
        let bodyStyle = document.body.style;
        for (let transition in transitions) {
            if (bodyStyle[transition] != undefined) {
                return transitions[transition];
            }
        }
    }

    const transitionEndHandler =
        (event) => {
            if (event.propertyName == 'opacity') {
                stepForward(staff); // 'gone' -> completed() -> 'afterNext' in one step
                staff.removeEventListener(getTransitionEndEventName(), transitionEndHandler)

                try {
                    data.splice(pos, 1) //reminder: data is allStaves, unfiltered
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.error(`${data} is empty. Cannot splice any element`)
                    } else {
                        console.log(error)
                    }
                }

            }
        }

    staff.addEventListener(getTransitionEndEventName(), transitionEndHandler);
}



const state = ["afterNext", "next", "current", "gone"]

const changeState = (staff, newState) => {
    const oldState = staff.getAttribute('state')
    //console.log("change state staff: ", staff)

    const replaceState = () => setTimeout(() => {
        staff.classList.replace(oldState, newState)
    }, 0); //workaround for displaying transitions on class change

    const addState = () => setTimeout(() => {
        staff.classList.add(newState)
    }, 0); //workaround for displaying transitions on class change

    oldState ? replaceState() : addState()

    staff.removeAttribute('state')
    staff.setAttribute('state', newState) //store state on element

    const staffId = parseInt(staff.getAttribute('staffId'))
    //console.log("change state staffId: ", staffId)
    socket.emit("staff state", route, staffId, newState)

    if (newState == "gone") {
        completed(staff)
    }
}

const gone = staff => {
    changeState(staff, state[3])
}
const current = staff => {
    changeState(staff, state[2])
}
const next = staff => {
    changeState(staff, state[1])
}
const afterNext = staff => {
    changeState(staff, state[0])
}

const stepForward = staff => {
    const oldState = staff.getAttribute('state')
    let index = state.indexOf(oldState)
    let nextIndex = (index + 1) % state.length
    let nextState = state[nextIndex]
    changeState(staff, nextState)
}

const filterCompleted = staves => {
    return staves.filter(staff => !staff.complete)
}

const setStaffAttrib = (staff, obj) => {
    if (staff && obj) {
        staff.data = svgRoute(obj)
        staff.innerHTML = ""
        staff.setAttribute('staffId', obj.id)
    } else {
        staff.innerHTML = "Esperando partitura..."
        //   staff.data = ""
        console.error("staff attributes undefined")
    }
}

const placeStaves = allStaves => {
    let staves = filterCompleted(allStaves)
    const last = lastStaves(staves).last || console.log("last empty")
    const secondLast = lastStaves(staves).secondLast || console.log("secondLast empty")
    const thirdLast = lastStaves(staves).thirdLast || console.log("thirdLast empty")
    console.log("filtered staves: ", staves)

    switch (staves.length) {
        case 0:
            slotOne.innerHTML = "Esperando partitura..."
            next(slotOne)
            afterNext(slotTwo)
            current(slotThree)
            //slotThree.classList.add('hidden')
            break
        case 1:
            setStaffAttrib(slotOne, last)
            next(slotOne)

            afterNext(slotTwo)
            current(slotThree)

            //slotThree.classList.add('hidden')
            //slotThree.innerHTML = "Esperando partitura..."
            break
        default:
            //slotThree.classList.remove('hidden')

            setStaffAttrib(slotOne, thirdLast)
            current(slotOne)

            setStaffAttrib(slotTwo, secondLast)
            next(slotTwo)

            setStaffAttrib(slotThree, last)
            afterNext(slotThree)
            break
    }
}

placeStaves(data); //uses 'data' from request res.render('view_part')

socket.on('update', staves => {
    placeStaves(JSON.parse(staves)) //new data from server sent through socket
    //quizá en lugar de placeStaves tendría que haber algo que lea 'state' de cada objeto para aplicarlo a los slots y solo agregar el siguiente
});

const scrollAll = () => {
    stepForward(slotOne)
    stepForward(slotTwo)
    stepForward(slotThree)
}

socket.on('scroll', () => {
    scrollAll()
});