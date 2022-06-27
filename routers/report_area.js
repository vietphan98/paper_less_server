const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();

router.post('/SaveReport',async (req,res,next) => {
    try {
      let Route = req.body.ROUTE;
      let Id_job = req.body.ID_JOB;
      let DataRaw = req.body.DATA;
      console.log(req.body.DATA)
       await db.query(`UPDATE zero_paper_less_system.report_area_master SET active='0' WHERE id_job = '${Id_job}' AND route_step = '${Route}' `)
        //  DataRaw = JSON.parse(DataRaw)
      let arr_main = [];
      // let arr_main_item = []
              for(let j = 0 ; j <DataRaw.length ; j++){
                  for(let i = 0 ; i < DataRaw[j].DATA.length; i++){
                    let sql = `('${Id_job}','${DataRaw[j].SKU}','${Route}','${DataRaw[j].DATA[i].CONFIRM}','${DataRaw[j].DATA[i].VALUE}','${DataRaw[j].SEQ}','1')`
                    arr_main.push(sql)
                  }
                  
              }
      if(arr_main.length === 0) {
          return res.json("FAIL");
      }
      let query = `INSERT INTO zero_paper_less_system.report_area_master(id_job,sku,route_step,confirm,value,seq,active)  VALUES ${arr_main.join(",")}`
      const result =  await db.query(query);
       if(result.rowCount > 0){
                  res.status(200).json({
                      code : 200,
                      mess : "INSERT THANH CONG",
                      output : true
                  })
       }else{
        await db.query(`UPDATE zero_paper_less_system.report_area_master SET active='0' WHERE id_job = '${Id_job}' AND route_step = '${Route}' `)

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

    try {
        const result =  await  db.query(`SELECT id_job,sku,route_step,confirm,value,seq FROM zero_paper_less_system.report_area_master WHERE id_job = '${id_job}' AND active = '1' `)
       
            res.status(200).json({
                code : 200 , 
                output : result.rows
            })
        
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        }
        )
    }
})

router.get('/GetDataNew', async (req,res,next) => {
    let id_job = req.query.ID_JOB;
    let nameProgress = {};
    let progressData = [];
    try {
        
        let progressDB = await mysql.miQuery("SELECT CODE_PROCESS, VN_NAME, UNIT FROM avery_rfid.ht_item_progress");
        progressDB.forEach(v =>{
            nameProgress[v["CODE_PROCESS"]] = {
                "VN_NAME" : v["VN_NAME"],
                "UNIT" : v["UNIT"]
            }
        });

        let orderData = await mysql.miQuery("SELECT ID, JOBJACKET, SOLINE, QTY, ITEM, REQUEST_DATE, PROMISE_DATE, SKU FROM avery_rfid.ht_order_list WHERE JOBJACKET = '" + id_job + "' AND ACTIVE = 1;");
        if(orderData.length == 0) {

        }

        let itemcode = orderData[0]["ITEM"];
        let sku = orderData[0]["SKU"];
        let processCode = await mysql.miQueryScalar("SELECT PROCESS FROM avery_rfid.ht_item_master_v2 WHERE ITEM = '" + itemcode + "' AND ACTIVE = 1;");
        let turnAdd = true;
        for(let i = 2; i < processCode.length; i+=4) {
            let stepCode = processCode[i] + processCode[i + 1];
            if((stepCode == "QC" || stepCode == "Q1") && turnAdd) {
                progressData.push({
                    "PROCESS_CODE": "LS",
                    "UNIT": nameProgress[stepCode]["UNIT"],
                    "VN_NAME": "Luster"
                });
                turnAdd = false;
            }

            progressData.push({
                "PROCESS_CODE": stepCode,
                "UNIT": nameProgress[stepCode]["UNIT"],
                "VN_NAME": nameProgress[stepCode]["VN_NAME"]
            });
        }

        const result =  await  db.query(`SELECT id_job,sku,route_step,confirm,value,seq FROM zero_paper_less_system.report_area_master WHERE id_job = '${id_job}' AND active = '1' `)
       
            res.status(200).json({
                code : 200 , 
                output : {
                    "DATA" : result.rows,
                    "HEADER" : progressData,
                    "SKU" : sku,
                    "JOBJACKET": orderData[0]
                }
            })

        
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        }
        )
    }
})


module.exports = router;