const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();
var formidable = require('formidable');
var fs = require('fs');
var moment = require('moment');
const pdf2base64 = require('pdf-to-base64');


router.get('/', async (req,res,next) => {
    let url = req.query.URL;
    let urlPath = Buffer.from(url, 'base64');


    fs.readFile(urlPath.toString() , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
})



module.exports = router;