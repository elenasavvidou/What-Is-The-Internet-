var spicedPg = require ('spiced-pg');
var db = spicedPg(`postgres:postgres:postgres:psql@localhost:5432/images`);
const config = require("./config.json");

const secret = require("./secrets.json");
const s3 = require("./config.json");

exports.getRecentImages = function () {
    return db.query(`SELECT * FROM images;`).then(function(results) {
        console.log("get recent images", results.rows);
        return results.rows;
    }).catch((err)=>{
        console.log("getRecentImages error", err);
    });
};

exports.userImageToDatabase = function (image,username,title,description) {
    const query = ('INSERT INTO images (image, username, title, description) VALUES ($1,$2,$3,$4) RETURNING id');
    const params = [image, username, title, description];

    return db.query (query, params)
    .then((results) => {

    })
    .catch((err) => {
        console.log("error in userImageToDatabase:", err);
    })
}

exports.getImagesUrlFromDatabase = function (images) {
    const params = [images]
    const query = ('SELECT * FROM images')
    return db.query (query, params).catch((err) => {
        console.log("error images URL", err);
    })
}

exports.getSingleImageInfo = function (imageId){
    const params = [imageId]
    const query =  ('SELECT * FROM images WHERE id = $1')
    return db.query (query, params).catch((err) => {
        console.log("error in singleImage URL:", err);
    })
}

exports.getCommentsOnImages = function (imageId) {
    const params = [imageId]
    const query = ('SELECT * FROM comments WHERE imageId = $1' )
    return db.query (query, params).catch((err)=> {
        console.log("error in getCommentsOnImages:", err);
    })
}

exports.postCommentsOnImages = function (imageId, author, comment) {
    const params = [imageId, author, comment]
    const query = ('INSERT INTO comments (imageId, author, comment) VALUES ($1,$2,$3)')
    return db.query (query, params).catch((err)=> {
        console.log("error in postCommentsOnImages:", err);
    })
}
