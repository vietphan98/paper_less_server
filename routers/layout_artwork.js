const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();
var formidable = require('formidable');
var fs = require('fs');
var moment = require('moment');
const pdf2base64 = require('pdf-to-base64');

router.post('/InsertData',async (req,res,next) => {
    try {
        let processCode = req.body.PROCESS_CODE;
        let jobID = req.body.ID_JOB;
        let NTID = req.body.NTID;
        let hole = req.body.HOLE;
        let jagged = req.body.JAGGED;
        let corner = req.body.CORNER;
        let width = req.body.WIDTH;
        let length = req.body.LENGTH;
        let IMG = req.body.IMG;
     
        let query = `INSERT INTO zero_paper_less_system.report_layout_artwork(ID_JOB,PROCESS_CODE,USERNAME,HOLE,CORNER,JAGGED,WIDTH,LENGTH,IMG)
         VALUES('${jobID}','${processCode}','${NTID}','${hole}','${corner}','${jagged}','${width}','${length}','${IMG}')`
        const result =  await db.query(query);
        if(result.rowCount > 0){
                  res.status(200).json({
                      code : 200,
                      mess : "INSERT THANH CONG",
                      output : true
                  })
       }
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502 ,
            mess : "Hệ thống service bị lỗi !"
        })
    }
})


router.get('/GetHistory',async (req,res,next) => {
    try {
        let processCode = req.query.PROCESS_CODE;
        let jobID = req.query.ID_JOB;
     
        let query = `SELECT ID,ID_JOB,PROCESS_CODE,USERNAME,HOLE,CORNER,JAGGED,WIDTH,LENGTH,IMG,CREATEDDATE FROM zero_paper_less_system.report_layout_artwork WHERE ID_JOB = '${jobID}' AND PROCESS_CODE = '${processCode}'`
        const result =  await db.query(query);
        if(result.rowCount > 0){
                res.status(200).json({
                    code : 200,
                    output : result.rows
            }) 
        } else 
            res.status(200).json({
                code : 200,
                output : result.rows
            })
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502 ,
            mess : "Hệ thống service bị lỗi !"
        })
    }
})


router.get('/GetData', async (req,res,next) => {
    let id_job = req.query.ID_JOB;
    let route = req.query.ROUTE;
    try {
        
         let progressDB = await mysql.miQuery("SELECT CODE_PROCESS, VN_NAME, UNIT FROM avery_rfid.ht_item_progress WHERE CODE_PROCESS='" + route + "'");
         let GetData = await mysql.miQuery(`SELECT ID, SOLINE, JOBJACKET, SOLINE, QTY, ITEM, REQUEST_DATE, PROMISE_DATE, GPM, RBO, CUSTOMER_ITEM, CREATED_DATE, UPS FROM avery_rfid.ht_order_list WHERE JOBJACKET = '${id_job}'`)
         let urlPath;
         if(GetData){
             let soline = GetData[0].SOLINE ;
             let result_url = await db.query(`SELECT url FROM zero_paper_less_system.prepress_upload WHERE soline = '${soline}' AND typedocument = 'ARTWORK' AND active = 1 ORDER BY id desc LIMIT 1`)
             if(result_url.rowCount > 0){
                urlPath = Buffer.from(result_url.rows[0].url);
                // var data =fs.readFileSync(`${result_url.rows[0].url}`);
                // res.contentType("application/pdf");
                // res.send(data);
                // // return(res.status(200).json({
                // //     code : 200 ,
                // //     mess : "Read tahnh cong",
                // //     url : "https://zeros.asia:5656/api/ReadPdfPrepressArtwork/show_file"
                // // }))
             }else{
                 res.status(201).json({
                     code : 201,
                     output : progressDB,
                     mess : `Not find ${soline} in db prepress_upload`,
                     jobjacket: GetData
                 })
             }
         }else{
            
         }

        res.status(200).json({
            code : 200 , 
            output : progressDB,
            urlPath : urlPath.toString('base64'),
            jobjacket: GetData
        });
            
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})

router.post('/UploadImage', async (req,res,next) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.webcam.filepath;
      var nameFile = "LayoutArtwork_" + moment().format('yyyyMMDDHHmmss') + ".jpg";
      var newpath = 'D:/Zero/client/public/img/' + nameFile;
      fs.copyFile(oldpath, newpath, function (err) {
        if (err) throw err;

        res.status(200).json({
            code : 200,
            mess : "Upload thành công",
            fileName : nameFile
        })

        // res.write('File uploaded and moved!');
        // res.end();
      });
    });
})



router.get('/test', async (req,res,next) => {
    express.static('file:////D://test.pdf')
})




module.exports = router;