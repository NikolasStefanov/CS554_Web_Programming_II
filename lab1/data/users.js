var bcrypt = require('bcrypt')
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const saltRounds = 16;

async function createUser(name, username, password) {
    if (!name) {
        throw "No Name"
    }
    if (!/^[A-Za-z\s]*$/.test(name)) {
        throw "Name - Invalid Characters"
    }
    if (!username) {
        throw "No Username"
    }
    if (/[^A-Za-z0-9]/g.test(username)) {
        throw "Username - Invalid Characters"
    }
    if (username.length < 4) {
        throw "Username - Invalid Length"
    }
    username = username.toLowerCase()

    if (!password) {
        throw "No Password"
    }
    if (password.indexOf(' ') >= 0) {
        throw "Password - Contains Spaces"
    }
    if (password.length < 6) {
        throw "Password - Invalid Length"
    }
    //Real Function
    const hash = await bcrypt.hash(password, saltRounds);
    let newUser = {
        name: name,
        username: username,
        password: hash
    };
    const userCollection = await users();
    const userInfo = await userCollection.insertOne(newUser);
    if (userInfo.insertedCount === 0) {
        throw 'Could not add user';
    }
    return { userInserted: true }
}

async function checkUser(username, password) {
    if (!username) {
        throw "No Username"
    }
    if (/[^A-Za-z0-9]/g.test(username)) {
        throw "Username - Invalid Characters"
    }
    if (username.length < 4) {
        throw "Username - Invalid Length"
    }
    username = username.toLowerCase()

    if (!password) {
        throw "No Password"
    }
    if (password.indexOf(' ') >= 0) {
        throw "Password - Contains Spaces"
    }
    if (password.length < 6) {
        throw "Password - Invalid Length"
    }
    //Real Function
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) {
        throw "Either the username or password is invalid"
    }
    let match = await bcrypt.compare(password, user.password);
    if (match === true) {
        return { authenticated: true }
    }
    else {
        throw "Either the username or password is invalid"
    }
}

async function get(username) {
    if (!username) {
        throw "No Username"
    }
    if (/[^A-Za-z0-9]/g.test(username)) {
        throw "Username - Invalid Characters"
    }
    if (username.length < 4) {
        throw "Username - Invalid Length"
    }
    username = username.toLowerCase()

    //Real Function
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) {
        throw "DNE"
    }
    return user;
}

module.exports = {
    createUser,
    checkUser,
    get
}