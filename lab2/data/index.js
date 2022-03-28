let dummyData = require('./dummyData.json')

async function getById(id){
    if (!id && id !== 0) {
        throw "No Input"
    }
    if (typeof id !== 'string') {
        throw "Not a string"
    
    }
    id = id.trim()
    if (id === "") {
        throw "Whitespace"
    }
    if(isNaN(parseInt(id)) || typeof parseInt(id) !== 'number'){
        throw "Not a number"
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            for(let obj of dummyData){
                if(obj.id === parseInt(id)){
                    resolve(obj)
                }
            }
            reject(new Error("something went wrong"));
        }, 5000);
    });
}

module.exports = {
    getById
};