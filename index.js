// https://openweathermap.org/api/one-call-3
const API_Key = "01366bdb155d53e59549a622d8060964";

let mapCon = document.querySelector(".inside_cont1");
let container1El = document.querySelector(".container1");
let blackcontEl = document.querySelector(".black-cont");
let landingEl = document.querySelector(".landing");


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    document.getElementById("latt").textContent = `Lat:${lat}`
    document.getElementById("long").textContent = `long:${long}`
    // console.log(lat, long)
    let mapUrl = `https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed`;
    mapCon.innerHTML = `<iframe src="${mapUrl}" ></iframe>`

    container1El.style.display = "block";
    landingEl.style.display = "none";
    get_weather_data(lat, long)
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}

//get weather data from Weather API
function get_weather_data(lat, long) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_Key}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            show_weather_data(data)//call the function 
        }).catch(err => {
            console.log("err :", err.message)
        })
}


function show_weather_data(obj) {
    show_icon(obj.weather[0].icon, obj.weather[0].main, obj.weather[0].description);
    let lattitue = obj.coord.lat;
    let longitude = obj.coord.lon;
    let location = obj.name + " , " + obj.sys.country;
    let timeZone = obj.timezone;
    let tod = new Date(timeZone);
    timeZone = tod.getHours() + ":" + tod.getMinutes() + "+";

    let sunrise = obj.sys.sunrise;
    let sunset = obj.sys.sunset;
    let sunR = time_format(sunrise);
    let sunS = time_format(sunset);

    let win_speed = obj.wind.speed;

    let temp = obj.main.temp;
    temp = (temp - 273).toFixed(2);
    let pressure = obj.main.pressure;
    let humidity = obj.main.humidity;

    console.log(sunR, sunS, lattitue, longitude, location, timeZone, win_speed, pressure, humidity)

    document.querySelector(".child-container2").innerHTML += ` <div class="inside_cont2">
    <div>Location:${location}</div>
    <div class="lat-log">
    <div>Lat:${lattitue}</div>
    <div>Long:${longitude}</div>
    </div>
<div>TimeZone:${timeZone}</div>
<div>Wind Speed: ${win_speed}metre/sec</div>
<div>Pressure:${pressure}KPa</div>
<div>Humidity:${humidity}%</div>
<div>Temprature:${temp}C</div>
<div class="lat-log">
<div>sunrise:${sunR}AM</div>
<div>sunset:${sunS}PM</div>
</div>

</div>`;

    blackcontEl.style.display = "block";
}

//function to format the time from epoc time
function time_format(value) {
    let epocT = new Date(value)
    return epocT.getHours() % 12 + ":" + epocT.getMinutes();
}


function show_icon(icon, main, description) {
    console.log(icon, main, description);
    let imgSrc = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector(".image-cont").innerHTML += ` <img src="${imgSrc}" alt="weather-icon">
<div>${main}</div>
<div>${description}</div>`;

}
document.getElementById("fetch_data").addEventListener("click", getLocation);