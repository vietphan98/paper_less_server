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
                htmlArray.push(`<td rowspan="${vRowspan}"><input id="${group_test}_CSIGN" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label for="${group_test}_CSIGN">Thợ Kí tên</label> <input id="${group_test}_SIGN" class="${v.cl_code}" style="width:100%"></td>`);
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
                                                            <input ID="${v.code}_A" class="${v.cl_code}" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_TD">Đã kiểm <input ID="${v.code}_A_V" class="V_NTID" type="input" style="width:50px" /></label>
                                                            <input ID="${v.code}_NA" class="${v.cl_code}" style="margin-left:50px" type="checkbox" onchange="checkValue(this)" /><label style="margin-left:5px" for="${v.code}_NA">N/A <input ID="${v.code}_NA_V" class="V_NTID ${v.cl_code}" type="input" style="width:50px" /></label>
                                                            <br/>
                                                            <a>
                                                                Điểm Barcode: Tờ đầu <input ID="${v.code}_D" class="${v.cl_code}" type="input" style="width:50px" />
                                                                            Tờ cuối <input ID="${v.code}_C" class="${v.cl_code}" type="input" style="width:50px" />
                                                            </a> 
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
    try {
        
        let progressDB = await mysql.miQuery("SELECT CODE_PROCESS, VN_NAME, UNIT FROM avery_rfid.ht_item_progress WHERE CODE_PROCESS='" + route + "'");
        let GetData = await mysql.miQuery(`SELECT ID, SOLINE, JOBJACKET, SOLINE, QTY, ITEM, REQUEST_DATE, PROMISE_DATE, GPM, RBO, CUSTOMER_ITEM, CREATED_DATE, UPS FROM avery_rfid.ht_order_list WHERE JOBJACKET = '${id_job}'`)
        let prHTML = await getLayout("Build Stock");

        res.status(201).json({
            code : 201,
            output : progressDB,
            mess : `Not find ${id_job} in db prepress_upload`,
            jobjacket: GetData[0],
            dataHTML: prHTML
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