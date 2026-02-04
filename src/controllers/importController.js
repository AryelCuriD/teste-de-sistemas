const importService = require('../services/importService');

const handleImport = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }

    const mode = req.body.mode || 'import';
    const result = await importService.importFile(file, mode);

    if (mode === 'sql') {
      res.setHeader('Content-Disposition', 'attachment; filename="mock_data_import.sql"');
      return res.type('text/plain').send(result.sql);
    }

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
