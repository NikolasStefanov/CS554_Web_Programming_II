const data = require('../data');
const userFunctions = data.users;
const blogFunctions = data.blogs;
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const constructorMethod = (app) => {
    app.get('/blog', async (req, res) => {
        let skip = 0
        let take = 20
        if(req.query.skip){
            skip = req.query.skip
        }
        if(req.query.take){
            take = req.query.take
        }
        if(typeof parseInt(skip) !== 'number' || isNaN(parseInt(skip)) || parseInt(skip) < 0){
            res.status(400).json("Bad Skip")
            return
        }
        if(typeof parseInt(take) !== 'number' || isNaN(parseInt(take)) || parseInt(take) < 0){
            res.status(400).json("Bad Take")
            return
        }
        let blogList; 
        try{
            blogList = await blogFunctions.getAll()
        }
        catch(e){
            res.status(400).json("Error")
        }
        let retList = blogList.slice(parseInt(skip), parseInt(skip)+parseInt(take))
        res.status(200).json(retList)
    });

    app.get('/blog/logout', async (req, res) => {
        req.session.destroy();
        res.status(200).json("You have been logged out")
    });

    app.get('/blog/:id', async (req, res) => {  
        let id = req.params.id
        if (!id && id !== 0) {
            res.status(400).json("No Input");
            return;
        }
        if (typeof id !== 'string') {
            res.status(400).json("Not a string");
            return;
        }
        id = id.trim()
        if (id === "") {
            res.status(400).json("Whitespace");
            return;
        }
        let blogInfo;
        try{
            blogInfo = await blogFunctions.get(id) 
        }
        catch(e){
            res.status(400).json("Bad id")
            return
        }
        let user = {
            _id:blogInfo.userThatPosted._id,
            username: blogInfo.userThatPosted.username
        }
        res.status(200).json({
            _id: blogInfo._id,
            title: blogInfo.title,
            body: blogInfo.body,
            userThatPosted: user,
            comments: blogInfo.comments
        })
    });

    app.post('/blog', async (req, res) => {
        let userID = req.session.user._id
        let username = req.session.user.username
        let formData = req.body
        if(!formData.title){
            res.status(400).json("No title")
            return
        }
        let title = formData.title
        if(!formData.body){
            res.status(400).json("No body")
            return
        }
        let body = formData.body
        let blog;
        try {
            blog = await blogFunctions.createBlog(userID, username, title, body)
        }
        catch (e) {
            res.status(500).json("Error Creation")
            return
        }

        res.status(200).json(blog)
    })

    app.put('/blog/:id', async (req, res) => {
        let formData = req.body
        if(!formData.title){
            res.status(400).json("No title")
            return
        }
        let title = formData.title
        if(!formData.body){
            res.status(400).json("No body")
            return
        }
        let body = formData.body
        let blog;
        try {
            blog = await blogFunctions.updateBlog(req.params.id, title, false, body, false)
        }
        catch (e) {
            res.status(500).json(e)
            return
        }

        res.status(200).json(blog)
    })

    app.patch('/blog/:id', async (req, res) => {
        let formData = req.body
        let noTitle = false
        if(!formData.title){
            noTitle = true
        }
        let title = formData.title
        let noBody = false
        if(!formData.body){
            noBody = true
        }
        let body = formData.body
        let blog;
        try {
            blog = await blogFunctions.updateBlog(req.params.id, title, noTitle, body, noBody)
        }
        catch (e) {
            res.status(500).json("Error update")
            return
        }

        res.status(200).json(blog)
    })

    app.post('/blog/:id/comments', async (req, res) => {
        let formData = req.body
        if(!formData.comment){
            res.status(400).json("No comment")
            return
        }
        let blog;
        try {
            blog = await blogFunctions.addComment(req.params.id, req.session.user.username, req.session.user._id, formData.comment)
        }
        catch (e) {
            res.status(500).json("Error adding")
            return
        }
        res.status(200).json(blog)
    })

    app.delete('/blog/:blogId/:commentId', async (req, res) => {
        let blog;
        try {
            blog = await blogFunctions.deleteComment(req.params.blogId, req.params.commentId)
        }
        catch (e) {
            res.status(500).json(e)
            return
        }
        res.status(200).json(blog)
    })

    app.post('/blog/signup', async (req, res) => {
        let formData = req.body
        if (!formData.name) {
            res.status(400).json("No name")
            return
        }
        let name = formData.name
        if (!/^[A-Za-z\s]*$/.test(name)) {
            res.status(400).json("Bad Name")
            return
        }
        if (!formData.username) {
            res.status(400).json("No username")
            return
        }
        let username = formData.username
        if (/[^A-Za-z0-9]/g.test(username)) {
            res.status(400).json("Bad username")
            return
        }
        if (username.length < 4) {
            res.status(400).json("Bad username")
            return
        }
        username = username.toLowerCase()
    
        if (!formData.password) {
            res.status(400).json("No Password")
            return
        }
        let password = formData.password
        if (password.indexOf(' ') >= 0) {
            res.status(400).json("Bad password")
            return
        }
        if (password.length < 6) {
            res.status(400).json("Bad password")
            return
        }
        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });
        if (user !== null) {
            //user already exists
            res.status(400).json("User found")
            return
        }
        let goodUser;
        try {
            goodUser = await userFunctions.createUser(name, username, password)
        }
        catch (e) {
            res.status(500).json("Error creation")
            return
        }
        if (goodUser.userInserted === true) {
            let userInfo;
            try{
                userInfo = await userFunctions.get(username)
            }
            catch(e){
                res.status(400).json("Error get")
            }
            res.status(200).json(
                {
                    _id: userInfo._id,
                    "name": userInfo.name,
                    "username": userInfo.username,
                    "password": userInfo.password
                }
            )
        }
        else {
            res.status(500).json("Error occurred")
        }
    })

    app.post('/blog/login', async (req, res) => {
        let formData = req.body
        if (!formData.username) {
            res.status(400).json("No username")
            return
        }
        let username = formData.username
        if (/[^A-Za-z0-9]/g.test(username)) {
            res.status(400).json("Bad username")
            return
        }
        if (username.length < 4) {
            res.status(400).json("Bad username")
            return
        }
        username = username.toLowerCase()

        if (!formData.password) {
            res.status(400).json("No password")
            return
        }
        let password = formData.password
        if (password.indexOf(' ') >= 0) {
            res.status(400).json("Bad password")
            return
        }
        if (password.length < 6) {
            res.status(400).json("Bad password")
            return
        }

        let goodUser;
        try {
            goodUser = await userFunctions.checkUser(username, password)
        }
        catch (e) {
            res.status(500).json("No user found")
            return
        }

        if (goodUser.authenticated) {
            let userInfo;
            try{
                userInfo = await userFunctions.get(username)
            }
            catch(e){
                res.status(400).json("Error get")
            }
            req.session.user = { _id: userInfo._id, username: username };
            res.status(200).json(
                {
                    _id: userInfo._id,
                    "name": userInfo.name,
                    "username": userInfo.username,
                    "password": userInfo.password
                }
            )
        }
        else {
            res.status(500).json("Error occurred")
        }
    });

    app.use('*', (req, res) => {
        res.status(404).json("Not Found")
    });
};

module.exports = constructorMethod;
