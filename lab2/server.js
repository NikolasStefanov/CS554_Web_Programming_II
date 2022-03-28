const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
let data = require('./data')
const flat = require('flat');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.get('/api/people/history', async (req, res, next) => {
    let cache = await client.lrangeAsync("History", 0, 19);
    if (cache.length !== 0) {
        let goodCache = [];
        for(let result of cache){
            if(result !== "null"){
                goodCache.push(JSON.parse(result))
            }
        }
        res.send(goodCache)
    } 
    else {
        res.json("Nothing in Cache")
    }
});

app.get('/api/people/:id', async (req, res, next) => {
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
    if(isNaN(parseInt(id)) || typeof parseInt(id) !== 'number'){
        res.status(400).json("Not a number");
        return;
    }
    let cacheForIdExists;
    try{
        cacheForIdExists = await client.hgetallAsync(id);
    }
    catch(e){
        res.status(500).json(e)
    }
    if (cacheForIdExists) {
      cacheForIdExists.id = parseInt(cacheForIdExists.id)
      await client.lpushAsync("History", JSON.stringify(cacheForIdExists));
      res.send(cacheForIdExists);
    } else {
      next();
    }
  });
  
app.get('/api/people/:id', async (req, res) => {
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
    if(isNaN(parseInt(id)) || typeof parseInt(id) !== 'number'){
        res.status(400).json("Not a number");
        return;
    }
    let userInfo;
    try{
        userInfo = await data.getById(id)
    }
    catch(e){
        res.status(404).json("Id not found");
        return;
    }
    if(userInfo === "Bad Data"){
        res.status(400).json("User not in Data")
        return
    }
    await client.lpushAsync("History", JSON.stringify(userInfo));
    res.json(userInfo);
    let flatInfo = flat(userInfo);
    await client.hmsetAsync(
      userInfo.id,
      flatInfo
    );
  });

app.use('*', (req, res) => {
    res.status(404).json("Not Found")
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
