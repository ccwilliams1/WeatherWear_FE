//This gets the users current weather data from the browser
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

//Once the weather data is gotten, it's converted into lat and long and ran through an api
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  //The api returns a more detailed location summary including city, state, country etc
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const address = data.address;
      const city =
        address.city || address.town || address.village || address.county || "";
      const state = address.state || "";
      const location = `${city}, ${state}`;

      //Use the location from the browser to getWeatherData
      getWeatherData(city);
    })
    .catch((error) => {
      console.error(error);
      showError();
    });
}

//If something goes wrong then say that..
function showError() {
  document.getElementById("location").innerHTML =
    "Unable to retrieve your location.";
}

//WeatherAPI call
const getWeatherData = (city) => {
  // Weather API endpoint URL
  const weatherEndpoint = "http://api.weatherapi.com/v1/forecast.json";

  // Weather API key
  const apiKey = "889bcb646a87439db43203647232102";

  // Make a request to the WeatherAPI and display the results on the screen
  fetch(`${weatherEndpoint}?key=${apiKey}&q=${city}&days=2`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fillWeatherData(data);
      document.getElementById("btn-container").style.display = "block";
      document.getElementById("cards-container").style.display = "block";
    })
    .catch((error) => {
      console.error(error);
    });
};

//If the user searches for a different location
const handleSearch = () => {
  const locationSearch = document.getElementById("location-text");

  //Pretend like you're actually searching for the location
  document.getElementById("location").innerHTML = "Getting Your Location...";
  //Hide the buttons to pretend to think
  document.querySelector("#weather-container").style.display = "none";
  document.getElementById("btn-container").style.display = "none";

  //Wait 3 seconds to make it convincing
  setTimeout(() => {
    {
      //Update the weather data with the new location
      getWeatherData(locationSearch.value);
      document.querySelector("#weather-container").style.display = "block";
    }
  }, 3000);
};

const fillWeatherData = (data) => {
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

  const weatherHTML = `
              <p>Current temperature: ${data.current.temp_f} °F</p>
              <p>Current condition: ${data.current.condition.text}</p>
            `;

  // Add the weather HTML to the weather container element
  weatherContainer.innerHTML = weatherHTML;

  //Fill cards
  // Get all the h5 elements on the page
  const h4Elements = document.getElementsByTagName("h4");
  const h5Elements = document.getElementsByTagName("h5");
  let hour = new Date().getHours();
  currDay = 0;

  // Loop through each h5 element and log its content to the console
  for (let i = 0; i < h4Elements.length; i++) {
    let hourTemp =
      data.forecast.forecastday[currDay].hour[hour].temp_f.toString();
    let decIndex = hourTemp.indexOf(".");
    decIndex == -1 ? (decIndex = hourTemp.length) : decIndex;

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
    h4Elements[i].innerHTML = `${hourTemp
      .toString()
      .substring(0, decIndex)} °F`;
  }
};
