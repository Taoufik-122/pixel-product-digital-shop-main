import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost", // Replace with your MySQL host
  user: "your_username", // Replace with your MySQL username
  password: "your_password", // Replace with your MySQL password
  database: "digital", // Replace with your database name
});

export default pool;