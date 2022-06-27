const Router = require("express-promise-router")
let router = new Router();
var fs = require('fs-extra');
var path = require("path")
router.get('/',(req,res,next) => {
    let filename = req.query.SOLINE;
    
    var filePath = `D:/${filename}.pdf`;
    var newpath = `D:/Zero/client/public/${filename}.pdf`
    fs.copyFile(filePath, newpath, function (err) {
        if (err) throw err;

        res.status(200).json({
            code : 200,
            mess : "Upload thành công",
            fileName : filename
        })
      });
   
    
   
})
function delay(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
 }
router.get('/delete',async(req,res,next) => {
    await delay(5000);
    let fileName = req.query.SOLINE;
    fs.unlinkSync(`D:/Zero/client/public/${fileName}.pdf`);
    res.status(200).json({
        code : 200,
        mess : "DELETE thành công",
        fileName : fileName
    })
})
module.exports = router;
