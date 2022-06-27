const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
const pdf2base64 = require('pdf-to-base64');
const fs = require("fs");
let router = new Router();

router.get('/getGPM', async(req,res,next) => {
    let soline = req.query.SOLINE;
    let lot = req.query.LOT;
    let id_job = req.query.ID_JOB;
    try {
        let result_url = await db.query(`SELECT url FROM zero_paper_less_system.prepress_upload WHERE soline = '${soline}' AND typedocument = 'GPM' AND active = 1 ORDER BY id desc LIMIT 1`)
        let urlPath = "";
        if(result_url.rowCount > 0) urlPath = Buffer.from(result_url.rows[0].url);
        
        res.status(200).json({
            code: 200,
            urlPath: urlPath.toString('base64')
        })
    } catch (err) {
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})


router.get('/GetCS', async(req,res,next) => {
    let soline = req.query.SOLINE;
    let lot = req.query.LOT;
    let id_job = req.query.ID_JOB;
    try {
        let result_url = await db.query(`SELECT full_path as url, page FROM zero_paper_less_system.cs_order_scan WHERE soline = '${soline}' ORDER BY id desc LIMIT 1`)
        let urlPath = "";
        if(result_url.rowCount > 0) urlPath = Buffer.from(result_url.rows[0].url);
        
        res.status(200).json({
            code: 200,
            urlPath: urlPath.toString('base64'),
            page: result_url.rows[0].page
        })
    } catch (err) {
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
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

module.exports = router;
