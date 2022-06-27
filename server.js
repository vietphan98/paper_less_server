const express = require("express");
const cors = require("cors");
require("dotenv").config()
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5656;
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); //

var fs = require('fs');
var https = require('https');
var https_options = {
    key: fs.readFileSync("Config/private.key"),
    cert: fs.readFileSync("Config/certificate.crt"),
    ca: [
            fs.readFileSync('Config/ca_bundle.crt'),
         ]
  };




https.createServer(https_options, app).listen(port, () => {
    console.log(`server is running at port http://localhost:${port}`)
})

app.get('/health_check', (req,res,next) => {
    try {
        
        res.status(200).json({
            status: 1,
            msg: 'Hệ thống đang hoạt động '
        })
    } catch (e) {
        console.log(e);
        res.status(502).json({
            status: -4,
            msg: 'Thất bại'
        })
    }
})

app.use('/api/prepressUpload',require('./routers/prepress_upload'))
app.use('/api/report_area',require('./routers/report_area'))
app.use('/api/report_lot',require('./routers/report_lot'))
app.use('/api/layout_stepping',require('./routers/layout_stepping'))
app.use('/api/layout_artwork',require('./routers/layout_artwork'))
app.use('/api/layout_approval',require('./routers/layout_approval'))
app.use('/api/layout_pdf_cs_form',require('./routers/read_pdf_cs_form'))
app.use('/api/documentview',require('./routers/document_view'))
app.use('/api/pdfRead',require('./routers/pdfRead'))
app.use('/api/checklist', require('./routers/checklist'))
app.use('/api/checklistLayout', require('./routers/checklistLayout'))
module.exports = app;