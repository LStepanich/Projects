'use strict';
// Choose City
const citySearchOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'spott.p.rapidapi.com',
    'X-RapidAPI-Key': 'e104818c40mshc9d5d5aa330a349p13dd94jsn247c54395a17',
  },
};

const citySearchUrl = new URL('https://spott.p.rapidapi.com/places/autocomplete');
citySearchUrl.searchParams.set('limit', '5');
citySearchUrl.searchParams.set('skip', '0');
citySearchUrl.searchParams.set('country', 'UA');
citySearchUrl.searchParams.set('q', '');
citySearchUrl.searchParams.set('type', 'CITY');

let cityForm = document.querySelector('#city');
cityForm.addEventListener('click', searchCity);

function searchCity() {
  cityForm.removeEventListener('click', searchCity);
  cityForm.innerHTML = '<input type="text" value="" id="citySearchForm" />';
  cityForm.firstChild.focus();
  cityForm.firstChild.setAttribute('autocomplete', 'off');
  cityForm.firstChild.addEventListener('input', changeCity);
}
let cityList = {};
let timer;
function changeCity() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    citySearchUrl.searchParams.set('q', cityForm.firstChild.value);
    fetch(citySearchUrl, citySearchOptions)
      .then(response => response.json())
      .then(foundedCityList => {
        cityList = foundedCityList;
        displayCityList(cityList);
      })
      .catch(e => console.log(e));
  }, 500);
}

let citySearchList;
let citySelectionFormList;
function displayCityList(cityList) {
  if (citySelectionFormList) {
    citySelectionFormList.remove();
    citySelectionFormList.removeEventListener('click', citySelection);
  }
  citySearchList = document.createElement('ul');
  citySearchList.setAttribute('id', 'cityListForm');
  let inputCoords = cityForm.firstChild.getBoundingClientRect();
  citySearchList.style.left = inputCoords.left + 'px';
  citySearchList.style.top = inputCoords.bottom + 'px';
  citySearchList.style.width = inputCoords.width - 8 + 'px';
  let li;
  for (let i = 0; i < 5; i++) {
    li = document.createElement('li');
    li.setAttribute('id', i);
    li.setAttribute('Class', 'chooseCity');
    li.append(cityList[i].name);
    citySearchList.append(li);
  }
  document.body.append(citySearchList);
  citySelectionFormList = document.querySelector('#cityListForm');
  citySelectionFormList.addEventListener('click', citySelection);
}

function citySelection(event) {
  if (event.target.tagName == 'LI') {
    let foundedCityCoords = {};
    foundedCityCoords.latitude = cityList[event.target.id].coordinates.latitude;
    foundedCityCoords.longitude = cityList[event.target.id].coordinates.longitude;
    citySearchList.remove();
    cityForm.innerHTML = cityList[event.target.id].name;
    cityForm.addEventListener('click', searchCity);
    refreshCurrentWeather(foundedCityCoords);
    refreshWeatherForecast(foundedCityCoords);
  }
}

//TIME
const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEK_DAY = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
];
const dateTime = document.querySelector('#dateTime');
let currentTime = new Date();
function refreshDateTime() {
  currentTime = new Date();
  let minutes = currentTime.getMinutes();
  let hours = currentTime.getHours();
  if (minutes < 10) minutes = '0' + minutes;
  if (hours < 10) hours = '0' + hours;
  dateTime.children[0].innerHTML = `${MONTH[currentTime.getMonth()]} ${currentTime.getDate()}
  , ${currentTime.getFullYear()} - ${WEEK_DAY[currentTime.getDay()]}`;
  dateTime.children[2].innerHTML = `${hours}:${minutes}`;
}

refreshDateTime();
setTimeout(() => {
  refreshDateTime();
  setInterval(refreshDateTime, 60000);
}, 60000 - currentTime.getSeconds() * 1000);

//get img for weather
function getImgCloudsUrl(clouds) {
  if (clouds <= 33) return 'img\\Sun.png';
  if (clouds > 33 && clouds <= 66) return 'img\\SunWithClouds.png';
  if (clouds > 66) return 'img\\clouds.png';
}

//Current Weather

const weatherApiKey = '85545734089d8b4d2a4a7e4c1f3bf97e';
const currentWeatherURL = new URL('https://api.openweathermap.org/data/2.5/weather');
currentWeatherURL.searchParams.set('lat', '');
currentWeatherURL.searchParams.set('lon', '');
currentWeatherURL.searchParams.set('exclude', 'current,daily');
currentWeatherURL.searchParams.set('appid', weatherApiKey);
currentWeatherURL.searchParams.set('units', 'metric');

function refreshCurrentWeather(coords) {
  currentWeatherURL.searchParams.set('lon', coords.longitude);
  currentWeatherURL.searchParams.set('lat', coords.latitude);
  fetch(currentWeatherURL)
    .then(response => {
      return response.json();
    })
    .then(currentWeather => {
      outputCurrentWeather(currentWeather);
    })
    .catch(e => console.log(e));
}

function outputCurrentWeather(weather) {
  document
    .querySelector('#currentTemperatureImg')
    .setAttribute('src', getImgCloudsUrl(weather.clouds.all));
  weather.clouds.all <= 50
    ? (document.querySelector('#clouds').innerHTML = 'Clear')
    : (document.querySelector('#clouds').innerHTML = 'Clouds');
  document.querySelector('#currentTemperature').innerHTML = Math.round(weather.main.temp);
  document.querySelector('#feeling').innerHTML = Math.round(weather.main.feels_like);
  document.querySelector('#pressure').innerHTML = Math.round(weather.main.pressure);
  document.querySelector('#wind').innerHTML = Math.round(weather.wind.speed);
  dateTime.children[4].innerHTML = Math.round(weather.main.humidity);
}

//Weather Forecast for 5 days

const forecastWeatherURL = new URL('https://api.openweathermap.org/data/2.5/forecast');
forecastWeatherURL.searchParams.set('lat', '');
forecastWeatherURL.searchParams.set('lon', '');
forecastWeatherURL.searchParams.set('exclude', 'current,daily');
forecastWeatherURL.searchParams.set('appid', weatherApiKey);
forecastWeatherURL.searchParams.set('units', 'metric');

function refreshWeatherForecast(coords) {
  forecastWeatherURL.searchParams.set('lon', coords.longitude);
  forecastWeatherURL.searchParams.set('lat', coords.latitude);
  fetch(forecastWeatherURL)
    .then(response => {
      return response.json();
    })
    .then(weatherForecast => {
      outputWeatherForecast(weatherForecast);
    })
    .catch(e => console.log(e));
}

function outputWeatherForecast(weather) {
  let days = document.querySelectorAll('.weatherForecast');
  for (let i = 0; i < 5; i++) {
    days[i].children[0].innerHTML = WEEK_DAY[currentTime.getDay() + i];
    days[i].children[2].setAttribute(
      'src',
      getImgCloudsUrl(weather.list[8 * (i + 1) - 1].clouds.all)
    );
    days[i].children[3].innerHTML = Math.round(weather.list[8 * (i + 1) - 1].main.temp);
  }
}
