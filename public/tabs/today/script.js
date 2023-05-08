let w = JSON.parse(localStorage.getItem("weatherObject"));
let userEmail = localStorage.getItem("email");
let currentOutfit;
/* Listen for click of User Style */
document.addEventListener("DOMContentLoaded", function () {
  const formalityWrapper = document.getElementById("formality-wrapper");
  const cards = formalityWrapper.querySelectorAll(".card");

  //Get which style was clicked, add it to the weather object.
  //Dissapear the div and make the display cards appear
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      w.style = card.querySelector(".card-title").textContent;
      w.userEmail = userEmail;
      console.log(w);
      document.querySelector("#formality-wrapper").style.display = "none";
      // document.querySelector("three-btn-container").style.display = "none";

      // document.querySelector("#display-wrapper").style.display = "block";
      document.querySelector("#display-wrapper").style.visibility = "hidden";
      document.getElementById("loader").style.display = "block";
      generateOutfit();
      document.querySelector("#display-wrapper").style.display = "block";
      document.querySelector("#three-btn-container").style.display = "block";
    });
  });
});

async function generateOutfit() {
  let x = [];
  console.log(w);
  try {
    const response = await fetch(
      `http://100.26.157.97:8080/weather?data=` +
        encodeURIComponent(JSON.stringify(w))
    );
    const eclipse_data = await response.json();
    const size = Object.keys(eclipse_data).length;
    let itemIndex = 0;
    fillCards(eclipse_data, itemIndex);
    //console.log(eclipse_data);

    document.getElementById("prev").addEventListener("click", () => {
      itemIndex > 0 ? (itemIndex -= 1) : (itemIndex = size - 1);
      fillCards(eclipse_data, itemIndex);
    });
    document.getElementById("save").addEventListener("click", () => {
      localStorage.setItem("savedOutfit", JSON.stringify(currentOutfit));
      console.log(JSON.parse(localStorage.getItem("outfit")));
    });
    document.getElementById("next").addEventListener("click", () => {
      itemIndex < size - 1 ? (itemIndex += 1) : (itemIndex = 0);
      console.log(itemIndex);
      console.log(eclipse_data[itemIndex]);
      fillCards(eclipse_data, itemIndex);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const fillCards = (eclipse_data, itemIndex) => {
  //Get all the pieces of the card element
  let displayWrapper = document.getElementById("display-wrapper");
  let cardColors = displayWrapper.querySelectorAll(".card-color");
  let cardTitles = displayWrapper.querySelectorAll(".card-title");
  let cardSubtitles = displayWrapper.querySelectorAll(".card-subtitle");
  let cardTexts = displayWrapper.querySelectorAll(".card-text");
  let outfit = eclipse_data[itemIndex];
  currentOutfit = outfit;
  console.log(outfit);

  //Populate the card with information
  Object.entries(outfit).forEach(([key, value], garmentIndex) => {
    if (garmentIndex != 4) {
      cardTitles[garmentIndex].setAttribute("id", value.wardrobeid);
      cardColors[garmentIndex].style.background = value.item_color;
      cardTitles[garmentIndex].innerHTML = value.item_name;
      cardSubtitles[garmentIndex].innerHTML =
        value.item_type + " | " + value.item_subtype;
      cardTexts[garmentIndex].innerHTML = value.item_description;
    }
  });

  document.getElementById("loader").style.display = "none";
  document.querySelector("#display-wrapper").style.visibility = "visible";

  console.log(eclipse_data);
};

//If the garment has an image associated with it, display that image on click
const imageOverlay = document.getElementById("imageOverlay");
const previewImage = document.getElementById("previewImage");
const displayWrapper = document.getElementById("display-wrapper");
const cards = displayWrapper.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", function () {
    id = card.querySelector(".card-title").getAttribute("id");

    fetch("/get-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data[0].base64_image) {
          imageOverlay.style.display = "block";
          const base64Image = data[0].base64_image;
          previewImage.src = `data:image/jpeg;base64,${base64Image}`;
          previewImage.style.display = "block";
          previewImage.style.top = "25%";
          imageOverlay.addEventListener("click", () => {
            imageOverlay.style.display = "none";
            previewImage.style.display = "none";
          });
        }
      });
  });
});
