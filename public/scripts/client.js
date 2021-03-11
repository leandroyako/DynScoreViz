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
const metronomeBox = document.querySelector(".metronome");

bpmDisplay.innerHTML = localStorage.currentBpm || "...";

socket.on('bpm', function(data) {
    bpmDisplay.innerHTML = data.bpm;
    localStorage.currentBpm = data.bpm;

    //metronomeBox.style.animation = `blinker ${60/data.bpm}s cubic-bezier(0, 1, 0, 1)`;
    //metronomeBox.style.animation = `blinker ${60/data.bpm}s cubic-bezier(0, 1, 0, 1)`;
    //console.log(data)
});

socket.on('beat', function(data) {
    //console.log(data);
    const bpm = parseFloat(data.bpm);
    metronomeBox.animate([
        // keyframes
        {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
            //            easing: 'ease-in'
        },
        {
            backgroundColor: 'rgba(0, 0, 0, 0)'
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

const svgRoute = staff => staff ? `../svg/${staff.route}/${staff.svg}.cropped.svg` : ""

const completed = staff => {
    const staffId = parseInt(staff.getAttribute('staffId'))
    console.log(`Staff ${staffId} completed`)
    //emit id to server and mark completed staff in instrument db
    let currentData = staves(data)

    pos = currentData.map(e => {
        return e.id
    }).indexOf(staffId);

    if (currentData[pos]) {
        currentData[pos].complete = true
        data = JSON.stringify(currentData)
        socket.emit("staff completed", currentData[pos])
    } else {
        console.log(`Error: ${staffId} undefined. Cannot mark as completed`)
    }
    //console.log(currentData)
    //console.log(staves(data))
}

const state = ["next", "current", "gone"]

const changeState = (staff, newState) => {
    const oldState = getOldState(staff.classList)
    console.log("oldState", oldState)

    const replaceState = () => setTimeout(() => {
        staff.classList.replace(oldState, newState)
    }, 0); //workaround for displaying transitions on class change

    const addState = () => setTimeout(() => {
        staff.classList.add(newState)
    }, 0); //workaround for displaying transitions on class change

    oldState ? replaceState() : addState()
    if (newState == "gone") {
        completed(staff)
    }
}

const gone = staff => {
    changeState(staff, 'gone')
}
const current = staff => {
    changeState(staff, 'current')
}
const next = staff => {
    changeState(staff, 'next')
}

const getOldState = staffClassList => {
    const classList = Array.from(staffClassList)
    const oldState = classList.filter(
        stateClass => state.includes(stateClass)
    ).toString()
    return oldState
}

const stepForward = staff => {
    const oldState = getOldState(staff.classList)
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
        staff.setAttribute('staffId', obj.id)
    } else {
        staff.innerHTML = "Esperando partitura..."
        console.log("staff attrib undefined")
    }
}

const initStaff = allStaves => {
    let staves = filterCompleted(allStaves)
    const last = lastStaves(staves).last || console.log("last empty")
    const secondLast = lastStaves(staves).secondLast || console.log("secondLast empty")
    const thirdLast = lastStaves(staves).thirdLast || console.log("thirdLast empty")
    console.log("filtered staves: ", staves)

    switch (staves.length) {
        case 0:
            slotOne.innerHTML = "Esperando partitura..."
            //slotOne.classList.remove('hidden')
            //slotTwo.classList.add('hidden')
            //slotThree.classList.add('hidden')
            gone(slotTwo)
            gone(slotThree)
            break
        case 1:
            setStaffAttrib(slotOne, last)
            next(slotOne)
            gone(slotTwo)
            current(slotThree)
            //slotOne.classList.remove('hidden')
            //slotTwo.classList.add('hidden')
            //slotThree.classList.add('hidden')
            break
        case 2:
            setStaffAttrib(slotOne, secondLast)
            current(slotOne)
            setStaffAttrib(slotTwo, last)
            next(slotTwo)
            gone(slotThree)
            //slotOne.classList.remove('hidden')
            //slotTwo.classList.remove('hidden')
            //slotThree.classList.add('hidden')
            break
        default:
            setStaffAttrib(slotOne, thirdLast)
            current(slotOne)
            setStaffAttrib(slotTwo, secondLast)
            next(slotTwo)
            setStaffAttrib(slotThree, last)
            gone(slotThree)
            //slotOne.classList.remove('hidden')
            //slotTwo.classList.remove('hidden')
            //slotThree.classList.add('hidden')
            break
    }
}

initStaff(staves(data)); //uses 'data' from request res.render('view_part')

const updateStaff = allStaves => {
    let staves = filterCompleted(allStaves)
    const last = lastStaves(staves).last || console.log("last empty")
    const secondLast = lastStaves(staves).secondLast || console.log("secondLast empty")
    const thirdLast = lastStaves(staves).thirdLast || console.log("thirdLast empty")

    console.log("filtered staves: ", staves)
    scrollAll()
    setStaffAttrib(slotOne, thirdLast)
    current(slotOne)
    setStaffAttrib(slotTwo, secondLast)
    next(slotTwo)
    setStaffAttrib(slotThree, last)
    gone(slotThree)
    //slotOne.classList.remove('hidden')
    //slotTwo.classList.remove('hidden')
    //slotThree.classList.add('hidden')
}

socket.on('update', data => {
    //if (data.route == route) { //replace with socket 'room'
    //        update(data)
    updateStaff(staves(data.staves))
    scrollAll()
    //}
});

//const update = data => { //uses data from socket.on('update)  
//}

const scrollAll = () => {
    stepForward(slotOne)
    stepForward(slotTwo)
    stepForward(slotThree)
}

socket.on('scroll', data => {
    //if (data.route == route) { //replace with socket room  socket.join(route);
    //   socket.join(route)
    scrollAll()
    //}
});