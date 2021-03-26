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


function renderWeather(cityName) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + API_KEY)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let city = data.name;
        $city.children().eq(0).text(city)
        $city.children().eq(1).text("Temp: " + data.main.temp + " degrees celcius")
        $city.children().eq(2).text("Humidy: " + data.main.humidity + "%")
        saveSearch(city)
    })
}

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


$searchBtn.on("click", function(){
    renderWeather($search.children().eq(0).val());
})



