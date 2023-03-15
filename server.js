const fs = require('fs');
const https = require('https');

const hostname = 'rende.fun';
const port = 443;

const httpsOptions = {
    cert: fs.readFileSync('./ssl/rende.pem'),
    key: fs.readFileSync('./ssl/rende.key'),
    ca: [
        fs.readFileSync('./ssl/Cloudflare_CA.crt'),
        fs.readFileSync('./ssl/Cloudflare_CA.pem')
    ]
};

const httpsServer = https.createServer(httpsOptions, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Rende Server :)</h1>');
});

httpsServer.listen(port, hostname);