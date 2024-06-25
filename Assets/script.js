const apiKey = "YOUR_API_KEY_HERE";

document.getElementById("searchBtn").addEventListener("click", function () {
  const city = document.getElementById("city").value;
  if (city) {
    getWeatherData(city);
  }
});

document.getElementById("history").addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    const city = event.target.textContent;
    getWeatherData(city);
  }
});

function getWeatherData(city) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        fetchWeatherForecast(city, lat, lon);
      } else {
        alert("City not found!");
      }
    });
}

function fetchWeatherForecast(city, lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(city, data);
      displayForecast(data);
      updateHistory(city);
    });
}

function displayCurrentWeather(city, data) {
  const currentWeather = data.list[0];
  document.getElementById("currentCity").textContent = city;
  document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString();
  document.getElementById(
    "currentWeatherIcon"
  ).innerHTML = `<img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">`;
  document.getElementById("currentTemp").textContent = currentWeather.main.temp;
  document.getElementById("currentHumidity").textContent =
    currentWeather.main.humidity;
  document.getElementById("currentWind").textContent =
    currentWeather.wind.speed;
  document.getElementById("weatherInfo").classList.remove("d-none");
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }.png" alt="${forecast.weather[0].description}">
      <p>Temp: ${forecast.main.temp} °C</p>
      <p>Wind: ${forecast.wind.speed} m/s</p>
      <p>Humidity: ${forecast.main.humidity} %</p>
    `;
    forecastContainer.appendChild(col);
  }
}

function updateHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
  }
  displayHistory();
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const historyContainer = document.getElementById("history");
  historyContainer.innerHTML = "";
  history.forEach((city) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = city;
    historyContainer.appendChild(li);
  });
}

displayHistory();
