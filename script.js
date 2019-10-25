
var HOUSE_GROWTH = 1.05;
var HOUSE_SIZE = 5; // People per house
var WOODCUTTER_EFFICIENCY = 5; // This many people is required for 1 unit per second
var WOOD_REFINER_EFFICIENCY = 2;
var HAPPINESS_EFFICIENCY = 2;
var HAPPINESS_DROP = 0;

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
        set_cookie("refined_wood", 0);
        set_cookie("wood_refiner", 0);
        set_cookie("happiness", 0);
    }
    else {
        check_cookie("woodcutter", 0);
        check_cookie("wood", 0);
        check_cookie("people", 0);
        check_cookie("house", 1);
        check_cookie("refined_wood", 0);
        check_cookie("wood_refiner", 0);
        check_cookie("happiness", 0);
    }
}


function add_to_cookie(key, value) {
    if (Number(get_cookie(key)) + value >= 0) {
        if (key == "woodcutter" || key == "wood_refiner") {
            if (Number(get_cookie("people")) >= value) {
                set_cookie(key, Number(get_cookie(key)) + value, 365);
                set_cookie("people", Number(get_cookie("people")) - value, 365);
                add_to_cookie("happiness", -5);
                HAPPINESS_DROP += parseInt(get_cookie(key));
            }
        }
        else if (key == "house") {
            var price = 100 * Math.pow(HOUSE_GROWTH, Number(get_cookie("house")));
            if (Number(get_cookie("refined_wood")) >= price) {
                set_cookie(key, Number(get_cookie(key)) + value, 365);
                set_cookie("refined_wood", Number(get_cookie("refined_wood")) - price);
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
    document.getElementById("wood_refiner").innerHTML = "Wood Refiner: " + get_cookie("wood_refiner");
    // Check max
    if (Number(get_cookie("house")) * HOUSE_SIZE < Number(get_cookie("people"))) {
        set_cookie("people", Number(get_cookie("house")) * HOUSE_SIZE);
    }


}
function update_divs() {
    // refined wood
    if (get_cookie("wood") == 0 && get_cookie("woodcutter") == 0 && get_cookie("refined_wood") == 0 && get_cookie("wood_refiner") == 0) {
        document.getElementById("wood_refiner_field").style.display = "none";
        document.getElementById("refined_wood").style.display = "none";
    }
    else {
        document.getElementById("wood_refiner_field").style.display = "block";
        document.getElementById("refined_wood").style.display = "block";
    }
}

function update_resources() {
    // Update Cookies
    var auto = 0.0;
    if (HAPPINESS_DROP > 1) {
        HAPPINESS_DROP *= 0.9;
    }
    var happiness_multiplier = 1+(parseFloat(get_cookie("happiness")) / 100 - 0.5);
    var wood_auto = Number(get_cookie("woodcutter")) / WOODCUTTER_EFFICIENCY * happiness_multiplier;
    var refined_wood_auto = Number(get_cookie("wood_refiner")) / WOOD_REFINER_EFFICIENCY * happiness_multiplier;
    var happiness_auto = get_cookie("people") / HAPPINESS_EFFICIENCY;
    // happiness
    auto = happiness_auto - Math.pow(1.05,HAPPINESS_DROP);
    if (get_cookie("happiness") + auto > 100) {
        set_cookie("happiness", 100);
    }
    else {
        add_to_cookie("happiness", auto);
    }
    document.getElementById("happiness").innerHTML = "Happiness: " + parseInt(get_cookie("happiness")) + " (" + Math.round(auto * 100) / 100 + ") " + "["+parseInt(HAPPINESS_DROP)+"]";
    // wood
    auto = wood_auto - refined_wood_auto;
    if (refined_wood_auto < get_cookie("wood")) {
        add_to_cookie("wood", auto);
    }
    else {
        add_to_cookie("wood", wood_auto);
        add_to_cookie("refined_wood", -refined_wood_auto);
    }
    document.getElementById("wood").innerHTML = "Wood: " + parseInt(get_cookie("wood")) + " (" + Math.round(auto * 100) / 100 + ")";
    // refined wood
    auto = parseFloat(refined_wood_auto);
    add_to_cookie("refined_wood", auto);
    document.getElementById("refined_wood").innerHTML = "Refined Wood: " + parseInt(get_cookie("refined_wood")) + " (" + Math.round(auto * 100) / 100 + ")";

    
    

    // Update BUILDS
    document.getElementById("house").innerHTML = "House: " + parseInt(get_cookie("house"));
    document.getElementById("house_tooltip").innerHTML = "Refined Wood: " + parseInt(100 * Math.pow(HOUSE_GROWTH, Number(get_cookie("house"))));
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
restart(); // sets up cookies if they don't exist
setInterval(update_people, 100);
setInterval(update_resources, 1000);
setInterval(chance, 1000);
setInterval(update_divs, 1000);
setInterval()
