const recordsService = require('../services/recordsService');

const listRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = '' } = req.query;
    const result = await recordsService.getRecords({
      page: Number(page),
      limit: Number(limit),
      q: q.trim()
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const getRecordDetail = async (req, res, next) => {
  try {
    const record = await recordsService.getRecordById(Number(req.params.id));
    if (!record) {
      return res.status(404).json({ message: 'Registro não encontrado.' });
    }
    return res.json(record);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listRecords,
  getRecordDetail
};
