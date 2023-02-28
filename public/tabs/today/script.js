let w = JSON.parse(localStorage.getItem("weatherObject"));

function gwO() {
  console.log(w);

  fetch(
    `http://localhost:8080/weather?data=` +
      encodeURIComponent(JSON.stringify(w))
  )
    .then((response) => response.text())
    .then((data) => {
      let item_name = "";
      let item_type = "";
      let tokens = data.split("\n");
      let tableHTML = `<table class="styled-table"><thead><tr><th>Item Name</th><th>Item Type</th></tr></thead><tbody>`;
      let tableContainer = document.getElementById("table-container");
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

        //console.log(item);
      });
      tableHTML += `</tbody></table>`;
      tableContainer.innerHTML = tableHTML;
    })
    .catch((error) => console.error(error));
}

function generateOutfit(weatherObject) {}
