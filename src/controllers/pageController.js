const path = require('path');

const renderHome = (req, res) => {
  res.render('home', { title: 'Mockaroo DB Tester' });
};

const renderImport = (req, res) => {
  res.render('import', { title: 'Importar Dados' });
};

const renderRecords = (req, res) => {
  res.render('records', { title: 'Registros' });
};

const renderDashboard = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};

const renderNotFound = (req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
};

module.exports = {
  renderHome,
  renderImport,
  renderRecords,
  renderDashboard,
  renderNotFound
};
