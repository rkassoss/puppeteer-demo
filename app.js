const express = require('express');
const app = express();
var cors = require('cors');
var puppeteer = require('puppeteer');
const port = 4000;

var allowedOrigins = ['http://ussbyappv808.aceins.com:8080', 'http://localhost:3000'];

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
          var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null,true);
    },
    credentials: true
}));

app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`cyberindex_api listening on port ${port}!`));

app.get("/api/exportPdf", exportPdf);

async function exportPdf(req, res) {
    let fullUrl = req.headers.referer;
    fullUrl = fullUrl + '#/pdf-report';
    console.log(fullUrl);
    let query = req.query;
    console.log(query);
    try {
        const browser = await puppeteer.launch();
        // console.log(browser);
        const page = await browser.newPage();
        // console.log(page);
        await page.goto("https://www.google.com/", {waitUntil: 'networkidle0'});
        if(query){
            await page.type('#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input', query.compRev);
            await Promise.all([
                    page.click("#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input.gNO89b"),
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
            ]);
        }
        const buffer = await page.pdf({format: 'A4'});
        // console.log(buffer);
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': buffer.length });
        res.send(buffer);
        await browser.close();
    } catch(err){
        console.error(err);
    }
    
}