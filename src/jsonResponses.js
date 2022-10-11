// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

// const filterBooks = (filter, filterVal, username) => {
//   if(filterVal){
//     let filteredBooks = [];
//     users[username].books.forEach(book => {
//       if(book[filter] === filterVal){
//         filteredBooks.push(book);
//       }
//     });
//     return filteredBooks;
//   }
// };

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
  return respondJSON(request, response, 200, responseJSON);
};
const getUsersMeta = (request, response) => {
  // return 200 without message, just the meta data
  respondJSONMeta(request, response, 200);
};

const getBooks = (request, response, params) => {
  const responseJSON = {
    message: 'User has no books.',
  };

  // if the user has no books or a username isn't given
  if (!params.username || !users[params.username]) {
    return respondJSON(request, response, 400, responseJSON, 'application/json');
  }

  responseJSON.message = 'You have successfully viewed your books';
  responseJSON.username = params.username;
  responseJSON.books = users[params.username].books;

  // Attempt at filtering results
  // if(params.author){
  //   let filteredBooks = [];
  //   users[params.username].books.forEach(book => {
  //     if(book.author === params.author){
  //       filteredBooks.push(book);
  //     }
  //   });
  //   responseJSON.books=filteredBooks;
  //   return respondJSON(request, response, 200, responseJSON, 'application/json');
  // }
  // if(params.title){
  //   responseJSON.books = filterBooks("title", params.title, params.username);
  // }
  // if(params.author){
  //   responseJSON.books = filterBooks("author", params.author, params.username);
  // }

  console.log(responseJSON);
  return respondJSON(request, response, 200, responseJSON, 'application/json');
};
// function for 404 not found without message
const getBooksMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

const addBook = (request, response, body) => {
  const responseJSON = {
    message: 'Title is required.',
  };

  if (!body.username || !body.title) {
    responseJSON.id = 'addUserMissingParam';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201; // created

  if (!users[body.username]) {
    users[body.username] = {
      books: [],
    };
  }

  const oldBooks = users[body.username].books;
  const newBook = {
    title: body.title,
    author: body.author, // ? body.author : 'Not provided',
    bookStatus: body.bookStatus,
    notes: body.notes,
    rating: body.rating,
    imageURL: body.imageURL ? body.imageURL : 'https://via.placeholder.com/200x300',

  };

  const bookExists = oldBooks.find((book) => book.title === newBook.title);
  if (bookExists) {
    responseCode = 204; // updated
    bookExists.author = newBook.author;
    bookExists.bookStatus = newBook.bookStatus;
    bookExists.notes = newBook.notes;
    bookExists.rating = newBook.rating;
    bookExists.imageURL = newBook.imageURL;
  } else {
    users[body.username].books = [
      ...oldBooks,
      newBook,
    ];
  }

  // user created
  if (responseCode === 201) {
    responseJSON.message = 'Book created/added successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // user updated/no content: responseCode = 204, no body
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

module.exports = {
  getUsers,
  getUsersMeta,
  getBooks,
  getBooksMeta,
  addBook,
  notFound,
  notFoundMeta,
};
