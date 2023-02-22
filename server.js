//Set up express to run html,css, and js on localhost
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

//port we want to run on
const app = express();
const port = 3000;

//This tells express to run everything in the 'public' folder..which is the whole interface
app.use(express.static("public"));

//idk what this does
app.use(bodyParser.json());

//This creates an end-point called 'get-all' that returns everything in the closet table
app.get("/get-all", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "wardrobe",
  });
  client.connect();
  client.query("SELECT * FROM closet", (err, result) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send("Error fetching data from the database");
    } else {
      //Whoever calls this endpoint gets the results of the table returned in json format
      res.send(result.rows);
    }
  });
});

//This creates an end-point called 'add-item' that adds an item to the closet table
app.post("/add-item", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "wardrobe",
  });
  client.connect();
  const query = `
    INSERT INTO  closet (item_name, item_type)
    VALUES ($1, $2)
  `;
  const values = [req.body.itemName, req.body.itemType];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to add item to the database");
    } else {
      res.status(200).send("Item added to the database");
    }

    client.end();
  });
});

//Lets you know youre successfully running on the localhost
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
