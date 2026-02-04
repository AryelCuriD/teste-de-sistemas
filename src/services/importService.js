const { parse } = require('csv-parse/sync');
const { pool } = require('../config/db');

const MAX_PREVIEW_ROWS = 10000;

const parseCsv = (buffer) => {
  const content = buffer.toString('utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
};

const parseJson = (buffer) => {
  const content = buffer.toString('utf-8');
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error('O JSON deve ser um array de objetos.');
  }
  return data;
};

const normalizeRecords = (records) => {
  if (records.length > MAX_PREVIEW_ROWS) {
    return records.slice(0, MAX_PREVIEW_ROWS);
  }
  return records;
};

const importFile = async (file) => {
  const extension = file.originalname.split('.').pop().toLowerCase();
  let records = [];

  if (extension === 'csv') {
    records = parseCsv(file.buffer);
  } else if (extension === 'json') {
    records = parseJson(file.buffer);
  } else {
    const error = new Error('Formato inválido. Envie CSV ou JSON.');
    error.status = 400;
    throw error;
  }

  if (!records.length) {
    const error = new Error('Nenhum dado encontrado no arquivo.');
    error.status = 400;
    throw error;
  }

  const cleanedRecords = normalizeRecords(records);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const insertSql = 'INSERT INTO mock_data (data) VALUES (?)';
    for (const record of cleanedRecords) {
      await connection.query(insertSql, [JSON.stringify(record)]);
    }
    await connection.commit();
    return { inserted: cleanedRecords.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  importFile
};
