const express = require('express');
const multer = require('multer');
const importController = require('../controllers/importController');
const recordsController = require('../controllers/recordsController');
const metricsController = require('../controllers/metricsController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.json'];
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(extension)) {
      return cb(new Error('Extensão inválida. Use CSV ou JSON.'));
    }
    return cb(null, true);
  }
});

const router = express.Router();

router.post('/import', upload.single('file'), importController.handleImport);
router.get('/records', recordsController.listRecords);
router.get('/records/:id', recordsController.getRecordDetail);
router.get('/metrics', metricsController.getMetrics);

module.exports = router;
