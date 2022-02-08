/*** Socket ***/
const socket = io()
socket.emit('create', route)

/*** Nav bar ***/
socket.on("delete currentInstrument", () => {
    delete localStorage.currentInstrument
})

/*** Metronome ***/
const bpmDisplay = document.querySelector(".metronome .bpm")
const metronomeBox = document.querySelector(".metronome #circle")
bpmDisplay.innerHTML = setupBpm || "..."

const showMetronome = (enable) => {
    const metronomeDiv = document.querySelector(".metronome")
    if (enable) {
        if (metronomeDiv.classList.contains('hidden')) {
            metronomeDiv.classList.remove('hidden')
        }
    } else {
        metronomeDiv.classList.add('hidden')
    }
}

const metronomeListeners = (active) => {
    if (active) {
        socket.on('bpm', (data) => {
            bpmDisplay.innerHTML = data.bpm
        });

        socket.on('beat', (data) => {
            const bpm = parseFloat(data.bpm);
            metronomeBox.animate([
                // keyframes
                {
                    background: 'rgba(0, 0, 0, 0.5)'
                },
                {
                    background: 'rgba(0, 0, 0, 0)'
                }
            ], {
                // timing options
                duration: 60 / bpm * 1000,
                iterations: 1
            })
        })
    } else {
        socket.removeAllListeners('bpm')
        socket.removeAllListeners('beat')
    }
}

//Init settings
const data = JSON.parse(localStorage.getItem("settings"))
for (var prop in data) {
    if (prop == "metronome") {
        if (data[prop] === 'on') {
            metronomeListeners(true)
            showMetronome(true)
        } else {
            metronomeListeners(false)
            showMetronome(false)
        }
    }
}


/*** Scores ***/
const slots = () => {
    return Array.from(document.querySelectorAll(".grid > object"))
}

const svgRoute = staff => `../svg/${staff.route}/${staff.svg}.cropped.svg`

const state = {
    "-1": "complete",
    "0": "current",
    "1": "next",
    "2": "afterNext"
}

const setNewPosition = (currentStaff, newStaff) => {
    const oldPos = currentStaff.dataset.queue
    currentStaff.classList.remove('hidden')
    currentStaff.classList.remove(state[oldPos])
    const newClass = state[newStaff.queue]
    if (newClass) {
        void this.clientWidth // force reflow: workaround for displaying transitions on class change
        currentStaff.classList.add(newClass)
    }
    currentStaff.dataset.queue = newStaff.queue
    //console.log("newStaff positoned", currentStaff)
}

const queueWithinDisplayInterval = (staves) => {
    return staves.filter(staff => staff.queue > -2 && staff.queue < 3)
}

const clearSlot = (slot) => {
    slot.dataset.queue = ""
    slot.dataset.id = ""
    slot.data = ""
    slot.classList = ""
    slot.classList.add('hidden')
}

const findClearSlot = () => {
    return slots().find(staff => !staff.dataset.queue && !staff.dataset.id)
}

const findStaffId = (staff) => {
    return slots().find(currentStaff => staff.id == parseInt(currentStaff.dataset.id))
}

//clear all staves after 'complete'
const clearStaves = (staves) => {
    staves
        .filter(staff => staff.queue < -1)
        .map(staff => {
            const thisSlot = findStaffId(staff)
            if (thisSlot) {
                clearSlot(thisSlot)
            }
        })
}

const updateStaves = (staves) => {
    clearStaves(staves)
    staves = queueWithinDisplayInterval(staves)
    staves.map(newStaff => {
        const currentStaff = findStaffId(newStaff)
        if (currentStaff) {
            setNewPosition(currentStaff, newStaff)
        } else {
            const slot = findClearSlot()
            if (slot) {
                setNewPosition(slot, newStaff)
                slot.dataset.id = newStaff.id
                slot.data = svgRoute(newStaff)
            }
        }
    })
}

updateStaves(staves) //data sent through view_part.render

socket.on('update', (staves) => {
    staves = JSON.parse(staves)
    updateStaves(staves) //new data from server sent through socket
})