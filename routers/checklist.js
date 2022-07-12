const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();

router.post('/buildstock', async (req,res,next) => {
    let id_job = req.body.ID_JOB;
    let pic = req.body.PIC
    let DataRaw = req.body.DATA_SEND;
    try {
        let sql = "INSERT INTO zero_paper_less_system.checklist(id_job,pic,route,value,id_task,active) VALUES";
        DataRaw.forEach( v => {
            if(v.check === true || v.check === 'true'){
                    sql += `('${id_job}','${pic}','${v.Route}','TRUE','${v.id}','active'),`
            }else{
                    sql += `('${id_job}','${pic}','${v.Route}','${v.value}','${v.id}','active'),`
            }
           
        });
     await db.query(`UPDATE zero_paper_less_system.checklist SET active = 'Not active' WHERE id_job='${id_job}' AND route = 'Builstock'`);
        sql =  sql.slice(0, -1);
        const resultInsert = await db.query(sql);
        if(resultInsert.rowCount >0){
            res.status(200).json({
                code : 200 ,
                mess : "Save thành công"
            })
        }else{
            res.status(201).json({
                code : 201 ,
                mess : "Lỗi , không thể save"
            })
        }
  
       
    } catch (err) {
        res.status(500).json({
            code : 500 ,
            mess : "Lỗi hệ thống",
            err : err
        })
    }
})
router.get('/LoadData_buildstock',async(req,res,next) => {
    let id_job = req.query.ID_JOB;
    try {
        let result = await db.query(`SELECT id_job,pic,route,value,id_task FROM zero_paper_less_system.checklist WHERE id_job='${id_job}' AND route = 'Builstock' AND active = 'active'`)
        if(result.rowCount > 0){
            res.status(200).json({
                code : 200,
                mess : "Load data thanh cong",
                output : result.rows
            })
        }else{
            res.status(201).json({
                code : 200,
                mess : 'Chua update check list'
            })
        }
    } catch (error) {
        res.status(500).json({
            code : 500,
            mess : "Looix he thong",
            err : error
        })
    }
})

router.post('/inkjet', async (req,res,next) => {
    let id_job = req.body.ID_JOB;
    let pic = req.body.PIC
    let DataRaw = req.body.DATA_SEND;
    try {
        let sql = "INSERT INTO zero_paper_less_system.checklist(id_job,pic,route,value,id_task,active) VALUES";
        DataRaw.forEach( v => {
            if(v.check === true || v.check === 'true'){
                    sql += `('${id_job}','${pic}','${v.Route}','TRUE','${v.id}','active'),`
            }else{
                    sql += `('${id_job}','${pic}','${v.Route}','${v.value}','${v.id}','active'),`
            }
           
        });
     await db.query(`UPDATE zero_paper_less_system.checklist SET active = 'Not active' WHERE id_job='${id_job}' AND route = 'Inkjet'`);
        sql =  sql.slice(0, -1);
        const resultInsert = await db.query(sql);
        if(resultInsert.rowCount >0){
            res.status(200).json({
                code : 200 ,
                mess : "Save thành công"
            })
        }else{
            res.status(201).json({
                code : 201 ,
                mess : "Lỗi , không thể save"
            })
        }
  
       
    } catch (err) {
        res.status(500).json({
            code : 500 ,
            mess : "Lỗi hệ thống",
            err : err
        })
    }
})

router.get('/LoadData_inkjet',async(req,res,next) => {
    let id_job = req.query.ID_JOB;
    try {
        let result = await db.query(`SELECT id_job,pic,route,value,id_task FROM zero_paper_less_system.checklist WHERE id_job='${id_job}' AND route = 'Inkjet' AND active = 'active'`)
        if(result.rowCount > 0){
            res.status(200).json({
                code : 200,
                mess : "Load data thanh cong",
                output : result.rows
            })
        }else{
            res.status(201).json({
                code : 200,
                mess : 'Chua update check list'
            })
        }
    } catch (error) {
        res.status(500).json({
            code : 500,
            mess : "Looix he thong",
            err : error
        })
    }
})

router.post('/laser', async (req,res,next) => {
    let id_job = req.body.ID_JOB;
    let pic = req.body.PIC
    let DataRaw = req.body.DATA_SEND;
    try {
        let sql = "INSERT INTO zero_paper_less_system.checklist(id_job,pic,route,value,id_task,active) VALUES";
        DataRaw.forEach( v => {
            if(v.check === true || v.check === 'true'){
                    sql += `('${id_job}','${pic}','${v.Route}','TRUE','${v.id}','active'),`
            }else{
                    sql += `('${id_job}','${pic}','${v.Route}','${v.value}','${v.id}','active'),`
            }
           
        });
     await db.query(`UPDATE zero_paper_less_system.checklist SET active = 'Not active' WHERE id_job='${id_job}' AND route = 'Laser'`);
        sql =  sql.slice(0, -1);
        const resultInsert = await db.query(sql);
        if(resultInsert.rowCount >0){
            res.status(200).json({
                code : 200 ,
                mess : "Save thành công"
            })
        }else{
            res.status(201).json({
                code : 201 ,
                mess : "Lỗi , không thể save"
            })
        }
  
       
    } catch (err) {
        res.status(500).json({
            code : 500 ,
            mess : "Lỗi hệ thống",
            err : err
        })
    }
})

router.get('/LoadData_laser',async(req,res,next) => {
    let id_job = req.query.ID_JOB;
    try {
        let result = await db.query(`SELECT id_job,pic,route,value,id_task FROM zero_paper_less_system.checklist WHERE id_job='${id_job}' AND route = 'Laser' AND active = 'active'`)
        if(result.rowCount > 0){
            res.status(200).json({
                code : 200,
                mess : "Load data thanh cong",
                output : result.rows
            })
        }else{
            res.status(201).json({
                code : 200,
                mess : 'Chua update check list'
            })
        }
    } catch (error) {
        res.status(500).json({
            code : 500,
            mess : "Looix he thong",
            err : error
        })
    }
})
router.post('/offset', async (req,res,next) => {
    let id_job = req.body.ID_JOB;
    let pic = req.body.PIC
    let DataRaw = req.body.DATA_SEND;
    try {
        let sql = "INSERT INTO zero_paper_less_system.checklist(id_job,pic,route,value,id_task,active) VALUES";
        DataRaw.forEach( v => {
            if(v.check === true || v.check === 'true'){
                    sql += `('${id_job}','${pic}','${v.Route}','TRUE','${v.id}','active'),`
            }else{
                    sql += `('${id_job}','${pic}','${v.Route}','${v.value}','${v.id}','active'),`
            }
           
        });
     await db.query(`UPDATE zero_paper_less_system.checklist SET active = 'Not active' WHERE id_job='${id_job}' AND route = 'Offset'`);
        sql =  sql.slice(0, -1);
        const resultInsert = await db.query(sql);
        if(resultInsert.rowCount >0){
            res.status(200).json({
                code : 200 ,
                mess : "Save thành công"
            })
        }else{
            res.status(201).json({
                code : 201 ,
                mess : "Lỗi , không thể save"
            })
        }
  
       
    } catch (err) {
        res.status(500).json({
            code : 500 ,
            mess : "Lỗi hệ thống",
            err : err
        })
    }
})

router.get('/LoadData_offset',async(req,res,next) => {
    let id_job = req.query.ID_JOB;
    try {
        let result = await db.query(`SELECT id_job,pic,route,value,id_task FROM zero_paper_less_system.checklist WHERE id_job='${id_job}' AND route = 'Offset' AND active = 'active'`)
        if(result.rowCount > 0){
            res.status(200).json({
                code : 200,
                mess : "Load data thanh cong",
                output : result.rows
            })
        }else{
            res.status(201).json({
                code : 200,
                mess : 'Chua update check list'
            })
        }
    } catch (error) {
        res.status(500).json({
            code : 500,
            mess : "Looix he thong",
            err : error
        })
    }
})

module.exports = router;