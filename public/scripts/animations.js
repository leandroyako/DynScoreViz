var nav = document.querySelector("nav");

function toggleNav() {
    nav.classList.toggle("hide");
}

document.addEventListener('click', function(event) {
    toggleNav();
});

/*
        var objects = document.querySelectorAll("object");

        objects.forEach(function(el) {
            //console.log(el);
            el.addEventListener('click', function(event) {
                toggleNav()
            }, false)
        });
*/

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