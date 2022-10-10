const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const addBooksPage = fs.readFileSync(`${__dirname}/../client/addBooksPage.html`);
const yourCollection = fs.readFileSync(`${__dirname}/../client/yourCollection.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const notFound = fs.readFileSync(`${__dirname}/../client/notFound.html`);
const communityCollections = fs.readFileSync(`${__dirname}/../client/communityCollections.html`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getAddBooksPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(addBooksPage);
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

const getYourCollection = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(yourCollection);
  response.end();
};
const getCommunityCollections = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(communityCollections);
  response.end();
};

module.exports = {
  getIndex,
  getAddBooksPage,
  getCSS,
  getNotFound,
  getYourCollection,
  getCommunityCollections,
};
