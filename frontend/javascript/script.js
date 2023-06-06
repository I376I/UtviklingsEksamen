data = "nothing";
url = "/Personer"
fetch(url, {
    method: "GET"
    // body: JSON.stringify(data)
}).then(response=>response.json())
.then(data=>{ console.log(data); })

var request = new Request("/create");
fetch(request,{
    method: "POST",
    body: JSON.stringify({
        database: "Brukere",
        types: ["BrukerNavn", "Navn", "EPost", "Telefon"],
        data: ["tbryne", "tollak", "tollak@something.com", "84027450"]
    }),
    headers: {"Content-Type": "application/json"}
})