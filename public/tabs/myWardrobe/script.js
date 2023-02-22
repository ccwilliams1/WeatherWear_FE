/* MY WARDROBE SCRIPT */
let addItemForm;

//When the Add Item to Closet Button is pressed
const handleAdd = () => {
  //Hide the buttons and show the form
  document.getElementById("wardrobe-buttons").style.display = "none";
  addItemForm = document.querySelector("#add-item-form");
  addItemForm.style.display = "block";

  // Handle form submit
  addItemForm.addEventListener("submit", (event) => {
    // console.log(event.target["item-name"].value);
    // console.log(event.target["item-type"].value);

    event.preventDefault();
    const itemName = event.target["item-name"].value;
    const itemType = event.target["item-type"].value;

    // Send form data to the database
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/add-item");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ itemName, itemType }));
  });
};

//When view my closet is pressed
const handleView = () => {
  document.getElementById("wardrobe-buttons").style.display = "none";
  // Send a GET request to the server and handle the response
  fetch("/get-all")
    .then((response) => response.json())
    .then((data) => {
      // Build HTML table from response
      let tableHtml = "<table>";
      tableHtml += "<tr><th>ID</th><th>Name</th><th>Type</th></tr>";
      data.forEach((item) => {
        tableHtml += `<tr><td>${item.id}</td><td>${item.item_name}</td><td>${item.item_type}</td></tr>`;
      });
      tableHtml += "</table>";

      //Update the page with the table
      document.getElementById("wardrobe-table").innerHTML = tableHtml;
    })
    .catch((error) => console.error(error));
};
