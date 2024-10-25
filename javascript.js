const form = document.querySelector("form");
const locationSearch = document.querySelector("#location");
const searchSubmit = document.querySelector("#searchsubmit");
const content = document.querySelector("#content");
const weatherLocation = document.querySelector("#wlocation");
const weatherDate = document.querySelector("#wdate");
const weatherIcon = document.querySelector("#wicon");
const todaydegrees = document.querySelector("#wdegrees");
const conditions = document.querySelector("#wcond");
const feelslike = document.querySelector("#wfeelslike");
const forecastDays = document.querySelectorAll(".fcday");
const forecastDegrees = document.querySelectorAll(".fcdegrees");
const forecastIcon = document.querySelectorAll(".fcicon");
const loadingScreen = document.querySelector("#loadingscreenhidden");
const unitsButton = document.querySelector("#unitsbutton");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  getWeather(locationSearch.value);
});

unitsButton.addEventListener("click", toggleUnits);

async function fetchWeatherData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=357YZ7W3PSXH6ASD7Y3VKXVKM`,
    { mode: "cors" }
  );
  if (response.status === 200) {
    const weatherData = await response.json();
    return weatherData;
  } else [console.log(`Server returned error ${response.status}`)];
}

function sortWeatherData(weatherData) {
  let sortedData = [];
  for (i = 0; i < weatherData.days.length; i++) {
    sortedData[i] = {};
    sortedData[i].locationData = weatherData.resolvedAddress.split(", ")[0];
    sortedData[i].datetime = weatherData.days[i].datetime;
    sortedData[i].conditions = weatherData.days[i].conditions;
    sortedData[i].temp = weatherData.days[i].temp;
    sortedData[i].feelslike = weatherData.days[i].feelslike;
    sortedData[i].icon = weatherData.days[i].icon;
  }
  return sortedData;
}

function renderWeatherData(weatherData) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate()}`;
  const today = new Date(
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate()}`
  ).getDay();

  weatherLocation.textContent = weatherData[0].locationData;
  weatherDate.textContent = `${days[today]} - ${todayDate}`;
  todaydegrees.textContent =
    Number(weatherData[0].temp).toFixed(0) + "\u00B0" + "C";

  conditions.textContent = weatherData[0].conditions;
  assignWeatherIcon(weatherData[0], weatherIcon);

  feelslike.textContent = `Feels like ${
    weatherData[0].feelslike.toFixed(0) + "\u00B0" + "C"
  }`;

  for (i = 0; i < forecastDays.length; i++) {
    const fcDayNumber = new Date(
      weatherDataHolder.getData()[i + 1].datetime
    ).getDay();
    forecastDays[i].textContent = days[fcDayNumber];
    forecastDegrees[i].textContent =
      Number(weatherData[i + 1].temp).toFixed(0) + "\u00B0" + "C";
    assignWeatherIcon(weatherData[i + 1], forecastIcon[i]);
  }
}

function toggleUnits() {
  let weatherData = weatherDataHolder.getData();
  if (unitsButton.dataset.unit === "celsius") {
    toggleToFahrenheit(weatherData);
    unitsButton.dataset.unit = "fahrenheit";
  } else if (unitsButton.dataset.unit === "fahrenheit") {
    toggleToCelcius(weatherData);
    unitsButton.dataset.unit = "celsius";
  }
}

function toggleToFahrenheit(weatherData) {
  todaydegrees.textContent =
    ((Number(weatherData[0].temp) * 9) / 5 + 32).toFixed(0) + "\u00B0" + "F";

  feelslike.textContent = `Feels like ${
    ((Number(weatherData[0].feelslike) * 9) / 5 + 32).toFixed(0) +
    "\u00B0" +
    "F"
  }`;

  for (i = 0; i < forecastDays.length; i++) {
    forecastDegrees[i].textContent =
      ((Number(weatherData[i + 1].temp) * 9) / 5 + 32).toFixed(0) +
      "\u00B0" +
      "F";
  }
}

function toggleToCelcius(weatherData) {
  todaydegrees.textContent =
    Number(weatherData[0].temp).toFixed(0) + "\u00B0" + "C";

  feelslike.textContent = `Feels like ${
    Number(weatherData[0].feelslike).toFixed(0) + "\u00B0" + "C"
  }`;

  for (i = 0; i < forecastDays.length; i++) {
    forecastDegrees[i].textContent =
      Number(weatherData[i + 1].temp).toFixed(0) + "\u00B0" + "C";
  }
}

function assignWeatherIcon(weatherData, icon) {
  if (weatherData.icon === "cloudy") {
    icon.src = "images/cloud-svgrepo-com.svg";
  } else if (weatherData.icon === "rain") {
    icon.src = "images/cloud-with-rain-svgrepo-com.svg";
  } else if (weatherData.icon.includes("partly-cloudy")) {
    icon.src = "images/sun-behind-cloud-svgrepo-com.svg";
  } else if (weatherData.icon.includes("thunder")) {
    icon.src = "images/storm-thunder-svgrepo-com (1).svg";
  } else if (weatherData.icon.includes("showers")) {
    icon.src = "images/cloud-with-rain-svgrepo-com.svg";
  } else if (weatherData.icon.includes("fog")) {
    icon.src = "images/cloud-svgrepo-com.svg";
  } else if (weatherData.icon === "wind") {
    icon.src = "images/wind-svgrepo-com.svg";
  } else if (weatherData.icon === "snow") {
    icon.src = "images/cloud-with-snow-svgrepo-com.svg";
  } else {
    icon.src = "images/sun-svgrepo-com.svg";
  }
}

function toggleContentVis(toggle) {
  if (toggle === 0) content.id = "content";
  else if (toggle === 1) {
    content.id = "contentvisible";
  }
}

function toggleLoadScreenVis(toggle) {
  if (toggle === 0) loadingScreen.id = "loadingscreenhidden";
  else if (toggle === 1) loadingScreen.id = "loadingscreen";
}

async function getWeather(location) {
  toggleLoadScreenVis(1);
  try {
    const rawWeatherData = await fetchWeatherData(location);
    const weatherData = sortWeatherData(rawWeatherData);
    weatherDataHolder.setData(weatherData);
    toggleLoadScreenVis(0);
    toggleContentVis(1);
    renderWeatherData(weatherData);
  } catch {
    alert("No weather data found");
    toggleLoadScreenVis(0);
  }
}

//The main purpose of weatherDataHolder is to store sorted weatherdata so that it can be accessed by the toggleUnits function
const weatherDataHolder = (function () {
  let data = [];
  function setData(newData = []) {
    data = [...newData];
  }
  function getData() {
    return data;
  }
  return { setData, getData };
})();
