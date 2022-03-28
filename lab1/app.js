const express = require('express');
const data = require('./data');
const blogFunctions = data.blogs;

const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true
    })
);

app.use("*", (req, res, next) => {
    if (req.session.user) {
        console.log(
            `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl
            } (Authenticated User)`
        );
    } else {
        console.log(
            `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl
            } (Non-Authenticated User)`
        );
    }
    next();
});

app.post('/blog', async (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(400).json("Not logged in")
    }
});

app.put('/blog/:id', async (req, res, next) => {
    let blog;
    try{
         blog = await blogFunctions.get(req.params.id);
    }
    catch(e){
         res.status(500).json(e)
         return
    }
    if (req.session.user) {
        if(req.session.user._id !== blog.userThatPosted._id.toString()){
             res.status(400).json("Not logged in as user who made post")
             return
        }
        next();
    } else {
        res.status(400).json("Not logged in")
    }
});

app.patch('/blog/:id', async (req, res, next) => {
    let blog;
    try{
         blog = await blogFunctions.get(req.params.id);
    }
    catch(e){
         res.status(500).json(e)
         return
    }
    if (req.session.user) {
        if(req.session.user._id !== blog.userThatPosted._id.toString()){
             res.status(400).json("Not logged in as user who made post")
             return
        }
        next();
    } else {
        res.status(400).json("Not logged in")
    }
});

app.post('/blog/:id/comments', async (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(400).json("Not logged in")
    }
});

app.delete('/blog/:blogId/:commentId', async (req, res, next) => {
    let blog;
    try{
         blog = await blogFunctions.get(req.params.blogId);
    }
    catch(e){
         res.status(500).json(e)
         return
    }
    let fixedArr = blog.comments
    let index = 0;
    for(let comment of fixedArr){
        if(comment._id.toString() === req.params.commentId){
            break;
        }
        index++;
    }
    if (req.session.user) {
        if(req.session.user._id !== blog.comments[index].userThatPostedComment._id.toString()){
             res.status(400).json("Not logged in as user who made post")
             return
        }
        next();
    } else {
        res.status(400).json("Not logged in")
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});


//Test other users fucking with it