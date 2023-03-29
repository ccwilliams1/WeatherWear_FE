/* MY WARDROBE SCRIPT */
let addItemForm;
let editItemForm;

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

const handleEdit = (event, id) => {
  console.log("Edit");
  console.log(event);
  editItemForm = document.querySelector("#edit-item-form");
  editItemForm.style.display = "block";

  // Handle form submit
  document.querySelector("#cancel").addEventListener("click", () => {
    editItemForm.display == "block"
      ? (editItemForm.display = "none")
      : (editItemForm.display = "block");
  });
  editItemForm.addEventListener("submit", (e) => {
    // console.log(event.target["item-name"].value);
    // console.log(event.target["item-type"].value);

    e.preventDefault();
    const itemName = e.target["item-name"].value;
    const itemType = e.target["item-type"].value;

    // Send form data to the database
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/edit-item");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ itemName, itemType, id }));
    document.getElementById("wardrobe-table").innerHTML = "";
    handleView();
  });
};

const handleDelete = (event, id) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/delete-item");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id }));

  handleView();

  console.log("Delete");
};

//You're gonna make sure that the ID is transferred, then you're gonna pull it, then you're gonna pass it into the onclicks
//Then when you make your SQL query you refer by ID instead of item_name

//When view my closet is pressed
const handleView = () => {
  document.getElementById("wardrobe-buttons").style.display = "none";
  // Send a GET request to the server and handle the response
  fetch("/get-all")
    .then((response) => response.json())
    .then((data) => {
      // Build HTML table from response
      let tableHtml = "<table>";
      tableHtml += "<tr><th>Name</th><th>Type</th></tr>";
      data.forEach((item) => {
        itemType =
          item.item_type[0].toUpperCase() +
          item.item_type.substring(1, item.item_type.length);
        tableHtml += `<tr><td>${item.item_name}</td><td>${itemType}</td><td><btn class="edit-btn" onclick="handleEdit(event,${item.id})">Edit</btn></td><td><btn class="delete-btn" onclick="handleDelete(event, ${item.id})">Delete</btn></td></tr>`;
      });
      tableHtml += "</table>";

      //Update the page with the table
      document.getElementById("wardrobe-table").innerHTML = tableHtml;
    })
    .catch((error) => console.error(error));
};
