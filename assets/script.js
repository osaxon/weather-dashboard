let $city = $('.city');

const API_KEY = 'dda4fd5a4e43b1b488ab9b9eda5872c0'

fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=dda4fd5a4e43b1b488ab9b9eda5872c0')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.name);
    $city.children().eq(0).text(data.name)

  });