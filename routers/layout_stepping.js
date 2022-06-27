const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();
var fs = require('fs');

router.post('/InsertData',async (req,res,next) => {
    try {
        let processCode = req.body.PROCESS_CODE;
        let jobID = req.body.ID_JOB;
        let lot = req.body.LOT;
        let action = req.body.ACTION;
        let NTID = req.body.NTID;
     
        let query = `INSERT INTO zero_paper_less_system.report_layout_stepping(ID_JOB,PROCESS_CODE,USERNAME,LOT,ACTION)  VALUES('${jobID}','${processCode}','${NTID}','${lot}','${action}')`
        const result =  await db.query(query);
        console.log(query);
        if(result.rowCount > 0){
                  res.status(200).json({
                      code : 200,
                      mess : action == "Check" ? "Đã check" : "Đã hủy check",
                      status : action == "Check" ? "Checked" : "Check",
                      color : action == "Check" ? "green" : "black",
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
     
        let query = `SELECT ID,ID_JOB,PROCESS_CODE,USERNAME,LOT,ACTION,CREATEDDATE FROM zero_paper_less_system.report_layout_stepping WHERE ID_JOB = '${jobID}' AND PROCESS_CODE = '${processCode}'`
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
    let id_job = req.query.ID_JOB;
    let route = req.query.ROUTE;
    try {
        let getData = await mysql.miQuery(`SELECT ID, SOLINE, JOBJACKET, SOLINE, QTY, ITEM, REQUEST_DATE, PROMISE_DATE, GPM, RBO, CUSTOMER_ITEM, CREATED_DATE, UPS, TOTAL_LOT FROM avery_rfid.ht_order_list WHERE JOBJACKET = '${id_job}'`)
        let progressDB = await mysql.miQuery("SELECT CODE_PROCESS, VN_NAME, UNIT FROM avery_rfid.ht_item_progress WHERE CODE_PROCESS='" + route + "'");
        
        res.status(200).json({
            code : 200 , 
            output : progressDB,
            jobjacket: getData[0]
        });

    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})

router.get('/GetLot',async (req,res,next) => {
    let soline = req.query.SOLINE;
    let lot = req.query.LOT;
    let id_job = req.query.ID_JOB;
    try {
        let result_url = await db.query(`SELECT url FROM zero_paper_less_system.prepress_upload WHERE soline = '${soline}' AND typedocument = 'LAYOUTSTEPPING' AND namefile LIKE '%Part${lot}%' AND active = 1 ORDER BY id desc LIMIT 1`)
        let Check_lot = await db.query(`SELECT action FROM zero_paper_less_system.report_layout_stepping WHERE ID_JOB = '${id_job}' AND lot = '${lot}' ORDER BY id DESC LIMIT 1`)
        let urlPath = "";
        let action = "Check";
        let color = "black";
        if(result_url.rowCount > 0) urlPath = Buffer.from(result_url.rows[0].url);
        if(Check_lot.rowCount > 0 && Check_lot.rows[0].action == "Check") {
            action = "Checked";
            color = "green";
        }
        res.status(200).json({
            code: 200,
            status : action,
            color: color,
            url: urlPath.toString('base64')
        })
    } catch (err) {
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})


module.exports = router;