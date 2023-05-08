/* MY WARDROBE SCRIPT */
let addItemForm;
let editItemForm;
let clickedId = 0;

//When the Add Item to Closet Button is pressed
const handleAdd = () => {
  //Hide the buttons and show the form
  document.getElementById("wardrobe-buttons").style.display = "none";
  addItemForm = document.querySelector("#add-item-form");
  addItemForm.style.display = "block";
  // const uploadImage = document.getElementById("uploadImage");
  // const uploadImageEdit = document.getElementById("uploadImageEdit");
  // const removeImage = document.getElementById("removeImage");
  // const removeImageEdit = document.getElementById("removeImageEdit");

  // const preview = document.getElementById("preview");
  const previewEdit = document.getElementById("preview");

  // let imageFile = null;
  populateSubType("type-add", "subtype-add");

  // //Listener for image upload
  uploadImage.addEventListener("change", function (event) {
    //Grab file from users computer
    imageFile = event.target.files[0];
    console.log(imageFile);

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        //Set src of image to image
        preview.src = e.target.result;
        preview.style.display = "block";
        removeImage.disabled = false;
      };
      reader.readAsDataURL(imageFile);
    } else {
      preview.style.display = "none";
      removeImage.disabled = true;
    }
  });

  // //Listener for remove image
  removeImage.addEventListener("click", function () {
    preview.src = "";
    preview.style.display = "none";
    uploadImage.value = "";
    removeImage.disabled = true;
  });

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

    let formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("subtype", subtype);
    formData.append("size", size);
    formData.append("description", description);
    formData.append("dressStyles", JSON.stringify(dressStyles));
    formData.append("color", color);
    formData.append("material", material);
    formData.append("userEmail", userEmail);
    let imageFileInput = document.getElementById("uploadImage");
    if (imageFileInput.files.length > 0) {
      formData.append("imageFile", imageFileInput.files[0]);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/add-item");
    //xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(formData);
    // xhr.send(
    //   JSON.stringify({
    //     name,
    //     type,
    //     subtype,
    //     size,
    //     description,
    //     dressStyles,
    //     color,
    //     material,
    //     userEmail,
    //   })
    // );
  });
};

const handleUpload = () => {};

//When the Edit Item button is pressed
const handleEdit = (event, id) => {
  console.log(event);
  clickedId = id;
  //Make form visible
  editItemForm = document.querySelector("#edit-item-form");
  editItemForm.style.display = "block";
  //Get current scroll position
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  //Set form position to current scroll position
  editItemForm.style.top = `${scrollY + windowHeight / 4}px`;
  editItemForm.style.left = "50%";
  editItemForm.style.transform = "translateX(-50%)";
  //Lock scroll
  document.body.style.overflow = "hidden";
  //Make overlay visible
  document.getElementById("overlay").style.display = "block";

  // When the form cancel button is pressed
  document.querySelector("#cancel").addEventListener("click", () => {
    //Hide form
    editItemForm.style.display = "none";
    previewEdit.style.display = "none";
    //Unlock Scroll
    document.body.style.overflow = "auto";
    //Hide overlay
    document.getElementById("overlay").style.display = "none";
  });

  //console.log(id, clickedId);

  document.querySelector("#delete").addEventListener("click", () => {
    handleDelete(event, clickedId);
    console.log("Deleted ", id);
    //Hide form
    editItemForm.style.display = "none";
    //Unlock Scroll
    document.body.style.overflow = "auto";
    //Hide overlay
    document.getElementById("overlay").style.display = "none";
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

      if (data[0].base64_image) {
        const base64Image = data[0].base64_image;
        previewEdit.src = `data:image/jpeg;base64,${base64Image}`;
        previewEdit.style.display = "block";
        // editItemForm.style.top = "0px";
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        editItemForm.style.top = `${scrollY + windowHeight / 11}px`;
        document.body.style.overflow = "visible";
        //Set form position to current scroll position
        previewEdit.style.top = `${scrollY + windowHeight / 1.75}px`;
        previewEdit.style.left = "50%";
        previewEdit.style.transform = "translateX(-50%)";
      }

      // if (data[0].image_file) {
      //   const blob = data[0].image_file;
      //   console.log(blob);
      //   const imageURL = URL.createObjectURL(blob);
      //   previewEdit.src = imageURL;
      //   previewEdit.src = e.target.result;
      //   previewEdit.style.display = "block";
      //   removeImageEdit.disabled = false;
      // } else {
      //   previewEdit.style.display = "none";
      //   removeImageEdit.disabled = true;
      // }
    });

  document.querySelector("#submit").addEventListener("click", () => {});
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
  let searchBar = document.getElementById("searchBar");
  let searchContainer = document.getElementById("search-container");
  searchContainer.style.display = "block";
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
      let previousType = "";
      let index = 0;
      let wardrobeGrid = `<div class="container"><div class="row d-flex justify-content-center">`;
      data.forEach((item) => {
        if (index !== 0 && previousType !== item.item_type) {
          wardrobeGrid +=
            '</div><hr><div class="row d-flex justify-content-center">'; // You can replace <hr> with <br> if you prefer
          index = 0;
        }

        if (index % 5 === 0 && index !== 0) {
          wardrobeGrid +=
            '</div><div class="row d-flex justify-content-center">';
        }
        wardrobeGrid += ` <div class="col-md-2">
                 <div class="card" style="margin: 10px 0px" onclick = "handleEdit(event, ${item.wardrobeid})">
          <div class="card-color" style="background-color: ${item.item_color}; height: 15px" > </div>
          <div class="card-body" style = "height: 200px">
            <h5 class="card-title">${item.item_name}</h5>
            <p class="card-subtitle">${item.item_type} | ${item.item_subtype}</p>
            <p class="card-text">${item.item_description}</p>
          </div>
          </div>
          </div>`;
        index += 1;
        previousType = item.item_type;
      });

      wardrobeGrid += "</div></div>";
      document.getElementById("wardrobe-table").innerHTML = wardrobeGrid;
    })
    .then(() => {
      let cards = document.querySelectorAll(".card");
      searchBar.addEventListener("input", () => {
        if (!searchBar.value) {
          cards.forEach((card) => {
            card.style.display = "block";
          });
        }

        if (searchBar.value.length > 1) {
          cards.forEach((card, index) => {
            const h5 = card.querySelector("h5");
            console.log(h5.textContent, searchBar.value);
            if (
              !h5.textContent
                .toLowerCase()
                .includes(searchBar.value.toLowerCase())
            ) {
              cards[index].style.display = "none";
            }
          });
        }
      });
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
    Shoes: [
      "Dress shoes",
      "Sandals",
      "Slippers",
      "Rain Boots",
      "Sneakers",
      "Stylish Boots",
      "Winter Boots",
    ],
    Outerwear: [
      "Blazer",
      "Bomber jacket",
      "Cardigan",
      "Denim jacket",
      "Leather jacket",
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
