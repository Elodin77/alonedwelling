

//FUNCTIONS


function set_cookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function get_cookie(cname) {
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

function check_cookie(x, backup) {
    if (get_cookie(x) == "") {
    set_cookie(x, backup, 365);
}
}
function restart() {
    set_cookie("woodcutter", 0);
    set_cookie("wood", 0);
}

function add_to_cookie(key, value) {
    if (Number(get_cookie(key)) + value >= 0) {
        set_cookie(key, Number(get_cookie(key)) + value, 365);
    }
}
function update_people() {
    // Update HTML
    document.getElementById("woodcutter").innerHTML = "Woodcutter: " + get_cookie("woodcutter");


}

function update_resources() {
    // Update Cookies
    var auto = 0.0;
    auto += Number(get_cookie("woodcutter"))/5;
    add_to_cookie("wood", auto);
    // Update HTML
    document.getElementById("wood").innerHTML = "Wood: " + parseInt(get_cookie("wood")) + " (" + Math.round(auto * 100) / 100+")";


}
// NON-FUNCTIONS
setInterval(update_people, 100);
setInterval(update_resources, 1000);