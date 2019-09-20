

//FUNCTIONS


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
    }
    }
    return "";
}

function checkCookie(x, backup) {
    if (getCookie(x) == "") {
    setCookie(x, backup, 365);
}
}
function restart() {
    checkCookie("woodcutter_value", 0);
    checkCookie("wood", 0);
}

function edit(key, value) {
    setCookie(key, getCookie(key) + value,365);
}
function update() {
    // Update HTML
    document.getElementById("woodcutter").innerHTML = "Woodcutter: " + parseInt(getCookie("woodcutter_value"));
    // Update Cookies
    setCookie("wood", getCookie("wood") + getCookie("woodcutter_value"));
}
// NON-FUNCTIONS
setInterval(function () {
    update();

}, 1000);