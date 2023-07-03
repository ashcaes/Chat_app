const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const ash = addUser({
  id: 24,
  username: "ahmed",
  room: "sweet texas",
});

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// const nice = addUser({
//   id: "sa4f8e9q4f65ds189e4q89489qe4f8q9e",
//   username: "ahmed alshareef ",
//   room: "sweet texas",
// });

// const demo = addUser({
//   id: "4s8a4f8r9e15d6sa84f8da489",
//   username: "leo messi",
//   room: "sweet texas",
// });
const removed = removeUser(24);

// console.log(users);
// console.log(removed);

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// const sam = getUser("sa4f8e9q4f65ds189e4q89489qe4f8q9e");

// console.log(sam)

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

const usersInSweetTexas = getUsersInRoom("sweet texas");

// console.log(usersInSweetTexas);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
