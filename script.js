
var HOUSE_GROWTH = 1.05;
var HOUSE_SIZE = 5; // People per house
var WOOD_EFFICIENCY = 5; // This many people is required for 1 unit per second
var DEATH_FACTOR = 0.8; // Affects the likeliness of death relative to the amount of people
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
function restart(hard = 0) {
    if (hard) {
        set_cookie("woodcutter", 0);
        set_cookie("wood", 0);
        set_cookie("people", 0);
        set_cookie("house", 1);
    }
    else {
        check_cookie("woodcutter", 0);
        check_cookie("wood", 0);
        check_cookie("people", 0);
        check_cookie("house", 1);
    }
}


function add_to_cookie(key, value) {
    if (Number(get_cookie(key)) + value >= 0) {
        if (key == "woodcutter") {
            if (Number(get_cookie("people")) >= value) {
                set_cookie(key, Number(get_cookie(key)) + value, 365);
                set_cookie("people", Number(get_cookie("people")) - value, 365);
            }
        }
        else if (key == "house") {
            var price = 100 * Math.pow(HOUSE_GROWTH, Number(get_cookie("house")));
            if (Number(get_cookie("wood")) >= price) {
                set_cookie(key, Number(get_cookie(key)) + value, 365);
                set_cookie("wood", Number(get_cookie("wood")) - price);
            }
        }
        else {
            set_cookie(key, Number(get_cookie(key)) + value, 365);
        }
    }
}
function update_people() {
    // Update HTML
    document.getElementById("woodcutter").innerHTML = "Woodcutter: " + get_cookie("woodcutter");
    document.getElementById("people").innerHTML = "People: " + get_cookie("people");
    // Check max
    if (Number(get_cookie("house")) * HOUSE_SIZE < Number(get_cookie("people"))) {
        set_cookie("people", Number(get_cookie("house")) * HOUSE_SIZE);
    }


}

function update_resources() {
    // Update Cookies
    var auto = 0.0;

    auto += Number(get_cookie("woodcutter"))/WOOD_EFFICIENCY;
    add_to_cookie("wood", auto);
    document.getElementById("wood").innerHTML = "Wood: " + parseInt(get_cookie("wood")) + " (" + Math.round(auto * 100) / 100 + ")";

    // Update BUILDS
    document.getElementById("house").innerHTML = "House: " + parseInt(get_cookie("house"));
    document.getElementById("house_tooltip").innerHTML = "Wood: " + parseInt(100 * Math.pow(HOUSE_GROWTH, Number(get_cookie("house"))));
}
function chance() {
    if (Math.floor(Math.random() * 10) == 0) {
        add_to_cookie("people", 1);
        notify("A stranger came to the dwelling.");
    }
    if (Math.floor(Math.random() * 30) == 0) {
        add_to_cookie("people", 4);
        notify("A family arrived at the dwelling.");
    }

}
function notify(msg) {
    return 0;

}
// NON-FUNCTIONS
setInterval(update_people, 100);
setInterval(update_resources, 1000);
setInterval(chance, 1000);
setInterval(restart, 1000);