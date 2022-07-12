const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();
var formidable = require('formidable');
var fs = require('fs');
var moment = require('moment');

router.post('/InsertData',async (req,res,next) => {
    try {
        let processCode = req.body.PROCESS_CODE;
        let jobID = req.body.ID_JOB;
        let NTID = req.body.NTID;
        let sku = req.body.SKU;
        let ops = req.body.OPS_CHECK;
        let qc = req.body.QC_CHECK;
        let IMG = req.body.IMG;
        let remark = req.body.REMARK;
     
        let query = `INSERT INTO zero_paper_less_system.report_layout_approval(ID_JOB,PROCESS_CODE,USERNAME,SKU,OPS_CHECK,QC_CHECK,IMG,REMARK)
         VALUES('${jobID}','${processCode}','${NTID}','${sku}','${ops}','${qc}','${IMG}','${remark}')`
        const result =  await db.query(query);
        if(result.rowCount > 0){
                  res.status(200).json({
                      code : 200,
                      mess : "INSERT THANH CONG",
                      output : true
                  })
       }
    } catch (err) {
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
     
        let query = `SELECT ID,ID_JOB,PROCESS_CODE,USERNAME,SKU,OPS_CHECK,QC_CHECK,IMG,REMARK,CREATEDDATE FROM zero_paper_less_system.report_layout_approval WHERE ID_JOB = '${jobID}' AND PROCESS_CODE = '${processCode}'`
        const result =  await db.query(query);
        if(result.rowCount > 0){
                  res.status(200).json({
                      code : 200,
                      output : result.rows
                  })
       } else res.status(200).json({
                    code : 200,
                    output : []
                })
    } catch (err) {
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
        let GetData = await mysql.miQuery(`SELECT ID, SKU, SOLINE, JOBJACKET, SOLINE, QTY, ITEM, REQUEST_DATE, PROMISE_DATE, GPM, RBO, CUSTOMER_ITEM, CREATED_DATE, UPS, TOTAL_LOT FROM avery_rfid.ht_order_list WHERE JOBJACKET = '${id_job}'`)
        let progressDB = await mysql.miQuery("SELECT CODE_PROCESS, VN_NAME, UNIT FROM avery_rfid.ht_item_progress WHERE CODE_PROCESS='" + route + "'");
        let soline = GetData[0].SOLINE ;
        let urlPath = "";
        let result_url = await db.query(`SELECT url FROM zero_paper_less_system.prepress_upload WHERE soline = '${soline}' AND typedocument = 'GPM' AND active = 1 ORDER BY id desc LIMIT 1`);
        console.log(`SELECT url FROM zero_paper_less_system.prepress_upload WHERE soline = '${soline}' AND typedocument = 'GPM' AND active = 1 ORDER BY id desc LIMIT 1`);
        if(result_url.rowCount > 0) urlPath = Buffer.from(result_url.rows[0].url);
            res.status(200).json({
                code : 200 , 
                output : progressDB,
                jobjacket: GetData[0],
                urlPath: urlPath.toString('base64')
            })
    } catch (err) {
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
      var nameFile = "LayoutApproval_" + moment().format('yyyyMMDDHHmmss') + ".jpg";
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


module.exports = router;