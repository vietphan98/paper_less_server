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
     
        let query = `INSERT INTO zero_paper_less_system.report_layout_approval(ID_JOB,PROCESS_CODE,USERNAME,SKU,OPS_CHECK,QC_CHECK,IMG)
         VALUES('${jobID}','${processCode}','${NTID}','${sku}','${ops}','${qc}','${IMG}')`
        const result =  await db.query(query);
        console.log(query);
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
     
        let query = `SELECT ID,ID_JOB,PROCESS_CODE,USERNAME,SKU,OPS_CHECK,QC_CHECK,IMG,CREATEDDATE FROM zero_paper_less_system.report_layout_approval WHERE ID_JOB = '${jobID}' AND PROCESS_CODE = '${processCode}'`
        const result =  await db.query(query);
        console.log(result)
        if(result.rowCount > 0){
                  res.status(200).json({
                      code : 200,
                      output : result.rows
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


router.get('/GetData', async (req,res,next) => {
    let soline = req.query.SOLINE;
    let type = req.query.TYPE;
    let sqlString = "";
    try {
        if(type == undefined) sqlString = "SELECT id,soline,uploadby,uploaddate, typedocument, url, namefile FROM zero_paper_less_system.prepress_upload WHERE SOLINE = '" + soline + "' AND ACTIVE = 1";
        else sqlString = "SELECT id,soline,uploadby,uploaddate, typedocument, url, namefile FROM zero_paper_less_system.prepress_upload WHERE SOLINE = '" + soline + "' AND typedocument = '" + type + "' AND ACTIVE = 1";
        let progressDB = await db.query(sqlString);
       
            res.status(200).json({
                code : 200 , 
                output : progressDB.rows
            })
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})

router.post('/UploadFile', async (req,res,next) => {
    var form = new formidable.IncomingForm();
    let soline = req.query.SOLINE;
    let ntid = req.query.NTID;
    let type = req.query.TYPE;
    


    form.parse(req, async (err, fields, files) => {
        console.log(files);
        var oldpath = files.file.filepath;
        var nameFile = moment().format('yyyyMMDDHHmmss') + "_" + files.file.originalFilename;
        var newpath = 'D:/Zero/client/public/pdf/PrepressUpload/' + nameFile;
        
        let values = [];
        soline.split('|').forEach(v => {
            values.push("('" + v + "','" + ntid + "','" + type + "','" + newpath + "','" + nameFile + "')");
        })
        let progressDB = await db.query("INSERT INTO zero_paper_less_system.prepress_upload(soline,uploadby, typedocument, url, namefile) VALUES" + values.join(","));

        fs.copyFile(oldpath, newpath, function (err) {
        if (err) throw err;

        res.status(200).json({state: true, name: files.file.originalFilename, extra: {info: 'just a way to send some extra data', param: 'some value here'}})

        // res.write('File uploaded and moved!');
        // res.end();
      });
    });
})


router.post('/UploadFileAll', async (req,res,next) => {
    var form = new formidable.IncomingForm();
    let soline = req.body.SOLINE;
    let ntid = req.body.NTID;
    let type = req.body.TYPE;
    


    form.parse(req, async (err, fields, files) => {
        console.log(files);
        var oldpath = files.filename.filepath;
        var nameFile = moment().format('yyyyMMDDHHmmss') + files.filename.originalFilename;
        var newpath = 'D:/Zero/client/public/pdf/PrepressUpload/' + nameFile;

        let values = [];
        soline.split('|').forEach(v => {
            values.push("('" + v + "','" + ntid + "','" + type + "','" + newpath + "','" + nameFile + "')");
        })
        let progressDB = await db.query("INSERT INTO zero_paper_less_system.prepress_upload(soline,uploadby, typedocument, url, namefile) VALUES" + values.join(","));

        fs.copyFile(oldpath, newpath, function (err) {
        if (err) throw err;

        res.status(200).json({state: true, name: files.filename.originalFilename, extra: {info: 'just a way to send some extra data', param: 'some value here'}})

        // res.write('File uploaded and moved!');
        // res.end();
      });
    });
})

// delete
router.post('/DeleteFile', async(req,res,next) =>{
    let id = req.body.ID ;
    // let type = req.bodY.TYPE ;
    // if(type !== 'ARTWORK'){
    //   return  res.status(200).json({
    //         code : 200 ,
    //         mess : " Delete Fail , Please open tab ARTWORD"
    //     })
    // }

    try {
    const result = await db.query(`UPDATE zero_paper_less_system.prepress_upload SET active = '0' WHERE  id = ${id}`)
    if(result.rowCount > 0){
        res.status(200).json({
            code : 200 , 
            mess : `delete sucsses ${id}`
        })
    }else{
        res.status(201).json({
            code : 200 , 
            mess : "delete fail"
        }) 
    }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            code : 500 ,
            mess : "Loi he thoong"
        })
    }
})
router.post('/DeleteFileAll', async(req,res,next) => {
    let soline = req.body.SOLINE;
    let type = req.body.TYPE ;
  
    try {
        const result = await db.query(`UPDATE zero_paper_less_system.prepress_upload SET active = '0' WHERE  soline = '${soline}' AND typedocument = '${type}'`)
        if(result.rowCount > 0){
            res.status(200).json({
                code : 200 , 
                mess : `Delete sucsses all => ${soline}`
            })
        }else{
            res.status(201).json({
                code : 200 , 
                mess : "delete fail"
            }) 
        }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                code : 500 ,
                mess : "Loi he thoong"
            })
        }
})


module.exports = router;