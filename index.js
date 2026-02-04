require('dotenv').config();

const express = require('express');
const path = require('path');
const pagesRoutes = require('./src/routes/pages');
const apiRoutes = require('./src/routes/api');
const pageController = require('./src/controllers/pageController');
const { initDatabase } = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', pagesRoutes);
app.use('/api', apiRoutes);

app.use(pageController.renderNotFound);

app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor.';
  if (req.originalUrl.startsWith('/api')) {
    return res.status(status).json({ message });
  }
  return res.status(status).render('error', { title: 'Erro', message });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar banco:', error);
    process.exit(1);
  });
