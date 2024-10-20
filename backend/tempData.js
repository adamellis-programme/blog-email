const passwordBannedList = [
  { id: 1, text: 'password' },
  { id: 1, text: 'secret' },
  { id: 2, text: '123' },
  { id: 2, text: '12345' },
  { id: 2, text: '123456' },
  { id: 3, text: 'admin' },
  { id: 4, text: '111111' },
  { id: 5, text: '000000' },
  { id: 6, text: 'Admin123' },
  { id: 7, text: 'user' },
  { id: 8, text: 'abc123' },
  { id: 9, text: 'qwerty123' },
  { id: 10, text: '121212' },
]

// super admin page that let's us place emails on the banned list
// -- this can be placed in the admin page but conditionaly rendered
// -- adn checked on the server

// make email banned form and loggin / register check
module.exports = passwordBannedList
