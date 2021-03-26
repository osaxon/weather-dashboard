let $city = $('.city');
let $search = $('.search');
let $searchHist = $('.search-history')
let $searchBtn = $search.children().eq(1);
const API_KEY = 'dda4fd5a4e43b1b488ab9b9eda5872c0'
const cityData = [];

// get search history or create an empty array for use later
let prevSearches = JSON.parse(localStorage.getItem("searches")) || [];

function getCities (lat, lon, cnt) {
    fetch('http://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=' + cnt + '&appid=' + API_KEY)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        console.log(data.list);
    });
}


//getCities(53.74, -2.24, 10);

// get current weather conditions and display data to main card
function renderWeather(cityName) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + API_KEY)
    .then(function(response) {
        if(response.ok){
            return response.json();
        } else {
            throw Error("Rejected with status: " + response.status)
        };
    })
    .then(function(data) {
        let city = data.name;
        let weather = data.weather;
        let icon = weather[0].icon;
        let $iconEl = $('<img>');
        $iconEl.attr("src", "https://openweathermap.org/img/w/" + icon + ".png")
        $city.children().eq(0).append($iconEl)
        $city.children().eq(0).text(city)
        $city.children().eq(1).text("Temp: " + data.main.temp + " degrees celcius")
        $city.children().eq(2).text("Humidy: " + data.main.humidity + "%")
        saveSearch(city)
        renderHistory();
    })
    .catch(console.error)
}

// save the search history
function saveSearch(cityName) {
    console.log(prevSearches.indexOf(cityName))
    if(prevSearches.indexOf(cityName) === -1){
        prevSearches.push(cityName);
        localStorage.setItem("searches",JSON.stringify(prevSearches))
    } else if(prevSearches.indexOf(cityName) > -1){
        console.log("already in list")
        return;
    }
}

// display previous searches
function renderHistory(){
    $searchHist.empty();
    prevSearches.forEach(function(element){
        let newLi = $('<li>');
        newLi.addClass("list-group-item")
        newLi.text(element);
        newLi.appendTo($searchHist);
    })
}

function getForecast(cityName) {
    fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_KEY)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
    })
}

renderHistory();

$searchBtn.on("click", function(){
    renderWeather($search.children().eq(0).val());
    getForecast($search.children().eq(0).val());
})

// search via search history
$searchHist.on("click", function(event){
    renderWeather(event.target.textContent)
})



