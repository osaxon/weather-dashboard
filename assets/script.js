let $city = $('.city');
let $search = $('.search');
let $searchBtn = $search.children().eq(1);

const API_KEY = 'dda4fd5a4e43b1b488ab9b9eda5872c0'

function getCities (lat, lon, cnt) {
    fetch('http://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=' + cnt + '&appid=' + API_KEY)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        console.log(data.list);
    });
}


getCities(53.74, -2.24, 10);
