let modal;

document.addEventListener("click", (e) => {
    if (e.target.className === "modal-open") {
        modal = document.getElementById(e.target.dataset.id);
        openModal(modal);
    } else if (e.target.className === "modal-close") {
        closeModal(modal);
    } else {
        return;
    }
});

const openModal = (modal) => {
    document.body.style.overflow = "hidden";
    modal.setAttribute("open", "true");
    document.addEventListener("keydown", escClose);
    let overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    document.body.appendChild(overlay);
};

const closeModal = (modal) => {
    document.body.style.overflow = "auto";
    modal.removeAttribute("open");
    document.removeEventListener("keydown", escClose);
    document.body.removeChild(document.getElementById("modal-overlay"));
};

const escClose = (e) => {
    if (e.keyCode == 27) {
        closeModal();
    }
};

// Form manager
const form = document.querySelector('form')
const sliders = document.querySelectorAll('input[type="range"]')

const rangeToPercent = slider => {
    const max = slider.getAttribute('max') || 10
    const percent = slider.value / max * 100

    return `${parseInt(percent)}%`
}

sliders.forEach(slider => {
    slider.style.setProperty('--track-fill', rangeToPercent(slider))

    slider.addEventListener('input', e => {
        e.target.style.setProperty('--track-fill', rangeToPercent(e.target))
    })
})

form.addEventListener('input', e => {
    const formData = new FormData(form)
    let data = {}

    formData.forEach((value, key) => {
        // Reflect.has in favor of: object.hasOwnProperty(key)
        if (!Reflect.has(data, key)) {
            data[key] = value;
            return;
        }
        if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
        }
        data[key].push(value)
    })

    //fix for retrieveng unchecked checkboxes
    let checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
            data[checkbox.name] = "off"
        }
    })

    console.table(data)
    localStorage.setItem("settings", JSON.stringify(data))

    for (var prop in data) {

        if (prop == "metronome") {
            if (data[prop] === 'on') { //https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript/264037#264037
                try {
                    metronomeListeners(true)
                    showMetronome(true)
                    //console.log("Metronome on")
                } catch {}

            } else {
                try {
                    metronomeListeners(false)
                    showMetronome(false)
                    //console.log("Metronome off")}
                } catch {}
            }
        }
    }
})

//init settings
const savedData = JSON.parse(localStorage.getItem("settings"))

for (var prop in savedData) {
    console.log(prop)
    const currentValue = savedData[prop] == "on" ? true : false
    console.log(currentValue)
    try {
        document.querySelector(`input[name=${prop}]`).checked = currentValue
    } catch {
        console.log(`Error restoring checkbox state for ${prop}`)
    }
}