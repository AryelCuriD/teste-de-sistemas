const { pool } = require('../config/db');

const getMetrics = async () => {
  const [[totalRow]] = await pool.query('SELECT COUNT(*) as total FROM mock_data');
  const [recentRows] = await pool.query(
    'SELECT id, data, created_at FROM mock_data ORDER BY created_at DESC LIMIT 5'
  );

  const [dailyRows] = await pool.query(
    `SELECT DATE(created_at) as day, COUNT(*) as total
     FROM mock_data
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY day
     ORDER BY day ASC`
  );

  return {
    total: totalRow.total,
    recent: recentRows,
    daily: dailyRows
  };
};

module.exports = {
  getMetrics
};
