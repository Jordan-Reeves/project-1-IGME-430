const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// requestHandler = function to call once body is built
const parseBody = (request, response, requestHandler) => {
  const body = [];

  // error recieved
  request.on('error', () => {
    // console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // a data chunk recieved
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // all data recieved
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString(); // buffer is simiple data type like an array
    const bodyParams = query.parse(bodyString);
    // var1=value11&var2=value2 data format that query wants, default for HTML forms
    // could also send JSON and use JSON.parse
    return requestHandler(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/client.html') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsersMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
