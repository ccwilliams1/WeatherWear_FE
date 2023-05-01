//Set up express to run html,css, and js on localhost
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const { Client } = require("pg");

//port we want to run on
const app = express();
const listening_port = 3000;

//This tells express to run everything in the 'public' folder..which is the whole interface
app.use(express.static("public"));

//idk what this does
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();

  const { name, email, password } = req.body;
  //const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.query(
      "INSERT INTO user_data (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    res.status(201).send({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user." });
  }
});

app.post("/login", async (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();

  const { email, password } = req.body;
  try {
    const result = await client.query(
      "SELECT id, password, name FROM user_data WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (user && password === user.password) {
      //req.session.userId = user.id;
      res.send({ success: true, name: user.name, email: email });
    } else {
      res
        .status(401)
        .send({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Error during login." });
  }
  client.end();
});

//This creates an end-point called 'get-all' that returns everything in the closet table
app.post("/get-all", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  let query =
    "SELECT * FROM closet WHERE user_email = $1 ORDER BY CASE item_type WHEN 'Outerwear' THEN 1 WHEN 'Shirt' THEN 2 WHEN 'Pants' THEN 3 WHEN 'Shoes' THEN 4 ELSE 5 END,item_name;";
  let values = [req.body.userEmail];
  client.query(query, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send("Error fetching data from the database");
    } else {
      //Whoever calls this endpoint gets the results of the table returned in json format
      res.send(result.rows);
    }
  });
});

app.post("/get-item", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  let query =
    "SELECT *, encode(image_file, 'base64') as base64_image FROM closet WHERE wardrobeid = $1";
  let values = [req.body.id];
  client.query(query, values, (err, result) => {
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
app.post("/add-item", upload.single("imageFile"), (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  //This is the connection to the wardrobe database within postgres
  client.connect();
  const query = `
    INSERT INTO  closet (item_name, item_type, item_subtype, item_description, item_size, item_color, item_material, dress_style, user_email, image_file)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;
  const values = [
    req.body.name,
    req.body.type,
    req.body.subtype,
    req.body.description,
    req.body.size,
    req.body.color,
    req.body.material,
    req.body.dressStyles,
    req.body.userEmail,
    req.file && req.file.buffer,
  ];

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

//This creates an end-point called 'delete-item' that deletes an item from the closet table
app.post("/delete-item", (req, res) => {
  // This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  const query = "DELETE FROM closet WHERE wardrobeid = $1";
  const id = req.body.id;

  client.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to add item to the database");
    } else {
      res.status(200).send("Item removed from the database");
    }

    client.end();
  });
});

//This creates an end-point called 'edit-item' that edits an item in the closet table
app.post("/edit-item", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  console.log(req.body.id);
  const query =
    "UPDATE closet SET item_name = $1, item_type = $2, item_subtype = $3, item_description = $4, item_size = $5, item_color = $6, item_material = $7, dress_style = $8 WHERE wardrobeid = $9";
  const values = [
    req.body.name,
    req.body.type,
    req.body.subtype,
    req.body.description,
    req.body.size,
    req.body.color,
    req.body.material,
    req.body.dressStyles,
    req.body.id,
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to edit item in the database");
    } else {
      res.status(200).send("Item edited in the database");
    }

    client.end();
  });
});

//This creates an end-point called 'days' that associates an outfit with a given date
app.post("/add-day", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  const query = `
  INSERT INTO days (date, outfit, user_email)
  VALUES ($1, $2, $3)
  ON CONFLICT (date)
  DO UPDATE SET outfit = EXCLUDED.outfit;
`;
  const values = [req.body.newDate, req.body.newOutfit, req.body.email];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to add date to database");
    } else {
      res.status(200).send("Date added to database");
    }

    client.end();
  });
});

//This creates an end-point called 'get-days' that returns all the day rows in the day table
app.post("/get-days", (req, res) => {
  //This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  let query = "SELECT * FROM days WHERE user_email = $1";
  let values = [req.body.email];
  client.query(query, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send("Error fetching data from the database");
    } else {
      //Whoever calls this endpoint gets the results of the table returned in json format
      res.send(result.rows);
    }
  });
});

//This creates an end-point called 'clear-day' that deletes a day and outfit from the days table
app.post("/clear-day", (req, res) => {
  // This is the connection to the wardrobe database within postgres
  const client = new Client({
    user: "postgres",
    password: "password",
    host: "postgres-temp.cqqqmuimitus.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres",
  });
  client.connect();
  const query = "DELETE FROM days WHERE date = $1 AND user_email = $2";
  const values = [req.body.date, req.body.email];
  console.log(values);

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to clear date from database");
    } else {
      res.status(200).send("Cleared date from database");
    }

    client.end();
  });
});

//Lets you know youre successfully running on the localhost
app.listen(listening_port, () => {
  console.log(`Server listening at http://localhost:${listening_port}`);
});
