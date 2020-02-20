const express = require('express');
morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/', function (req, res) {
  res.send('Welcome to the Dreary Database!');
});
app.get('/movies', function (req, res) {
  res.json([]);
});

app.listen(8080);