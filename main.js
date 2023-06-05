const express = require('express');
const { request } = require('http');
const port = 4028;
const app = express();
const https = require('https');
const fs = require('fs');

app.get('/', (req, res) => {
    res.send(fs.readFileSync("frontend/index.html", "utf-8"));
})

const privateKey = fs.readFileSync("key.pem", "utf-8");
const certificate = fs.readFileSync("cert.pem", "utf-8");
creds = {key: privateKey, cert: certificate}

https.createServer({creds}, app).listen(port, () =>{
    console.log("server running on port " + port);
})