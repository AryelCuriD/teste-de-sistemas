const importService = require('../services/importService');

const handleImport = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }

    const result = await importService.importFile(file);
    return res.json({
      message: 'Importação concluída com sucesso!',
      inserted: result.inserted
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  handleImport
};
