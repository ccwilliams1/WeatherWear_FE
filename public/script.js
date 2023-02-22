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
  const weatherEndpoint = "https://api.weatherapi.com/v1/current.json";

  // Weather API key
  const apiKey = "889bcb646a87439db43203647232102";

  // Container in the html that holds the weather text boxes
  const weatherContainer = document.querySelector("#weather-container");

  // Make a request to the WeatherAPI and display the results on the screen
  fetch(`${weatherEndpoint}?key=${apiKey}&q=${city}`)
    .then((response) => response.json())
    .then((data) => {
      // Create an HTML string with the weather data

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
      document.getElementById("btn-container").style.display = "block";
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
