let w = JSON.parse(localStorage.getItem("weatherObject"));
let userEmail = localStorage.getItem("email");

/* Listen for click of User Style */
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  //Get which style was clicked, add it to the weather object.
  //Dissapear the div and make the display cards appear
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      w.style = card.querySelector(".card-title").textContent;
      w.userEmail = userEmail;
      console.log(w);
      document.querySelector("#formality-wrapper").style.display = "none";
      // document.querySelector("#display-wrapper").style.display = "block";
      document.querySelector("#display-wrapper").style.visibility = "hidden";
      generateOutfit();
      document.querySelector("#display-wrapper").style.visibility = "visible";
      document.querySelector("#display-wrapper").style.display = "block";
    });
  });
});

async function generateOutfit() {
  //Get all the pieces of the card element
  let displayWrapper = document.getElementById("display-wrapper");
  let cardColors = displayWrapper.querySelectorAll(".card-color");
  let cardTitles = displayWrapper.querySelectorAll(".card-title");
  let cardSubtitles = displayWrapper.querySelectorAll(".card-subtitle");
  let cardTexts = displayWrapper.querySelectorAll(".card-text");
  let x = [];
  console.log(w);
  try {
    const response = await fetch(
      `http://localhost:8080/weather?data=` +
        encodeURIComponent(JSON.stringify(w))
    );
    const eclipse_data = await response.text();
    console.log(eclipse_data);
    const ids_array = eclipse_data.split(",");
    ids_array.pop();
    console.log(ids_array);

    const firstValue = ids_array.shift();
    let cardIndex = 0;

    if (firstValue === "0") {
      cardTitles[cardIndex].textContent = "None";
      cardSubtitles[cardIndex].textContent = " ";
      cardTexts[cardIndex].textContent =
        "Given the weather conditions for today, wearing outerwear is not suggested";
      cardIndex++;
    }

    for (const id of ids_array) {
      const data = await fetch("/get-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      const item = await data.json();
      console.log(item[0]);

      cardColors[cardIndex].style.backgroundColor = item[0].item_color;
      cardTitles[cardIndex].innerHTML = item[0].item_name;
      cardSubtitles[cardIndex].innerHTML =
        item[0].item_type + " | " + item[0].item_subtype;
      cardTexts[cardIndex].innerHTML = item[0].item_description;
      cardIndex++;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

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
}

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
