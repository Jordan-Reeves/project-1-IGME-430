// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
  // return 200 without message, just the meta data
  respondJSONMeta(request, response, 200);
};

const addBook = (request, response, body) => {
  const responseJSON = {
    message: 'Username is required.',
  };

  if (!body.username) {
    responseJSON.id = 'addUserMissingParam';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // update or no content, should send no body

  if (!users[body.username]) {
    responseCode = 201; // making a new user
    users[body.username] = {
      books:[],
    };
  }

  const oldBooks = users[body.username].books;
  const newBook = {
    title: body.title,
    author:body.author,
    bookStatus:body.bookStatus,
  }

  const bookExists = oldBooks.find(book => book.title == newBook.title);
  if(bookExists){
    bookExists.author = newBook.author;
    bookExists.bookStatus = newBook.bookStatus;
  }
  else{
    users[body.username].books = [
      ...oldBooks,
      newBook,
    ];
  }

  // user created
  if (responseCode === 201) {
    responseJSON.message = 'Created successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // user updated/no content: responseCode = 204
  return respondJSONMeta(request, response, responseCode);
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

const getBooks = (request, response, params) => {
  const responseJSON ={
    message:'Missing username query parameter',
  }

  // if the request does not contain a username=__ query parameter or the username isn't in the users
  if (!params.username) {
    //const resTextString = JSON.stringify(responseJSON.message);
    return respondJSON(request, response, 401, responseJSON, 'application/json');
  }

  responseJSON.message = 'You have successfully viewed your books';
  responseJSON.username = params.username;
  responseJSON.books = users[params.username].books;

  //const resTextString = JSON.stringify(responseJSON.message);
  console.log(responseJSON);
  return respondJSON(request, response, 200, responseJSON, 'application/json');
};



module.exports = {
  getUsers,
  addBook,
  getUsersMeta,
  notFound,
  notFoundMeta,
  getBooks,
};
