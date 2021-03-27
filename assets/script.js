let $city = $('.city');
let $search = $('.search');
let $searchHist = $('.search-history')
let $dayCard = $('.day');
let $forecast = $('.forecast');
let $searchBtn = $search.children().eq(1);
let $cName = $('.city-name');


const API_KEY = 'dda4fd5a4e43b1b488ab9b9eda5872c0'
const cityData = [];

// get search history or create an empty array for use later
let prevSearches = JSON.parse(localStorage.getItem("searches")) || [];
let weatherForecast = [];
let d = new Date();

function getCities (lat, lon, cnt) {
    fetch('https://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=' + cnt + '&appid=' + API_KEY)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        console.log(data.list);
    });
}


// get current weather conditions and display data to main card
function renderWeather(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + API_KEY)
    .then(function(response) {
        if(response.ok){
            return response.json();
        } else {
            throw Error("Rejected with status: " + response.status)
        };
    })
    .then(function(data) {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        getUV(lat, lon)
        let $cTemp = $('.temp');
        let $cHum = $('.humidity');
        let $wind = $('.wind-speed');
        $wind.text("Wind speed: " + data.wind.speed + "mph")
        console.log(data)
        let city = data.name;
        let weather = data.weather;
        let icon = weather[0].icon;
        console.log(lat)
        console.log(lon)
        let $iconEl = $('<img>');
        $iconEl.attr("src", "https://openweathermap.org/img/w/" + icon + ".png")
        $cName.text(city);
        $cName.append($iconEl)
        $cTemp.text("Temp: " + data.main.temp)
        $cTemp.append("<span>&#8451;</span>")
        $cHum.text("Humidy: " + data.main.humidity + "%")
        saveSearch(city)
        renderHistory();
    })
    .catch(console.error)
}

function getUV(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + API_KEY)
    .then(function(response) {
        if(response.ok){
            return response.json();
        } else {
            throw Error("Rejected with status: " + response.status)
        };
    })
    .then(function(data) {
        let UVIndex = data.current.uvi;
        let condition = '';
        if(UVIndex > 8) {
            condition = 'bg-danger'
        } else if(UVIndex > 5 && UVIndex < 8){
            condition = 'bg-warning'
        } else if (UVIndex > 2 && UVIndex < 6){
            condition = 'bg-warning'
        } else {
            condition = 'bg-primary'
        }
        let $UV = $('.UV');
        $UV.text("UV Index: ")
        let badge = $('<span>');
        badge.addClass("badge");
        badge.addClass(condition)
        $UV.append(badge)
        badge.text(UVIndex)
    })
};

// save the search history
function saveSearch(cityName) {
    if(prevSearches.indexOf(cityName) === -1){
        prevSearches.push(cityName);
        localStorage.setItem("searches",JSON.stringify(prevSearches))
    } else if(prevSearches.indexOf(cityName) > -1){
        return;
    }
};

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

function renderForecast(cityName) {
    $forecast.empty();
    let $h3 = $('<h3>');
    $h3.text("5-Day Forecast:")
    $forecast.append($h3)
    fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + API_KEY)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        //console.log(data.list.length);
        // every 8 elements is a new day
        console.log(data)
        for(let i = 8; i != data.list.length; i += 8){
            let date = data.list[i].dt_txt;
            let temp = data.list[i].main.temp;
            let humidity = data.list[i].main.humidity;
            let icon = data.list[i].weather[0].icon;
            createForecast(date, temp, humidity, icon);
        }
    })
}

function createForecast(date, temp, humidity, icon){
    //$forecast.empty();
    let $div = $('<div>');
    $div.attr("class", "col");
    let $card = $('<article>');
    $card.addClass("card day")
    let $cardBody = $('<div>');
    $cardBody.addClass("card-body");
    let $title = $('<h5>');
    let $temp = $('<p>');
    $temp.addClass('text-light');
    $title.addClass('text-light')
    let $iconEl = $('<img>');
    $iconEl.attr("src", "https://openweathermap.org/img/w/" + icon + ".png")
    $temp.text("Temp: " + temp);
    $temp.append("<span>&#8451;</span>")
    $title.addClass("card-title date")
    $title.text(date);
    $div.append($card);
    $card.append($cardBody);
    $cardBody.append($title)
    $cardBody.append($temp)
    $cardBody.append($iconEl)
    $forecast.append($div);
}

setUp();

function setUp(){
    $forecast.empty();
    renderHistory();
}

$searchBtn.on("click", function(){
    $city.show();
    $forecast.show()
    renderWeather($search.children().eq(0).val());
    renderForecast($search.children().eq(0).val());
})

// search via search history
$searchHist.on("click", function(event){
    $city.show();
    renderWeather(event.target.textContent)
    renderForecast(event.target.textContent)
})




