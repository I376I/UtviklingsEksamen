const https = require('https');
const fs = require('fs');
const express = require('express');
const sql = require('mysql');
const { request } = require('http');
const port = 4029;
const app = express();

const { connect } = require('http2');
const { listenerCount } = require('process');

// hvordan du skal strukturere json fil med database inloging
// {
//     host: "hostnavn",
//     user: "brukernavn",
//     password: "passord"
// }
databaseCreds = fs.readFileSync("database.json", "utf-8");

const connection = sql.createConnection(JSON.parse(databaseCreds));

connection.connect();

//bruk json, lar deg få ut body av request
app.use(express.json());

// mulighet for https
// const privateKey = fs.readFileSync("key.pem", "utf-8");
// const certificate = fs.readFileSync("cert.pem", "utf-8");
// creds = {key: privateKey, cert: certificate}

// https.createServer({creds}, app).listen(port, () =>{
//     console.log("server running on port " + port);
// })

app.listen(port, () => {
    console.log("server running on port " + port);
})

app.get('/css/style.css', (req, res) => {
    res.send(fs.readFileSync("frontend/css/style.css", "utf-8"));
})

app.get('/', (req, res) => {
    res.send(fs.readFileSync("frontend/index.html", "utf-8"));
})

app.get('/javascript/script.js', (req, res) => {
    res.send(fs.readFileSync("frontend/javascript/script.js", "utf-8"));
})

//lager nye rader i tabellene
app.post('/create', (req, res) =>{
    // INSERT INTO `Projects`.`Brukere` (`BrukerNavn`, `Navn`, `E-Post`, `Telefon`) VALUES ('tbryne', 'tollak', 'tollak@something.com', '84027450');
    var start = "INSERT INTO `Projects`.`" + req.body.database + "` (";
    for(let i = 0; i < req.body.types.length; i++){
        start += "`" + req.body.types[i] +"`"
        if(i != req.body.types.length - 1) start += ", ";
    }
    start += ") VALUES (";
    for(let i = 0; i < req.body.data.length; i++){
        start += "'" + req.body.data[i] +"'"
        if(i != req.body.data.length - 1) start += ", ";
    }
    start += ");"
    connection.query(start, (err, result) => {
        if(err){
            res.send({ code:400, failed: "error occurred"});
        }
        else{
            res.send();
        }
    })
})

//sletter ved hjelp av id og databasenavn
app.post('/delete', (req, res) =>{
    // DELETE FROM `Projects`.`Brukere` WHERE (`Id` = '1');
    var start = "DELETE FROM `Projects`.`" + req.body.database + "` WHERE (`Id` = '" + req.body.id + "');"
    connection.query(start)
    res.send();
})

//converterer til enkel liste som kan bli satt inne i meldingen, sortert etter info
function convert(info, data){
    all = [];
    for(let i = 0; i < data.length; i++){ //looper over alle radene den får
        var DataPack = [];
        for(let j = 0; j < info.dataValues.length; j++){ //looper over de forskjellige navnene og setter dei inn
            DataPack.push(data[i][info.dataValues[j]]);
        }
        all.push(DataPack);
    }
    return all;
}

//sender tabelnavna, tabelene med navn på verdier, hva dataverdi navnene det er inne i databasen og verdiene
app.get('/All', (req, res) => {
    var dataBases = {names: ["Brukere", "Prosjekter", "Prosjekt Type"], data: []};
    //beskriver de forskjellige tabelene
    var brukere = {
        Names: 
        ["Id",
        "Bruker Navn",
        "Navn",
        "E-Post",
        "Telefon"],
        dataValues:
        ["Id",
        "BrukerNavn",
        "Navn",
        "EPost",
        "Telefon"],
        data: []
    }
    var prosjekter = {
        Names: 
        ["Id",
        "Navn",
        "Type",
        "Beskrivelse",
        "Tilhører"],
        dataValues:
        ["Id",
        "Navn",
        "ProsjektType",
        "Beskrivelse",
        "Owner"],
        data: []
    }
    var prosjektTyper = {
        Names: 
        ["Id",
        "Navn"],
        dataValues:
        ["Id",
        "Navn"],
        data: []
    }
    //går gjennom hver tabell
    connection.query("SELECT * FROM Projects.ProsjektType;", (error, resultsProsjektType) => {
        connection.query("SELECT * FROM Projects.Brukere;", (error, resultsBrukere) => {
            connection.query("SELECT * FROM Projects.Prosjekter;", (error, resultsProsjekter) => {
                prosjektTyper.data = convert(prosjektTyper, resultsProsjektType);
                prosjekter.data = convert(prosjekter, resultsProsjekter);
                brukere.data = convert(brukere, resultsBrukere);

                dataBases.data.push(brukere);
                dataBases.data.push(prosjekter);
                dataBases.data.push(prosjektTyper);

                res.send(dataBases);
            });
        });
    });
});