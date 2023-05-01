//Replace paragraph elements with current weather data information
let fillWeatherData = (data) => {
  // Container in the html that holds the weather text boxes
  const weatherContainer = document.querySelector("#weather-container");

  //If location is in the US, print City, State
  country = data.location.country;
  if (country === "USA" || country === "United States of America") {
    document.getElementById(
      "location"
    ).innerHTML = `${data.location.name}, ${data.location.region}`;

    //If location is not in US print City, Country
  } else {
    document.getElementById(
      "location"
    ).innerHTML = `${data.location.name}, ${data.location.country}`;
  }
  console.log(data);
  const weatherHTML = `
                  <p>Current temperature: ${data.current.temp_f} °F</p>
                  <p>Current condition: ${data.current.condition.text}</p>
                  <p>Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                `;

  // Add the weather HTML to the weather container element
  document.getElementById("loader").style.display = "none";
  document.getElementById(
    "welcome"
  ).innerHTML = `Welcome to WeatherWear ${localStorage.getItem("name")}!`;
  weatherContainer.innerHTML = weatherHTML;

  //Fill cards
  // Get all the h5 elements on the page
  const h3Elements = document.getElementsByTagName("h3");
  const h4Elements = document.getElementsByTagName("h4");
  const h5Elements = document.getElementsByTagName("h5");
  const cardContainer = document.getElementById("cards-container");
  const imgElements = document.getElementsByTagName("img");
  let hour = getHour(data);
  currDay = 0;

  // Loop through each h5 element and log its content to the console
  for (let i = 0; i < h5Elements.length; i++) {
    let hourTemp = Math.floor(
      data.forecast.forecastday[currDay].hour[hour].temp_f
    ).toString();

    hour += 2;
    if (hour >= 24) {
      hour -= 24;
    }

    // Convert the hour to standard time
    let meridian = "AM";
    let standardHour = hour;
    if (hour >= 12) {
      meridian = "PM";
      if (hour > 12) {
        standardHour = hour - 12;
      }
    }
    if (hour === 0) {
      standardHour = 12;
      currDay = 1;
    }
    let standardTime = `${standardHour}:00 ${meridian}`;
    h5Elements[i].innerHTML = standardTime;
    h3Elements[i].innerHTML =
      data.forecast.forecastday[currDay].hour[hour].condition.text;
    h4Elements[i].innerHTML = `${hourTemp} °F`;
    imgElements[i].src =
      data.forecast.forecastday[currDay].hour[hour].condition.icon;
  }
};

//Retrieve current time data from api call and return exact hour
let getHour = (data) => {
  let dateString = data.current.last_updated;
  const parts = dateString.split(" ");
  const timeParts = parts[1].split(":");
  const hour = parseInt(timeParts[0], 10);
  return hour;
};

//If the user searches for a different location
handleSearch = () => {
  const locationSearch = document.getElementById("location-text");

  //Pretend like you're actually searching for the location
  document.getElementById("location").innerHTML = "Getting Your Location...";
  //Hide the buttons to pretend to think
  document.querySelector("#weather-container").style.display = "none";
  document.getElementById("btn-container").style.display = "none";
  document.getElementById("cards-container").style.display = "none";

  //Wait 3 seconds to make it convincing
  setTimeout(() => {
    {
      //Update the weather data with the new location
      getWeatherData(locationSearch.value);
      document.querySelector("#weather-container").style.display = "block";
      document.getElementById("cards-container").style.display = "block";
    }
  }, 3000);
};

let weatherObject;
const createWeatherObject = (data) => {
  let day = data.forecast.forecastday[0].day;
  weatherObject = {
    high: day.maxtemp_f,
    low: day.mintemp_f,
    condition: day.condition.text,
    // condition: "Patchy rain possible",
    chance_of_rain: day.daily_chance_of_rain,
    chance_of_snow: day.daily_chance_of_snow,
    humidity: day.avghumidity,
    wind_speed: day.maxwind_mph,
    uv_index: day.uv,
    average: Math.ceil(day.avgtemp_f),
    // average: 95,
  };
  console.log(weatherObject);
  localStorage.setItem("weatherObject", JSON.stringify(weatherObject));
};
