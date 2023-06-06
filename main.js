const https = require('https');
const fs = require('fs');
const express = require('express');
const sql = require('mysql');
const { request } = require('http');
const port = 4029;
const app = express();

const { connect } = require('http2');
const { listenerCount } = require('process');

// {
//     host: "hostnavn",
//     user: "brukernavn",
//     password: "passord"
// }



databaseCreds = fs.readFileSync("database.json", "utf-8");

const connection = sql.createConnection(JSON.parse(databaseCreds));

connection.connect();

app.use(express.json());

const privateKey = fs.readFileSync("key.pem", "utf-8");
const certificate = fs.readFileSync("cert.pem", "utf-8");
creds = {key: privateKey, cert: certificate}

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
    connection.query(start)
    res.send();
})

app.post('/delete', (req, res) =>{
    // DELETE FROM `Projects`.`Brukere` WHERE (`Id` = '1');
    var start = "DELETE FROM `Projects`.`" + req.body.database + "` WHERE (`Id` = '" + req.body.id + "');"
    connection.query(start)
    res.send();
})

function convert(info, data){
    all = [];
    for(let i = 0; i < data.length; i++){
        var DataPack = [];
        for(let j = 0; j < info.dataValues.length; j++){
            DataPack.push(data[i][info.dataValues[j]]);
        }
        all.push(DataPack);
    }
    return all;
}

app.get('/Databases', (req, res) => {
    dataBases = {names: ["Brukere", "Prosjekter", "Prosjekt Typer"]};
    res.send(dataBases);
});

app.get('/Personer', (req, res) => {
    info = {
        dataValues: ["BrukerNavn",
        "Navn",
        "EPost",
        "Telefon"]
    }
    value = {
        Names: ["Bruker Navn",
        "Navn",
        "E-Post",
        "Telefon"],
        Types: [1, 1, 1, 2],
        Data: []
    }
    connection.query("SELECT * FROM Projects.Brukere;", (error, results) => {
        value.Data = convert(info, results)
        res.send(value);
    });
})

app.get('/Prosjekter', (req, res) => {
    info = {
        dataValues: ["Navn",
        "ProsjektType",
        "Beskrivelse",
        "Owner"]
    }
    value = {
        Names: ["Navn",
        "Type",
        "Beskrivelse",
        "Tilhører"],
        Types: [1, 1, 1, 2],
        Data: []
    }
    connection.query("SELECT * FROM Projects.Prosjekter;", (error, results) => {
        value.Data = convert(info, results)
        connection.query("SELECT * FROM Projects.Brukere;", (error, resultsBrukere) => {
            connection.query("SELECT * FROM Projects.ProsjektType;", (error, resultsProsjektType) => {
                for(let i = 0; i < value.Data.length; i++){
                    for(let j = 0; j < resultsBrukere.length; j++){
                        if(resultsBrukere[j].Id == value.Data[i][3]) value.Data[i][3] = resultsBrukere[j].BrukerNavn;
                        break;
                    }
                    for(let j = 0; j < resultsProsjektType.length; j++){
                        if(resultsProsjektType[j].Id == value.Data[i][1]) value.Data[i][1] = resultsProsjektType[j].Navn;
                        break;
                    }      
                }
                res.send(value);
            })
        })
    });
})

app.get('/ProsjektType', (req, res) => {
    info = {
        dataValues: ["Navn"]
    }
    value = {
        Names: ["Navn"],
        Types: [1],
        Data: []
    }
    connection.query("SELECT * FROM Projects.ProsjektType;", (error, results) => {
        if(results){
            value.Data = convert(info, results)
            res.send(value);
        }
        else{
            res.send({no: "no"})
        }
    });
})

app.get('/All', (req, res) => {
    var dataBases = {names: ["Brukere", "Prosjekter", "Prosjekt Type"], data: []};
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
    

    // dataValues: ["BrukerNavn",
    //     "Navn",
    //     "EPost",
    //     "Telefon"]
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

//INSERT INTO `Projects`.`Brukere` (`BrukerNavn`, `Navn`, `E-Post`, `Telefon`) VALUES ('tbryne', 'tollak', 'tollak@something.com', '84027450');