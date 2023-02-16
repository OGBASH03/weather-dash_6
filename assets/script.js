//apikey to have permission to fetch data
const apiKey = "9f22897565b785c5e1809cff5dde2ef9";

var cities = document.getElementById("city-input");

// handles search button form
function searchCity(event) {
    event.preventDefault();

    const towns = cities.value;

    getCoords(towns);

}

// adding click function to search button
var searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", searchCity)

// function to fetch the cities coordinates 
function getCoords(city) {
    const geoLink = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    fetch(geoLink).then((response) => {
        if (!response.ok) {
            console.log("Uh oh! Something went wrong fetching the city coordinates");
        }
        response.json().then((data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;

            // run trough getForecast function
            getForecast(city, lat, lon);
        });
    });
}

// function to fetch forecast weather (from city coordinates)
function getForecast(city, lat, lon) {
    const apiLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(apiLink).then((response) => {
        if (!response.ok) {
            console.log("Uh oh! Something went wrong fetching the forecast");
        }
        response.json().then((data) => {
            const current = data.current;
            const daily = [];

            for (let i = 0; i < 5; i++) {
                daily.push(data.daily[i])
            }

            // create HTML using given data
            htmlCreater(city, current, daily);
        });
    });


}
// current board
var presentBox = document.getElementById("current");

// 5-day forecast cards
var foreCastBox = document.getElementById("cards");

// function to create HTML
function htmlCreater(city, current, daily) {

    //destroys all children in current board so we can make copies
    presentBox.replaceChildren();

    const presentDate = unixToDate(current.dt);
    const presentIcon = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    // makes data visible in console application tools
    console.log(city, current, daily);

    // h2-cityname-date-icon
    let cityName = document.createElement("h2");
    cityName.innerHTML = `${city} (${presentDate}) <img src = ${presentIcon} />`;

    //temperature 
    const presentTemp = document.createElement("p");
    presentTemp.textContent = `Temp: ${kelvToFahr(current.temp)}°F`

    //wind
    const presentWind = document.createElement("p");
    presentWind.textContent = `Wind: ${current.wind_speed} MPH`;

    //humidity
    const presentHumidity = document.createElement("p");
    presentHumidity.textContent = `Humidity: ${current.humidity}%`

    presentBox.appendChild(cityName);
    presentBox.appendChild(presentTemp);
    presentBox.appendChild(presentWind);
    presentBox.appendChild(presentHumidity);

    //destroys all children in 5-day forecast cards so we can make copies
    foreCastBox.replaceChildren();
    for (let i = 0; i < daily.length; i++) {
        const day = daily[i];

        //card
        const dayCard = document.createElement("div");
        dayCard.className = "card";
        dayCard.innerHTML = `
        <h2>${unixToDate(day.dt)}</h2>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        <p>Temp: ${kelvToFahr(day.temp.day)}°F</p>
        <p>Wind: ${day.wind_speed} MPH</p>
        <p>Humidity: ${day.humidity}%</p>
        `;

        foreCastBox.appendChild(dayCard);


    }

    displayCities(city);
}

//convert unix to readable data format
function unixToDate(unix) {
    const date = new Date(unix * 1000);
    console.log(date);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`

}
//function to convert Kelvin units to fahrenheit units
function kelvToFahr(K) {
    let F = 1.8 * (K - 273) + 32;

    return F.toFixed(2);
}


function displayCities(city) {
    //get data from local storage
    let searchHistory = JSON.parse(localStorage.getItem("history"));

    // creates array if localData doesn't exist
    if (!searchHistory) {
        searchHistory = [];
    }

    //loop through search history and checks if searched cities already exist
    for (let i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i] === city) {

            searchHistory.splice(i, 1);
        }
    }

    //write new data over saved data
    searchHistory.splice(0, 0, city);

    //save to localStorage
    localStorage.setItem("history", JSON.stringify(searchHistory));

    loadRecord();
}

var record = document.getElementById("record");

function loadRecord() {
    record.replaceChildren();

    let searchHistory = JSON.parse(localStorage.getItem("history"));

    if (!searchHistory) {
        return;
    }

    //loop through search history and creates buttons for cities already searched
    for (let i = 0; i < searchHistory.length; i++) {
        let cityButton = document.createElement("button");
        cityButton.className = " btn btn-secondary cityBtn";
        cityButton.textContent = searchHistory[i];
        record.append(cityButton);


        // get textcontent and run fetch function
        cityButton.addEventListener("click", function(event){
            event.preventDefault();

            let cityName = event.target.textContent;
            getCoords(cityName);
        });
    }
}

//load cities records on page load
loadRecord();


