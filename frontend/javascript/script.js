data = "nothing";
url = "/Personer"
fetch(url, {
    method: "GET"
    // body: JSON.stringify(data)
}).then(response=>response.json())
.then(data=>{ console.log(data); })

 // show tables 
function showTable(tableId) {
    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        tables[i].style.display = "none";
    }
    document.getElementById(tableId).style.display = "table";

    var buttons = document.getElementsByClassName("nav-bar")[0].getElementsByTagName("button");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
    }
    document.getElementById(tableId + "Btn").classList.add("active");
}

// var request = new Request("/create");
// fetch(request,{
//     method: "POST",
//     body: JSON.stringify({
//         database: "Brukere",
//         types: ["BrukerNavn", "Navn", "EPost", "Telefon"],
//         data: ["tbryne", "tollak", "tollak@something.com", "84027450"]
//     }),
//     headers: {"Content-Type": "application/json"}
// })