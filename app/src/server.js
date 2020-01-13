const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = '5000';
const swagger = require('swagger-ui-express');
const swaggerDocument = require('../public/swagger.json');
const yaml = require('js-yaml');

const showExplorer = false;
const swaggerOptions = { validatorUrl: null };
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  '/api/swagger-ui',
  swagger.serve,
  swagger.setup(swaggerDocument, showExplorer, swaggerOptions)
);

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}!`);
});
