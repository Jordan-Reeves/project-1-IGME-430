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

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and Age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // update or no content, should send no body

  if (!users[body.name]) {
    responseCode = 201; // now making a user
    users[body.name] = {};
  }

  // works for update or creating
  // bc we know a user exists
  users[body.name].name = body.name;
  users[body.name].age = body.age;

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

module.exports = {
  getUsers,
  addUser,
  getUsersMeta,
  notFound,
  notFoundMeta,
};
