const Router = require("express-promise-router")
const db = require("../Config/pgsql")
const mysql = require("../Config/mysql")
let router = new Router();

router.get('/', async (req,res,next) => {
   
})

var getLayout = async stext => {
    let progressDB = await db.query("SELECT id, cl_code, code, name, frequency, method, group_test, sequence, cl_type FROM zero_paper_less_system.checklist_layout WHERE cl_name = '" + stext + "' ORDER BY cl_code, seq;");
    let dt = progressDB.rows;
    let dataLayout = {};
    dt.forEach((v, i) => {
        if(dataLayout[v.cl_code] == undefined) dataLayout[v.cl_code] = [];
        dataLayout[v.cl_code].push(v);
    });
    
    let dtLayout = {};

    for (var index in dataLayout) {
        let htmlArray = [`<table style="width:100%;border-collapse: collapse;" border="1">
                            <tr style="background:black">
                                <td style="width:3%"></td>
                                <td style="width:15%"></td>
                                <td style="width:30%"></td>
                                <td style="width:15%"></td>
                                <td style="width:7%"></td>
                                <td style="width:5%"></td>
                                <td style="width:5%"></td>
                                <td style="width:5%"></td>
                                <td style="width:5%"></td>
                                <td style="width:5%"></td>
                                <td style="width:5%"></td>
                            </tr>
                            <tr style="background:black;color:white">
                                <th>STT.</th>
                                <th>Nội dung kiểm tra</th>
                                <th>Tần suất kiểm tra</th>
                                <th>Phương pháp/ dụng cụ kiểm tra</th>
                                <th>Người kiểm tra</th>
                                <th colspan="3">Kiểm mặt trước</th>
                                <th colspan="3">Kiểm mặt sau</th>
                            </tr>`];
        let group_test = "";
        dataLayout[index].forEach((v,i) => {
            htmlArray.push(` <tr>
                <td style="text-align:center">${v.sequence}</td>
                <td>${v.name}</td>
                <td>${v.frequency}</td>
                <td>${v.method}</td>
            `);
            if(group_test != v.group_test) {
                let vRowspan = 1;
                group_test = v.group_test;
                for(let j = i + 1; j < dataLayout[index].length; j++) {
                    if(group_test != dataLayout[index][j].group_test) break;
                    vRowspan++;
                } 
                htmlArray.push(`<td rowspan="${vRowspan}"><input id="${group_test}_SIGN" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label for="${group_test}_SIGN">Thợ Kí tên</label> <input id="${group_test}_SIGN_V" class="${v.cl_code}" style="width:100%"></td>`);
            }

            if(v.cl_type == "T3S3") htmlArray.push(`    <td colspan="1"><input ID="${v.code}_TD" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đầu</label> <input ID="${v.code}_TD_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_TG" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TG">Giữa</label> <input ID="${v.code}_TG_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_TC" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TC">Cuối</label> <input ID="${v.code}_TC_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_SD" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_SD">Đầu</label> <input ID="${v.code}_SD_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_SG" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_SG">Giữa</label> <input ID="${v.code}_SG_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_SC" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_SC">Cuối</label> <input ID="${v.code}_SC_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>`);
            else if(v.cl_type == "T1S1") htmlArray.push(`   <td colspan="3"><input ID="${v.code}_T" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_T">Đã kiểm</label> <input ID="${v.code}_T_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="3"><input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_S">Đã kiểm</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
            else if(v.cl_type == "T1S1A") htmlArray.push(`   <td colspan="3"><input ID="${v.code}_T" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_T">Đã kiểm</label> <input ID="${v.code}_T_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                            <td colspan="3">
                                                                <input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_S">Đã kiểm</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" />
                                                                <input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)"  style="margin-left:20px" /><label style="margin-left:5px" for="${v.code}_S">N/A</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" />
                                                            </td>
                                                    `);
            else if(v.cl_type == "F1") htmlArray.push(`   <td colspan="6"><input ID="${v.code}_A" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_A">Đã kiểm</label> <input ID="${v.code}_A_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        `);
            else if(v.cl_type == "F3") htmlArray.push(` <td colspan="2"><input ID="${v.code}_AD" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_AD">Đầu</label> <input ID="${v.code}_AD_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="2"><input ID="${v.code}_AG" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_AG">Giữa</label> <input ID="${v.code}_AG_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="2"><input ID="${v.code}_AC" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_AC">Cuối</label> <input ID="${v.code}_AC_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
            else if(v.cl_type == "F4") htmlArray.push(` <td colspan="1"><input ID="${v.code}_TD" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đầu</label> <input ID="${v.code}_TD_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_TG" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TG">Giữa</label> <input ID="${v.code}_TG_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_TC" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TC">Cuối</label> <input ID="${v.code}_TC_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="3"><input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_S">N/A</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
                                                    
            else if(v.cl_type == "FA") htmlArray.push(` <td colspan="6">
                                                            <input ID="${v.code}_A" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đã kiểm <input ID="${v.code}_A_V" class="V_NTID ${v.code}" type="input" style="width:50px" /></label>
                                                            <input ID="${v.code}_NA" class="${v.cl_code}" style="margin-left:50px" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_NA">N/A <input ID="${v.code}_NA_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></label>
                                                            <br/>
                                                            <a>
                                                                Điểm Barcode: Tờ đầu <input ID="${v.code}_D" class="${v.cl_code}" type="input" style="width:50px" />
                                                                            Tờ cuối <input ID="${v.code}_C" class="${v.cl_code}" type="input" style="width:50px" />
                                                            </a> 
                                                            <button onClick="saveData(['${v.code}_D','${v.code}_C'])">Lưu</button>
                                                        </td>
                                                    `);
            else if(v.cl_type == "E1") htmlArray.push(`   <td colspan="6"><input ID="${v.code}_A" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_A">Trước nạp code</label> <input ID="${v.code}_A_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
            else if(v.cl_type == "D1") htmlArray.push(`   <td colspan="6"><input ID="${v.code}_A" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_A">Đầu</label> <input ID="${v.code}_A_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
            else if(v.cl_type == "E2") htmlArray.push(`   <td colspan="3"><input ID="${v.code}_T" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_T">Trước nạp code</label> <input ID="${v.code}_T_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                            <td colspan="3"><input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_S">Trước nạp code</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
            else if(v.cl_type == "D2") htmlArray.push(`   <td colspan="3"><input ID="${v.code}_T" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_T">Đầu</label> <input ID="${v.code}_T_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                            <td colspan="3"><input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_S">Đầu</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);    
            
            else if(v.cl_type == "DA") htmlArray.push(` <td colspan="6">
                                                            <input ID="${v.code}_D" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đầu <input ID="${v.code}_D_V" class="V_NTID ${v.code}" type="input" style="width:50px" /></label>
                                                            <input ID="${v.code}_NA" class="${v.cl_code}" style="margin-left:50px" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_NA">N/A <input ID="${v.code}_NA_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></label>
                                                        </td>
                                                    `);     
            else if(v.cl_type == "DGA") htmlArray.push(` <td colspan="6">
                                                            <input ID="${v.code}_D" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đầu <input ID="${v.code}_D_V" class="V_NTID ${v.code}" type="input" style="width:50px" /></label>
                                                            <input ID="${v.code}_G" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TG">Đầu <input ID="${v.code}_G_V" class="V_NTID ${v.code}" type="input" style="width:50px" /></label>
                                                            <input ID="${v.code}_NA" class="${v.cl_code}" style="margin-left:50px" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_NA">N/A <input ID="${v.code}_NA_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></label>
                                                        </td>
                                                    `);     
            else if(v.cl_type == "L4") htmlArray.push(` <td colspan="1"><input ID="${v.code}_TD" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đầu</label> <input ID="${v.code}_TD_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_TG" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TG">Giữa</label> <input ID="${v.code}_TG_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="1"><input ID="${v.code}_TC" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TC">Cuối</label> <input ID="${v.code}_TC_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="3"><input ID="${v.code}_S" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_S">Sau khi Labeling</label> <input ID="${v.code}_S_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);   
            else if(v.cl_type == "F3") htmlArray.push(` <td colspan="2"><input ID="${v.code}_AD" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_AD">Đầu</label> <input ID="${v.code}_AD_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="2"><input ID="${v.code}_AG" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_AG">Cắt Nóng</label> <input ID="${v.code}_AG_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                        <td colspan="2"><input ID="${v.code}_AC" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_AC">Cắt Nguội</label> <input ID="${v.code}_AC_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></td>
                                                    `);
            else if(v.cl_type == "SM") htmlArray.push(` <td colspan="6">
                                                            <input ID="${v.code}_A" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đã kiểm <input ID="${v.code}_A_V" class="V_NTID ${v.code}" type="input" style="width:50px" /></label>
                                                            <input ID="${v.code}_M" class="${v.cl_code}" type="input" style="width:50px" /> Code vật tư
                                                            <button onClick="saveData(['${v.code}_M'])">Lưu</button>
                                                        </td>
                                                    `);                                                                             
            htmlArray.push(`</tr>`);
        });
        dtLayout[index] = htmlArray.join("");
    }
    
    return dtLayout;
}


router.get('/GetData', async (req,res,next) => {
    let id_job = req.query.ID_JOB;
    let route = req.query.ROUTE;
    let compensate = req.query.BU;
    let clName = req.query.NAME;

    try {
        
        let progressDB = await mysql.miQuery("SELECT CODE_PROCESS, VN_NAME, UNIT FROM avery_rfid.ht_item_progress WHERE CODE_PROCESS='" + route + "'");
        let GetData = await mysql.miQuery(`SELECT ID, SOLINE, JOBJACKET, SOLINE, QTY, ITEM, REQUEST_DATE, PROMISE_DATE, GPM, RBO, CUSTOMER_ITEM, CREATED_DATE, UPS FROM avery_rfid.ht_order_list WHERE JOBJACKET = '${id_job}'`)
        let prHTML = await getLayout(clName);
        let cl_data = await db.query(`SELECT cl_code, check_value, data_value, username FROM zero_paper_less_system.checklist_data WHERE id_job = '${id_job}' AND compensate = '${compensate}' AND active = 1`);

        res.status(201).json({
            code : 201,
            output : progressDB,
            mess : `Not find ${id_job} in db prepress_upload`,
            jobjacket: GetData[0],
            dataHTML: prHTML,
            data: cl_data.rows
        })

            
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})

router.get('/CheckData', async (req,res,next) => {
    let id_job = req.query.ID_JOB;
    let route = req.query.ROUTE;
    let cl_code = req.query.CODE;
    let check_value = req.query.CHECKED;
    let data_value = req.query.DATA;
    let username = req.query.NTID;
    let compensate = req.query.BU;
    try {
        await db.query(`UPDATE zero_paper_less_system.checklist_data SET Active = 0 WHERE id_job = '${id_job}' AND cl_code = '${cl_code}' AND compensate = '${compensate}'`);
        await db.query(`INSERT INTO zero_paper_less_system.checklist_data(id_job, route, compensate, cl_code, check_value, data_value, username)
        VALUES ('${id_job}','${route}','${compensate}','${cl_code}','${check_value}','${data_value}','${username}')`);
        res.status(201).json({
            code : 201,
            mess : "Insert Thành công",
        })
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})


router.get('/SaveData', async (req,res,next) => {
    let id_job = req.query.ID_JOB;
    let route = req.query.ROUTE;
    let cl_code = req.query.CODE;
    let check_value = req.query.CHECKED;
    let data_value_d = req.query.DATA_D;
    let data_value_c = req.query.DATA_C;
    let username = req.query.NTID;
    let compensate = req.query.BU;
    try {
        await db.query(`UPDATE zero_paper_less_system.checklist_data SET Active = 0 WHERE id_job = '${id_job}' AND cl_code IN ('${cl_code}_D','${cl_code}_C') AND compensate = '${compensate}'`);
        await db.query(`INSERT INTO zero_paper_less_system.checklist_data(id_job, route, compensate, cl_code, check_value, data_value, username)
        VALUES ('${id_job}','${route}','${compensate}','${cl_code}_D','${check_value}','${data_value_d}','${username}'),
        ('${id_job}','${route}','${compensate}','${cl_code}_C','${check_value}','${data_value_c}','${username}')`);
        res.status(201).json({
            code : 201,
            mess : "Insert Thành công",
        })
    } catch (err) {
        console.log(err)
        res.status(502).json({
            code : 502,
            mess : "Lỗi hệ thống"
        })
    }
})

module.exports = router;