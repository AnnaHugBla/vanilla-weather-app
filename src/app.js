function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}
function getIcon(weatherDescription) {
  let iconElement = "";
  if (weatherDescription === "clear sky") {
    iconElement = "images/clearsky.png";
  } else if (weatherDescription === "few clouds") {
    iconElement = "images/fewclouds.png";
  } else if (weatherDescription === "scattered clouds") {
    iconElement = "images/scattered.png";
  } else if (weatherDescription === "broken clouds") {
    iconElement = "images/broken.png";
  } else if (weatherDescription === "shower rain") {
    iconElement = "images/shower.png";
  } else if (weatherDescription === "rain") {
    iconElement = "images/rain.png";
  } else if (weatherDescription === "thunderstorm") {
    iconElement = "images/thunderstorm.png";
  } else if (weatherDescription === "snow") {
    iconElement = "images/snow.png";
  } else if (weatherDescription === "mist") {
    iconElement = "images/mist.png";
  }
  return iconElement;
}

function displayTemperature(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let cityElement = document.querySelector("#city");
  let countryElement = response.data.sys.country;
  cityElement.innerHTML = `${response.data.name}, ${countryElement}`;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  let sunriseElement = document.querySelector("#sunrise-time");
  sunriseElement.innerHTML = formatHours(response.data.sys.sunrise * 1000);
  let sunsetElement = document.querySelector("#sunset-time");
  sunsetElement.innerHTML = formatHours(response.data.sys.sunset * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let weatherDescription = response.data.weather[0].description;
  iconElement.setAttribute("src", getIcon(weatherDescription));
  celsiusTemperature = response.data.main.temp;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="col-2">
                <h3>${formatHours(forecast.dt * 1000)}</h3>
                <img id="icon"
                  src="${getIcon(forecast.weather[0].description)}"
                  alt=""
                />
                <div class="weather-forecast-temperature">
                  <strong><span id="max-temp">${Math.round(
                    forecast.main.temp_max
                  )}</span>º</strong> <span id="min-temp">${Math.round(
      forecast.main.temp_min
    )}</span>º
                </div>
              </div>`;
  }
}

function search(city) {
  let apiKey = "b673a6fd2063be7438876eb814c9f14f";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  if (cityInputElement.value < 1) {
    alert("Enter a city name or tap 📍 to get your location weather info 😊");
  } else {
    search(cityInputElement.value);
  }
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");

  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = Math.round(celsiusTemperature);

  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = fahrenheitTemperature;

  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = fahrenheitTemperature;

  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = fahrenheitTemperature;
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function handlePosition(position) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "b673a6fd2063be7438876eb814c9f14f";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&&units=${units}`;
  axios.get(url).then(displayTemperature);
}
function getCurrentInfo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}
let currentInfo = document.querySelector("#current-button");
currentInfo.addEventListener("click", getCurrentInfo);

search("Barcelona");
