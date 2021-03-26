let $city = $('.city');
let $search = $('.search');
let $searchHist = $('.search-history')
let $dayCard = $('.day');
let $forecast = $('.forecast');
let $searchBtn = $search.children().eq(1);
let $cName = $('.city-name');
let $cTemp = $('.temp');
let $cHum = $('.humidity')

const API_KEY = 'dda4fd5a4e43b1b488ab9b9eda5872c0'
const cityData = [];

// get search history or create an empty array for use later
let prevSearches = JSON.parse(localStorage.getItem("searches")) || [];
let weatherForecast = [];
let d = new Date();

function getCities (lat, lon, cnt) {
    fetch('http://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=' + cnt + '&appid=' + API_KEY)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        console.log(data.list);
    });
}


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
        $cName.text(city);
        $cTemp.text("Temp: " + data.main.temp + " degrees celcius")
        $cHum.text("Humidy: " + data.main.humidity + "%")
        saveSearch(city)
        renderHistory();
    })
    .catch(console.error)
}

// save the search history
function saveSearch(cityName) {
    if(prevSearches.indexOf(cityName) === -1){
        prevSearches.push(cityName);
        localStorage.setItem("searches",JSON.stringify(prevSearches))
    } else if(prevSearches.indexOf(cityName) > -1){
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

function renderForecast(cityName) {
    fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + API_KEY)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        //console.log(data.list.length);
        for(let i = 0; i != data.list.length; i += 8){
            let date = data.list[i].dt_txt;
            let temp = data.list[i].main.temp;
            let humidity = data.list[i].main.humidity;
            createForecast(date, temp, humidity);
        }
    })
}

function createForecast(date, temp, humidity){
    //
    console.log(date);
    console.log(temp);
    console.log(humidity);
    let $div = $('<div>');
    $div.attr("class", "col");
    let $card = $('<article>');
    $card.addClass("card day")
    let $cardBody = $('<div>');
    $cardBody.addClass("card-body");
    let $title = $('<h3>');
    let $temp = $('<p>');
    $temp.text("Temp: " + temp);
    $title.addClass("card-title date")
    $title.text(date);

    $div.append($card);
    $card.append($cardBody);
    $cardBody.append($title)
    $cardBody.append($temp)
    $forecast.append($div);
}

renderHistory();

$searchBtn.on("click", function(){
    $city.show();
    $forecast.show()
    renderWeather($search.children().eq(0).val());
    renderForecast($search.children().eq(0).val());
})

// search via search history
$searchHist.on("click", function(event){
    $city.show();
    $forecast.show();
    renderWeather(event.target.textContent)
    renderForecast(event.target.textContent)
})




