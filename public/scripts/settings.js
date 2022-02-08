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

let settingsState = {}

form.addEventListener('input', e => {
    const formData = Object.fromEntries(new FormData(form))
    //console.table(formData)

    settingsState = JSON.stringify(formData)
    localStorage.setItem("settings", settingsState)

    for (var prop in formData) {
        console.log("Key:" + prop);
        console.log("Value:" + formData[prop]);
    }
})