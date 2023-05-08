//Retrieve DOM elements and assign them variables
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventOverlay = document.getElementById("event-overlay");
const eventDate = document.getElementById("event-date");
const addOutfitButton = document.getElementById("add-outfit");
const clearOutfitButton = document.getElementById("clear-outfit");
const pasteOutfitButton = document.getElementById("paste-outfit");
const closeOutfitButton = document.getElementById("close-outfit");
const weatherData = JSON.parse(localStorage.getItem("weatherData"));
let weatherObject;
let email = localStorage.getItem("email");
let days;
// Initialize the current month and year
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Utility function to get the number of days in a month
const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Print days of the week at the top of the calendar
function renderWeekdaysHeader() {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekdaysHeader = document.getElementById("weekdays-header");

  //Loop through weekdays add add to DOM
  weekdays.forEach((weekday) => {
    const dayName = document.createElement("div");
    dayName.classList.add("weekday");
    dayName.textContent = weekday;
    weekdaysHeader.appendChild(dayName);
  });
}

//Surprise tool that will help us later
let selectedDay;

//This function displays the calendar days to the DOM
async function renderCalendar(month, year) {
  /*When an outfit is generated for a given day, that date and outfit
  are sent to the databse. This expression retrieves all of those dates and outfits
  */
  const response = await fetch("/get-days", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  //Store the retrieved days in a list to be used later
  days = await response.json();

  calendar.innerHTML = "";
  //Add the Month and Year to the top of the calendar
  monthYear.textContent = `${monthNames[month]} ${year}`;

  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Add empty days before the first day of the month to align with weekdays
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day", "empty-day");
    calendar.appendChild(emptyDay);
  }

  //Get current date as numbers
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonthIndex = currentDate.getMonth();
  const currentYearIndex = currentDate.getFullYear();

  //Loop through however many days are in the given month, start at 1 and print all days to the DOM
  for (let i = 1; i <= daysInMonth(month, year); i++) {
    //Each day gets a div
    const day = document.createElement("div");
    //Add styling
    day.classList.add("day");
    //Add text version of date
    day.dataset.date = `${year}-${month + 1}-${i}`;
    day.textContent = i;
    calendar.appendChild(day);

    /* Very important
    If the current day that is being printed has a date that is in the days list
    an outfit has already been generated for it. This expression places an event indicator (white dot)
    on the day to let the user know there's already an outfit for it
    */
    Object.entries(days).forEach(([key, value]) => {
      if (value.date == day.dataset.date) {
        selectedDay = day;
        selectedDay.setAttribute(
          "generatedOutfit",
          JSON.stringify(value.outfit)
        );
        day.classList.add("event-indicator");
      }
    });

    //Function to determine whether a two days are within one week of each other
    const isWithinOneWeek = (date1, date2) => {
      const oneWeekInMilliseconds = 6 * 24 * 60 * 60 * 1000;
      return Math.abs(date1 - date2) <= oneWeekInMilliseconds;
    };

    //On the DOM, highlight the days one week from the current day.
    if (
      isWithinOneWeek(
        new Date(year, month, i),
        new Date(currentYearIndex, currentMonthIndex, currentDay)
      ) &&
      new Date(year, month, i) >=
        new Date(currentYearIndex, currentMonthIndex, currentDay)
    ) {
      day.style.backgroundColor = "#e8e8ab";
    }

    //What to do when a day box is clicked
    day.addEventListener("click", () => {
      //Make the event overlay visible
      eventOverlay.style.display = "flex";
      //Show the date for whatever day you clicked
      eventDate.textContent = `Date: ${day.dataset.date}`;
      selectedDay = day;

      //If the day in question already has an outfit generated for it, fill that outfit
      //Otherwise hide the display in case it was already visible
      if (selectedDay.getAttribute("generatedOutfit")) {
        fillCards(JSON.parse(selectedDay.getAttribute("generatedOutfit")));
        document.querySelector("#clear-outfit").style.display = "inline-block";
      } else {
        document.querySelector("#display-wrapper").style.display = "none";
      }

      //Determine if the selected day is within one week of the current day
      const differenceInDays = Math.ceil(
        (Date.parse(day.dataset.date) - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      //Hide weather container by default
      document.querySelector("#weather-container").style.display = "none";
      // document.querySelector("#paste-outfit").style.display = "block";
      document.querySelector("#add-outfit").style.display = "none";

      //If the two days are within a week apart, populate the event dialog with weather data for that given day
      if (differenceInDays >= 0 && differenceInDays <= 6) {
        document.querySelector("#weather-container").style.display = "block";
        document.querySelector("#add-outfit").style.display = "inline-block";
        const forecastedDay =
          weatherData.forecast.forecastday[differenceInDays].day;
        //console.log(forecastedDay);
        document.querySelector(".high").innerHTML =
          "High: " + forecastedDay.maxtemp_f;
        document.querySelector(".low").innerHTML =
          "Low: " + forecastedDay.mintemp_f;
        document.querySelector(".weather-image").src =
          forecastedDay.condition.icon;
        document.querySelector(".condition").innerHTML =
          forecastedDay.condition.text;

        //Create a weather object for the given day to pass to the rule engine
        weatherObject = {
          high: forecastedDay.maxtemp_f,
          low: forecastedDay.mintemp_f,
          // condition: "Patchy rain possible",
          condition: forecastedDay.condition.text,
          chance_of_rain: forecastedDay.daily_chance_of_rain,
          chance_of_snow: forecastedDay.daily_chance_of_snow,
          humidity: forecastedDay.avghumidity,
          wind_speed: forecastedDay.maxwind_mph,
          uv_index: forecastedDay.uv,
          // average: 70,
          average: Math.ceil(forecastedDay.avgtemp_f),
        };
      }
    });
  }
}

//Go to previous month and print days
prevMonthButton.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

//Go to next month and print days
nextMonthButton.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

//What to do when the Generate Outfit Buttons is pressed
addOutfitButton.addEventListener("click", () => {
  //Prompt the user for the formality (Casual, Business etc.)
  let formalityCheck = document.getElementById("formalityCheck");
  let formalityOverlay = document.getElementById("formalityOverlay");
  formalityCheck.style.display = "block";
  formalityOverlay.style.display = "block";

  //Grab the name of the formality from whichever card they clicked
  let cards = formalityCheck.querySelectorAll(".card-body");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      weatherObject.style = card.textContent;
      weatherObject.userEmail = email;
      formalityCheck.style.display = "none";
      formalityOverlay.style.display = "none";

      selectedDay.classList.add("event-indicator");

      //Send the weather object along with the formality to the rule engine to generate an outfit
      fetch(
        `http://100.26.157.97:8080/weather?data=` +
          encodeURIComponent(JSON.stringify(weatherObject))
      )
        .then((response) => response.json())
        .then((eclipse_data) => {
          let itemIndex = 0;
          //Fill the outfit cards with the element from the eclipse object
          fillCards(eclipse_data[itemIndex]);

          //Now that the clicked date has an outfit associated with it,
          //Send the date and outfit to the database
          let newDate = selectedDay.dataset.date;
          let newOutfit = selectedDay.getAttribute("generatedOutfit");
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/add-day");
          xhr.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
          );
          xhr.send(
            JSON.stringify({
              newDate,
              newOutfit,
              email,
            })
          );
        })
        .catch((error) => console.error(error));
    });
  });
});

//Fill the outfit cards
const fillCards = (outfit) => {
  //Bind the outfit to the given day
  selectedDay.setAttribute("generatedOutfit", JSON.stringify(outfit));
  let displayWrapper = document.getElementById("display-wrapper");
  let cardColors = displayWrapper.querySelectorAll(".card-color");
  let cardTitles = displayWrapper.querySelectorAll(".card-title");
  let cardSubtitles = displayWrapper.querySelectorAll(".card-subtitle");
  let cardTexts = displayWrapper.querySelectorAll(".card-text");

  //Populate all cards with outfit information
  //Outerwear
  cardColors[0].style.background = outfit.outerwear.item_color;
  cardTitles[0].innerHTML = outfit.outerwear.item_name;
  cardSubtitles[0].innerHTML =
    outfit.outerwear.item_type + " | " + outfit.outerwear.item_subtype;
  cardTexts[0].innerHTML = outfit.outerwear.item_description;
  //Shirt
  cardColors[1].style.background = outfit.shirt.item_color;
  cardTitles[1].innerHTML = outfit.shirt.item_name;
  cardSubtitles[1].innerHTML =
    outfit.shirt.item_type + " | " + outfit.shirt.item_subtype;
  cardTexts[1].innerHTML = outfit.shirt.item_description;
  //Pant
  cardColors[2].style.background = outfit.pants.item_color;
  cardTitles[2].innerHTML = outfit.pants.item_name;
  cardSubtitles[2].innerHTML =
    outfit.pants.item_type + " | " + outfit.pants.item_subtype;
  cardTexts[2].innerHTML = outfit.pants.item_description;
  //Shoes
  cardColors[3].style.background = outfit.shoes.item_color;
  cardTitles[3].innerHTML = outfit.shoes.item_name;
  cardSubtitles[3].innerHTML =
    outfit.shoes.item_type + " | " + outfit.shoes.item_subtype;
  cardTexts[3].innerHTML = outfit.shoes.item_description;

  //Show the display wrapper
  document.querySelector("#display-wrapper").style.display = "block";
};

//Clear an outfit from a given day
clearOutfitButton.addEventListener("click", () => {
  //Remove event indicator, hide display, remove outfit and date from database
  selectedDay.classList.remove("event-indicator");
  selectedDay.removeAttribute("generatedOutfit");
  document.getElementById("display-wrapper").style.display = "none";
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/clear-day");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  let date = selectedDay.dataset.date;
  xhr.send(
    JSON.stringify({
      date,
      email,
    })
  );
});

//Close overlay
closeOutfitButton.addEventListener("click", () => {
  eventOverlay.style.display = "none";
});

//Paste Outfit
pasteOutfitButton.addEventListener("click", () => {
  let outfit = JSON.parse(localStorage.getItem("savedOutfit"));
  console.log(outfit);
  fillCards(outfit);
  selectedDay.classList.add("event-indicator");
  //Now that the clicked date has an outfit associated with it,
  //Send the date and outfit to the database
  let newDate = selectedDay.dataset.date;
  let newOutfit = selectedDay.getAttribute("generatedOutfit");
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/add-day");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(
    JSON.stringify({
      newDate,
      newOutfit,
      email,
    })
  );
  document.querySelector("#clear-outfit").style.display = "inline-block";
});

//Render calendar
renderWeekdaysHeader();
renderCalendar(currentMonth, currentYear);
