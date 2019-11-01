
// VARIABLES
var WOODCUTTER_EFFICIENCY = 5; // This many people is required for 1 unit per second
var WOOD_REFINER_EFFICIENCY = 3;
var HAPPINESS_EFFICIENCY = 2;
var HAPPINESS_DROP = 0;
var HUNTER_EFFICIENCY = 4;

var HOUSE_GROWTH = 1.05;
var HOUSE_SIZE = 5; // People per house
var HOUSE_PRICE = 30;
var REFINED_WOOD_WEAPON_PRICE = 5; // amount of refined wood required for 1 weapon
var FOOD_CONSUMPTION = 0.1; // amount of food each person eats every second.

var PEOPLE = ["people", "woodcutter", "wood_refiner", "hunter"];
var FORMAT = ["People: ", "Woodcutters: ", "Wood Refiners: ", "Hunters: "];
var COOKIE = ["woodcutter", "wood", "people", "house", "refined_wood", "wood_refiner", "happiness", "population", "hunter", "raw_meat",
    "weapon"
];
var FOOD = ["raw_meat"];
var TIPS = ["Make your people happy and they will work better! Nobody is happy to work.",
    "Food is very important. Hunters can help with that, but only if they have weapons to hunt with."
]

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
        for (var i = 0; i < COOKIE.length; i++) {
            set_cookie(COOKIE[i], 0);
        }
        set_cookie("house", 1);
        set_cookie("people", 2);
    }
    else {
        for (var i = 0; i < COOKIE.length; i++) {
            check_cookie(COOKIE[i],0);
        }
        check_cookie("house", 1);
        check_cookie("people", 2);
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
            var price = HOUSE_PRICE * Math.pow(HOUSE_GROWTH, Number(get_cookie("house")));
            if (Number(get_cookie("refined_wood")) >= price) {
                set_cookie(key, Number(get_cookie(key)) + value, 365);
                set_cookie("refined_wood", Number(get_cookie("refined_wood")) - price);
            }
        }
        else if (key == "refined_wood_weapon") {
            var price = REFINED_WOOD_WEAPON_PRICE;
            if (Number(get_cookie("refined_wood")) >= price) {
                set_cookie("weapon", Number(get_cookie("weapon")) + value, 365);
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
    set_cookie("population", 0);
    for (var i = 0; i < PEOPLE.length; i++) {
        document.getElementById(PEOPLE[i]).innerHTML = FORMAT[i] + get_cookie(PEOPLE[i]);
        add_to_cookie("population", Number(get_cookie(PEOPLE[i])));
    }
    document.getElementById("population").innerHTML = "Population: " + get_cookie("population");
    // calculate food
    set_cookie("food", 0);
    for (var i = 0; i < FOOD.length; i++) {
        add_to_cookie("food", Number(get_cookie(FOOD[i])));
    }
    add_to_cookie("food", -Number(get_cookie("population")) * FOOD_CONSUMPTION);
    document.getElementById("food").innerHTML = "Food: " + Number(get_cookie("food"));

    // Check max
    if (Number(get_cookie("house")) * HOUSE_SIZE < Number(get_cookie("population")) && get_cookie("people")>0) {
        add_to_cookie("people", -1);
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
    var happiness_multiplier = parseFloat(get_cookie("happiness")) / 100;
    var wood_auto = Number(get_cookie("woodcutter")) / WOODCUTTER_EFFICIENCY * happiness_multiplier;
    var refined_wood_auto = Number(get_cookie("wood_refiner")) / WOOD_REFINER_EFFICIENCY * happiness_multiplier;
    var happiness_auto = get_cookie("people") / HAPPINESS_EFFICIENCY;
    var raw_meat_auto = Number(get_cookie("hunter")) / HUNTER_EFFICIENCY * happiness_multiplier;
    // happiness
    auto = happiness_auto - Math.pow(1.05,HAPPINESS_DROP);
    if (Number(get_cookie("happiness")) + auto > 100) {
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

    // raw meat
    if (Number(get_cookie("weapon")) > 0) {
        auto = parseFloat(raw_meat_auto);
    }
    else {
        auto = 0;
    }
    add_to_cookie("raw_meat", auto);
    document.getElementById("raw_meat").innerHTML = "Raw Meat: " + parseInt(get_cookie("raw_meat")) + " (" + Math.round(auto * 100) / 100 + ")";
    // weapons
    document.getElementById("weapon").innerHTML = "Weapons: " + get_cookie("weapon");

    // Update BUILDS
    document.getElementById("house").innerHTML = "House: " + parseInt(get_cookie("house"));
    document.getElementById("house_tooltip").innerHTML = "Refined Wood: " + parseInt(HOUSE_PRICE * Math.pow(HOUSE_GROWTH, Number(get_cookie("house"))));
    document.getElementById("refined_wood_weapon_tooltip").innerHTML = "Refined Wood: " + parseInt(REFINED_WOOD_WEAPON_PRICE);
}
function chance() {
    if (Math.floor(Math.random() * 10) == 0 && Number(get_cookie("population")) < Number(get_cookie("house"))*HOUSE_SIZE && Number(get_cookie("people"))>0) {
        add_to_cookie("people", 1);
        
    }
    if (Math.floor(Math.random() * 30) == 0 && Number(get_cookie("population")) < (Number(get_cookie("house"))-3) * HOUSE_SIZE&&get_cookie("people")>0) {
        add_to_cookie("people", 4);
    }
    if (Math.floor(Math.random() * parseFloat(get_cookie("population")) * 10 / (Number(get_cookie("hunter")) + Number(get_cookie("weapon")) / 20)) == 0 && Number(get_cookie("weapon")) >= 1) {
        add_to_cookie("weapon", -1);
    }
    if (Math.floor(Math.random() * (parseFloat(get_cookie("food")) + 10) / Number(get_cookie("population"))) && Number(get_cookie("people"))>0 && Number(get_cookie("population"))>5) {
        add_to_cookie("people", -1);
    }

}
function update_tips() {
    document.getElementById("tips").innerHTML = TIPS[Math.floor(Math.random() * TIPS.length)];
}

// NON-FUNCTIONS
restart(); // sets up cookies if they don't exist
setInterval(update_people, 100);
setInterval(update_resources, 1000);
setInterval(chance, 1000);
setInterval(update_divs, 1000);
setInterval(update_tips, 10000);
