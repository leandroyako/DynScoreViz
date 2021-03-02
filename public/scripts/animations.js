/*** Navbar ***/
var nav = document.querySelector("nav");

function toggleNav() {
    nav.classList.toggle("hide");
}
/* When user clicks inside window, toggle the navbar */
document.addEventListener('click', function(event) {
    toggleNav();
});

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        toggleNav()
    } else {
        toggleNav()
    }
    prevScrollpos = currentScrollPos;
}