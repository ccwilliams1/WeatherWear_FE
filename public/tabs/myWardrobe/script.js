/* MY WARDROBE SCRIPT */
let addItemForm;
let editItemForm;

//When the Add Item to Closet Button is pressed
const handleAdd = () => {
  //Hide the buttons and show the form
  document.getElementById("wardrobe-buttons").style.display = "none";
  addItemForm = document.querySelector("#add-item-form");
  addItemForm.style.display = "block";
  populateSubType("type-add", "subtype-add");

  // Handle form submit
  addItemForm.addEventListener("submit", (event) => {
    //Keeps page from refreshing
    event.preventDefault();
    //Pull all field values and strore them in variables
    const formElements = event.target.elements;
    const name = formElements.name.value;
    const type = formElements.type.value;
    const subtype = formElements.subtype.value;
    const size = formElements.size.value;
    const description = formElements.description.value;
    const color = formElements.color.value;
    const material = formElements.material.value;
    const dressStyleCheckboxes = formElements["dress_style"];
    const dressStyles = Array.from(dressStyleCheckboxes)
      .filter(function (checkbox) {
        return checkbox.checked;
      })
      .map(function (checkbox) {
        return checkbox.value;
      })
      .join(", ");

    // Send form data to the database
    let userEmail = localStorage.getItem("email");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/add-item");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(
      JSON.stringify({
        name,
        type,
        subtype,
        size,
        description,
        dressStyles,
        color,
        material,
        userEmail,
      })
    );
  });
};

//When the Edit Item button is pressed
const handleEdit = (event, id) => {
  editItemForm = document.querySelector("#edit-item-form");
  editItemForm.style.display = "block";

  // When the form cancel button is pressed
  document.querySelector("#cancel").addEventListener("click", () => {
    console.log("click");
    editItemForm.style.display = "none";
  });

  //Retrieve the item contents from the database
  fetch("/get-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      //Fill the form in with the contents from the database
      editItemForm.elements.name.value = data[0].item_name;
      editItemForm.elements.type.value = data[0].item_type;
      populateSubType("type-edit", "subtype-edit");
      editItemForm.elements.subtype.value = data[0].item_subtype;
      editItemForm.elements.size.value = data[0].item_size;
      editItemForm.elements.description.value = data[0].item_description;
      editItemForm.elements.color.value = data[0].item_color;
      editItemForm.elements.material.value = data[0].item_material;
      let checkboxes = Array.from(editItemForm.elements.dress_style);
      checkboxes.forEach((checkbox) => {
        data[0].dress_style.includes(checkbox.value)
          ? (checkbox.checked = true)
          : (checkbox.checked = false);
      });
    });

  //When the form submit button is pressed
  editItemForm.addEventListener("submit", (event) => {
    //Prevent page from refreshing
    event.preventDefault();
    const formElements = event.target.elements;
    const name = formElements.name.value;
    const type = formElements.type.value;
    const subtype = formElements.subtype.value;
    const size = formElements.size.value;
    const description = formElements.description.value;
    const color = formElements.color.value;
    const material = formElements.material.value;
    const dressStyleCheckboxes = formElements["dress_style"];
    const dressStyles = Array.from(dressStyleCheckboxes)
      .filter(function (checkbox) {
        return checkbox.checked;
      })
      .map(function (checkbox) {
        return checkbox.value;
      })
      .join(", ");

    // Send form data to the database
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/edit-item");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(color);
    xhr.send(
      JSON.stringify({
        name,
        type,
        subtype,
        size,
        description,
        dressStyles,
        color,
        material,
        id,
      })
    );
  });
};

//When the delete button is pressed
const handleDelete = (event, id) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/delete-item");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  console.log(id);
  xhr.send(JSON.stringify({ id }));

  handleView();
};

//When view my closet is pressed
const handleView = () => {
  document.getElementById("wardrobe-buttons").style.display = "none";
  let userEmail = localStorage.getItem("email");

  // Send a GET request to the server and handle the response
  fetch("/get-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Build HTML table from response
      let tableHtml = "<table>";
      tableHtml += "<tr><th>Name</th><th>Type</th></tr>";
      data.forEach((item) => {
        tableHtml += `<tr><td>${item.item_name}</td><td>${item.item_type}</td><td><btn class="edit-btn" onclick="handleEdit(event,${item.wardrobeid})">Edit</btn></td><td><btn class="delete-btn" onclick="handleDelete(event, ${item.wardrobeid})">Delete</btn></td></tr>`;
      });
      tableHtml += "</table>";
      //Update the page with the table
      document.getElementById("wardrobe-table").innerHTML = tableHtml;
    })
    .catch((error) => console.error(error));
};

const populateSubType = (typeField, subtypeField) => {
  /*Populate Subcategory Dropdown*/
  const typeSelect = document.getElementById(typeField);
  const subtypeSelect = document.getElementById(subtypeField);
  const subtypeNames = {
    Shirt: [
      "Button-down shirt",
      "Dress shirt",
      "Hoodie",
      "Long-sleeve",
      "Polo shirt",
      "Sweater",
      "Sweatshirt",
      "Tank top",
      "T-shirt",
    ],
    Pants: [
      "Cargo pants",
      "Chinos",
      "Dress pants",
      "Jeans",
      "Joggers",
      "Khakis",
      "Shorts",
      "Slacks",
      "Sweatpants",
    ],
    Shoes: ["Boots", "Dress shoes", "Sandals", "Slippers", "Sneakers"],
    Outerwear: [
      "Blazer",
      "Bomber jacket",
      "Cardigan",
      "Denim jacket",
      "Leather jacket",
      "Overcoat",
      "Parka",
      "Pea coat",
      "Puffer jacket",
      "Raincoat",
      "Trench coat",
      "Vest",
      "Windbreaker",
    ],
  };
  const selectedType = typeSelect.value;
  subtypeSelect.innerHTML = ""; // Clear previous options

  if (selectedType !== "") {
    const subtypeOptions = subtypeNames[selectedType];

    for (let i = 0; i < subtypeOptions.length; i++) {
      const option = document.createElement("option");
      option.value = subtypeOptions[i];
      option.textContent = subtypeOptions[i];
      subtypeSelect.appendChild(option);
    }
  }

  //Listen for change of type dropdown to know what to populate subtype dropdown with
  typeSelect.addEventListener("change", function () {
    const selectedType = typeSelect.value;
    subtypeSelect.innerHTML = ""; // Clear previous options

    if (selectedType !== "") {
      const subtypeOptions = subtypeNames[selectedType];

      for (let i = 0; i < subtypeOptions.length; i++) {
        const option = document.createElement("option");
        option.value = subtypeOptions[i];
        option.textContent = subtypeOptions[i];
        subtypeSelect.appendChild(option);
      }
    }
  });
  /**/
};
