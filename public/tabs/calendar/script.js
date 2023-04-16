//Retrieve DOM elements and assign them variables
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventOverlay = document.getElementById("event-overlay");
const eventDate = document.getElementById("event-date");
const addOutfitButton = document.getElementById("add-outfit");
const clearOutfitButton = document.getElementById("clear-outfit");
const closeOutfitButton = document.getElementById("close-outfit");
const weatherData = JSON.parse(localStorage.getItem("weatherData"));
let weatherObject;
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
function renderCalendar(month, year) {
  calendar.innerHTML = "";
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
      day.style.backgroundColor = "#ED9AA2";
    }

    //What to do when a day box is clicked
    day.addEventListener("click", () => {
      //Make the event overlay visible
      eventOverlay.style.display = "block";
      //Show the date for whatever day you clicked
      eventDate.textContent = `Date: ${day.dataset.date}`;
      selectedDay = day;

      //Determine if the selected day is within one week of the current day
      const differenceInDays = Math.ceil(
        (Date.parse(day.dataset.date) - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      //Hide weather container by default
      document.querySelector("#weather-container").style.display = "none";
      //If the two days are within a week apart, populate the event dialog with weather data for that given day
      if (differenceInDays >= 0 && differenceInDays <= 6) {
        document.querySelector("#weather-container").style.display = "block";
        const forecastedDay =
          weatherData.forecast.forecastday[differenceInDays].day;
        console.log(forecastedDay);
        document.querySelector(".high").innerHTML =
          "High: " + forecastedDay.maxtemp_f;
        document.querySelector(".low").innerHTML =
          "Low: " + forecastedDay.mintemp_f;
        document.querySelector(".weather-image").src =
          forecastedDay.condition.icon;
        document.querySelector(".condition").innerHTML =
          forecastedDay.condition.text;

        //If specific day has already generated a weather object, show that, otherwise hide the table
        if (!day.dataset.outfit) {
          document.getElementById("event-table").classList.add("hidden");
        } else {
          document.getElementById("event-table").classList.remove("hidden");
          document.getElementById("event-table").innerHTML = day.dataset.outfit;
        }

        //Create a weather object for the given day to pass to the rule engine
        weatherObject = {
          high: forecastedDay.maxtemp_f,
          low: forecastedDay.mintemp_f,
          condition: forecastedDay.condition.text,
          chance_of_rain: forecastedDay.daily_chance_of_rain,
        };
      }
    });
  }
}

//Go to previous month and update calendar
prevMonthButton.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

//Go to next month and update calendar
nextMonthButton.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

//When the Generate Outfit Button is pressed, send weather data for that particular date to rule engine and receive outfit
//Then parse outfit string into table and print table
addOutfitButton.addEventListener("click", () => {
  //Once outfit is generated, add indicator with the surprise tool from earlier
  selectedDay.classList.add("event-indicator");
  fetch(
    `http://localhost:8080/weather?data=` +
      encodeURIComponent(JSON.stringify(weatherObject))
  )
    .then((response) => response.text())
    .then((data) => {
      //Retrieve data from engine and parse
      //Parse into table and add to DOM
      let item_name = "";
      let item_type = "";
      let tokens = data.split("\n");
      let tableHTML = `<table class="event-table"><thead><tr><th>Item Name</th><th>Item Type</th></tr></thead><tbody>`;
      let tableContainer = document.getElementById("event-table");
      tokens.forEach((item) => {
        let token = item.split(" ");
        token.forEach((i) => {
          item_name = "";
          item_type = "";
          for (let i = 0; i < token.length - 1; i++) {
            item_name += token[i] + " ";
          }
          item_type = token[token.length - 1];
        });
        tableHTML += `<tr><td>${item_name}</td><td>${item_type.trim()}</td></tr>`;
      });
      tableHTML += `</tbody></table>`;
      //Populate DOM with table
      tableContainer.innerHTML = tableHTML;
      //Make table visible
      tableContainer.classList.remove("hidden");
      //Store outfit to day
      selectedDay.dataset.outfit = tableHTML;
    })
    .catch((error) => console.error(error));
});

//Clear an outfit from a given day
clearOutfitButton.addEventListener("click", () => {
  selectedDay.classList.remove("event-indicator");
  document.getElementById("event-table").classList.add("hidden");
});

//Close overlay
closeOutfitButton.addEventListener("click", () => {
  eventOverlay.style.display = "none";
});

//Render calendar
renderWeekdaysHeader();
renderCalendar(currentMonth, currentYear);
