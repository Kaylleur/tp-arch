
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const packageJson = require('../package.json');

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Monolith',
      version: packageJson.version,
    },
    host: 'localhost:3000',
    basePath: '/'
  },
  apis: ['./*.js'],
};

const openapiSpecification = swaggerJsdoc(options);
fs.writeFileSync('./swagger.json', JSON.stringify(openapiSpecification, null, 2));

// https://petstore.swagger.io/?_ga=2.20445809.837859370.1664371224-2129020600.1664371224#/Users/get_users
