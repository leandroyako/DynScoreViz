/*
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
*/

const previewSlot = document.querySelector("#preview-slot")
const previewModal = document.querySelector("#preview-modal")

socket.on("preview staff", (route, svg) => {
    console.log("preview staff", svg)
    const svgRoute = `../svg/${route}/tmp_prev/${svg}.cropped.svg`
    previewSlot.data = svgRoute
    console.log(svgRoute)
    //modal = previewModal //to get close button to work
    if (previewModal.getAttribute('open')) {
        closeModal(previewModal)
    }
    openModal(previewModal)
})

socket.on('clear preview', (route) => {
    console.log("clear preview", route)

    if (previewModal.getAttribute('open')) {
        closeModal(previewModal)
    }
})