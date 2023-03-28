//This gets the users current location from the browser
let city;

// function getCity() {
//   return city;
// }

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

//Once the location is gotten, it's converted into lat and long and ran through an api
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  //The api returns a more detailed location summary including city, state, country etc
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const address = data.address;
      city =
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
let getWeatherData = (city) => {
  // Weather API endpoint URL
  const weatherEndpoint = "http://api.weatherapi.com/v1/forecast.json";

  // Weather API key
  const apiKey = "889bcb646a87439db43203647232102";

  // Make a request to the WeatherAPI and display the results on the screen
  fetch(`${weatherEndpoint}?key=${apiKey}&q=${city}&days=7`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fillWeatherData(data);
      createWeatherObject(data);
      localStorage.setItem("weatherData", JSON.stringify(data));
      document.getElementById("btn-container").style.display = "block";
      document.getElementById("cards-container").style.display = "block";
    })
    .catch((error) => {
      console.error(error);
    });
};
