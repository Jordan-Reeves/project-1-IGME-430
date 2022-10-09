const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const collection = fs.readFileSync(`${__dirname}/../client/collection.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const notFound = fs.readFileSync(`${__dirname}/../client/notFound.html`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCollection = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(collection);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getNotFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(notFound);
  response.end();
};

module.exports = {
  getIndex,
  getCollection,
  getCSS,
  getNotFound,
};
