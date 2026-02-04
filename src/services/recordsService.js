const { pool } = require('../config/db');

const getRecords = async ({ page, limit, q }) => {
  const offset = (page - 1) * limit;
  const params = [];
  let whereClause = '';

  if (q) {
    whereClause = 'WHERE CAST(data AS CHAR) LIKE ?';
    params.push(`%${q}%`);
  }

  const [countRows] = await pool.query(
    `SELECT COUNT(*) as total FROM mock_data ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT id, data, created_at FROM mock_data ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    page,
    limit,
    total: countRows[0].total,
    records: rows.map((row) => ({
      id: row.id,
      data: row.data,
      created_at: row.created_at
    }))
  };
};

const getRecordById = async (id) => {
  const [rows] = await pool.query('SELECT id, data, created_at FROM mock_data WHERE id = ?', [id]);
  return rows[0] || null;
};

module.exports = {
  getRecords,
  getRecordById
};
