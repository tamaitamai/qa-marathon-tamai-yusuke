const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3511;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3511", // PostgreSQLのユーザー名に置き換えてください
  host: "localhost",
  database: "crm_3511", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_3511", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//企業idから情報を抜き出す
app.post("/customerById", async (req, res) => {  
  try {
    const { customerId } = req.body;      
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id=$1"
    ,[customerId]);
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//企業idから情報を抜き出す
app.post("/deleteCustomer", async (req, res) => {  
  try {
    const { customerId } = req.body;      
    const customerData = await pool.query("DELETE FROM customers WHERE customer_id=$1;"
    ,[customerId]);    
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post("/add-customer", async (req, res) => {
  try {    
    const { companyName, industry, contact, location } = req.body;    
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));
