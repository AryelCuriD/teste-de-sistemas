const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDatabase() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS mock_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      data JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const connection = await pool.getConnection();
  try {
    await connection.query(createTableSql);
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  initDatabase
};
