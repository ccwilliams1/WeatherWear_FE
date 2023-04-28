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
  //Get all the pieces of the card element
  let x = [];
  console.log(w);
  try {
    const response = await fetch(
      `http://localhost:8080/weather?data=` +
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
      console.log("Prev");
    });
    document.getElementById("save").addEventListener("click", () => {
      console.log("Save");
      localStorage.setItem("savedOutfit", JSON.stringify(currentOutfit));
      console.log(JSON.parse(localStorage.getItem("outfit")));
    });
    document.getElementById("next").addEventListener("click", () => {
      itemIndex < size - 1 ? (itemIndex += 1) : (itemIndex = 0);
      console.log(itemIndex);
      console.log(eclipse_data[itemIndex]);
      fillCards(eclipse_data, itemIndex);
      console.log("Next");
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const fillCards = (eclipse_data, itemIndex) => {
  let displayWrapper = document.getElementById("display-wrapper");
  let cardColors = displayWrapper.querySelectorAll(".card-color");
  let cardTitles = displayWrapper.querySelectorAll(".card-title");
  let cardSubtitles = displayWrapper.querySelectorAll(".card-subtitle");
  let cardTexts = displayWrapper.querySelectorAll(".card-text");
  let outfit = eclipse_data[itemIndex];
  currentOutfit = outfit;
  console.log(outfit);

  Object.entries(outfit).forEach(([key, value], garmentIndex) => {
    if (garmentIndex != 4) {
      cardColors[garmentIndex].style.backgroundColor = value.item_color;
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

//  const eclipse_data = await response.text();
//   console.log(eclipse_data);
//   const ids_array = eclipse_data.split(",");
//   ids_array.pop();
//   console.log(ids_array);

//   const firstValue = ids_array.shift();
//   let cardIndex = 0;

//   if (firstValue === "0") {
//     cardTitles[cardIndex].textContent = "None";
//     cardSubtitles[cardIndex].textContent = " ";
//     cardTexts[cardIndex].textContent =
//       "Given the weather conditions for today, wearing outerwear is not suggested";
//     cardIndex++;
//   }

//   for (const id of ids_array) {
//     const data = await fetch("/get-item", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: id }),
//     });
//     const item = await data.json();
//     console.log(item[0]);

//     cardColors[cardIndex].style.backgroundColor = item[0].item_color;
//     cardTitles[cardIndex].innerHTML = item[0].item_name;
//     cardSubtitles[cardIndex].innerHTML =
//       item[0].item_type + " | " + item[0].item_subtype;
//     cardTexts[cardIndex].innerHTML = item[0].item_description;
//     cardIndex++;
//   }
//   document.getElementById("loader").style.display = "none";
//   document.querySelector("#display-wrapper").style.visibility = "visible";

// fetch(
//   `http://localhost:8080/weather?data=` +
//     encodeURIComponent(JSON.stringify(w))
// )
//   .then((response) => response.text())
//   .then((eclipse_data) => {
//     eclipse_data = eclipse_data.split(",");
//     eclipse_data.pop();
//     let firstElement = eclipse_data.shift();
//     let cardIndex = 0;

//     if (firstElement == "0") {
//       cardTitle[cardIndex].textContent = "None";
//       cardSubtitle[cardIndex].textContent = " ";
//       cardText[cardIndex].textContent =
//         "Given the weather conditions for today, wearing outerwear is not suggested";
//       cardIndex++;
//     }

//     const fetchClothes = eclipse_data.map((id) => {
//       fetch("/get-item", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: id }),
//       })
//         .then((response) => response.json())
//         .then((item) => {
//           console.log(cardIndex);
//           cardColor[cardIndex].style.backgroundColor = item[0].item_color;
//           cardTitle[cardIndex].innerHTML = item[0].item_name;
//           cardSubtitle[cardIndex].innerHTML =
//             item[0].item_type + " | " + item[0].item_subtype;
//           cardText[cardIndex].innerHTML = item[0].item_description;
//           cardIndex++;
//         });
//     });
//     return Promise.all(fetchClothes);
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });

//   const response1 = await fetch(
//     `http://localhost:8080/weather?data=` +
//       encodeURIComponent(JSON.stringify(w))
//   );

//   const array = await response1.text();
//   console.log(array);

//   for (let i = 0; i < cardColor.length; i++) {
//     if (array[0] == "0" || array[0] == "1") {
//       if (array[0] == "0") {

//       }
//       continue;

//     }
//   }
// }
//First retrieve result from rule engine from server

//   fetch(
//     `http://localhost:8080/weather?data=` +
//       encodeURIComponent(JSON.stringify(w))
//   )
//     .then((response) => response.text())
//     .then((eclipse_data) => {
//       eclipse_data = eclipse_data.split(",");
//       eclipse_data.pop();
//       console.log(eclipse_data);
//       eclipse_data.forEach((id, index) => {
//         //Next, loop through each element and retrieve the corresponding table row for the id
//         fetch("/get-item", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id: id }),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             if (id == "0") {
//               cardTitle[cardIndex].innerHTML = "None";
//               cardSubtitle[cardIndex].innerHTML = " ";
//               cardText[cardIndex].innerHTML =
//                 "Given the weather conditions for today, wearing outerwear is not suggested";
//             } else if (id == "1") {
//               console.log("ID is 1");
//               return;
//             }

//             console.log(data);
//             cardColor[cardIndex].style.backgroundColor = data[0].item_color;
//             cardTitle[cardIndex].innerHTML = data[0].item_name;
//             cardSubtitle[cardIndex].innerHTML =
//               data[0].item_type + " | " + data[0].item_subtype;
//             cardText[cardIndex].innerHTML = data[0].item_description;
//             cardIndex++;
//           });
//       });
//     })
//     .catch((error) => console.error(error));
// }
