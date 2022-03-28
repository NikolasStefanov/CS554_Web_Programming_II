const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
var ObjectId = require('mongodb').ObjectId;

async function getAll(){
    const blogCollection = await blogs();
    const blogList = await blogCollection.find({}).toArray();
    return blogList;
}

async function createBlog(id, username, title, body) {
    let newID = ObjectId(id)
    let user = {
        _id: newID,
        username: username
    }
    let newBlog = {
        title: title,
        body: body,
        userThatPosted: user,
        comments: []

    };
    const blogCollection = await blogs();
    const blogInfo = await blogCollection.insertOne(newBlog);
    if (blogInfo.insertedCount === 0) {
        throw 'Could not add blog';
    }
    return newBlog
}

async function addComment(id, username, userid, comment) {
    if (!id && id !== 0) {
        throw 'No Input'
    }
    if (typeof id !== 'string') {
        throw 'Not a string' 
    }
    id = id.trim()
    if (id === "") {
        throw 'Whitespace'
    }
    let parsedId = ""
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        parsedId = ObjectId(id)
    }
    else {
        throw "Invalid ID"
    }
    if (!userid && userid !== 0) {
        throw 'No Input'
    }
    if (typeof userid !== 'string') {
        throw 'Not a string' 
    }
    userid = userid.trim()
    if (userid === "") {
        throw 'Whitespace'
    }
    let parsedUserId = ""
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        parsedUserId = ObjectId(userid)
    }
    else {
        throw "Invalid ID"
    }
    if(!comment){
        throw "No comment"
    }
    if(!username){
        throw "No username"
    }
    let user = {
        _id: parsedUserId,
        username: username
    }
    let newComment = {
        _id: new ObjectId(),
        userThatPostedComment: user,
        comment: comment

    };
    const blogCollection = await blogs();
    const blog = await blogCollection.findOne({ _id: parsedId });
    if (blog === null) throw 'Error: No blog with that id';
    let fixedArr = blog.comments
    fixedArr.push(newComment)
    const updatedBlog = {
        _id: parsedId,
        title: blog.title,
        body: blog.body,
        userThatPosted: blog.userThatPosted,
        comments: fixedArr
    };
    const updatedInfo = await blogCollection.replaceOne(
        { _id: parsedId },
        updatedBlog
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Error: Could not update blog successfully';
    }
    return updatedBlog
}

async function deleteComment(id, commentID) {
    if (!id && id !== 0) {
        throw 'No Input'
    }
    if (typeof id !== 'string') {
        throw 'Not a string' 
    }
    id = id.trim()
    if (id === "") {
        throw 'Whitespace'
    }
    let parsedId = ""
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        parsedId = ObjectId(id)
    }
    else {
        throw "Invalid ID"
    }
    if (!commentID && commentID !== 0) {
        throw 'No Input'
    }
    if (typeof commentID !== 'string') {
        throw 'Not a string' 
    }
    commentID = commentID.trim()
    if (commentID === "") {
        throw 'Whitespace'
    }
    const blogCollection = await blogs();
    const blog = await blogCollection.findOne({ _id: parsedId });
    if (blog === null) throw 'Error: No blog with that id';
    let fixedArr = blog.comments
    let index = 0;
    for(let comment of fixedArr){
        if(comment._id.toString() === commentID){
            fixedArr.splice(index, 1);
        }
        index++;
    }
    const updatedBlog = {
        _id: parsedId,
        title: blog.title,
        body: blog.body,
        userThatPosted: blog.userThatPosted,
        comments: fixedArr
    };
    const updatedInfo = await blogCollection.replaceOne(
        { _id: parsedId },
        updatedBlog
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Error: Could not update blog successfully';
    }
    return updatedBlog
}

async function get(id) {
    //Error Check
    if (!id && id !== 0) {
        throw 'No Input'
    }
    if (typeof id !== 'string') {
        throw  'Not a string'
    }
    id = id.trim()
    if (id === "") {
        throw 'Whitespace' 
    }
    let parsedId = ""
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        parsedId = ObjectId(id)
    }
    else {
        throw 'Invalid ID' 
    }
    //Real Function
    const blogCollection = await blogs();
    const blog = await blogCollection.findOne({ _id: parsedId });
    if (blog === null) throw 'Error: No blog with that id';
    return blog;
}

async function updateBlog(id, title, noTitle, body, noBody){
    if (!id && id !== 0) {
        throw 'No Input'
    }
    if (typeof id !== 'string') {
        throw 'Not a string' 
    }
    id = id.trim()
    if (id === "") {
        throw 'Whitespace'
    }
    let parsedId = ""
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        parsedId = ObjectId(id)
    }
    else {
        throw "Invalid ID"
    }
    const blogCollection = await blogs();
    const blog = await blogCollection.findOne({ _id: parsedId });
    if(noTitle){
        title = blog.title
    }
    if(noBody){
        body = blog.body
    }
    if (blog === null) {
        throw 'Error: No blog with that id'
    }
    const updatedBlog = {
        _id: parsedId,
        title: title,
        body: body,
        userThatPosted: blog.userThatPosted,
        comments: blog.comments
    };
    const updatedInfo = await blogCollection.replaceOne(
        { _id: parsedId },
        updatedBlog
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Error: Could not update blog successfully';
    }
    return updatedBlog
}

module.exports = {
    getAll,
    createBlog,
    addComment,
    get,
    updateBlog,
    deleteComment
}
