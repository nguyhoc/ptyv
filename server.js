const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

app.use('/public', express.static(path.join(ROOT_DIR, 'public')));
app.use('/src', express.static(path.join(ROOT_DIR, 'src')));
app.use('/vendor/three', express.static(path.join(ROOT_DIR, 'node_modules', 'three', 'build')));
app.use('/wed1', express.static(path.join(ROOT_DIR, 'public', 'wed1')));
app.use('/wed2', express.static(path.join(ROOT_DIR, 'public', 'wed2')));
app.use('/wed3', express.static(path.join(ROOT_DIR, 'public', 'wed3')));

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

const sendHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

app.get('/health', sendHealth);
app.get('/api/health', sendHealth);

app.get('/api/content', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'src', 'data', 'content.json'));
});

const sendHomepage = (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'wed3', 'index.html'));
};

const sendBirthdayPage = (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'views', 'index.html'));
};

app.get('/', sendHomepage);
app.get('/birthday', sendBirthdayPage);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found.',
    path: req.originalUrl
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Tulip Letter Garden running at http://localhost:' + PORT);
  });
}

module.exports = app;
