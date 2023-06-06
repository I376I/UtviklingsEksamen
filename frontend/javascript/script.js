// data = "nothing";
// url = "/Personer"
// fetch(url, {
//     method: "GET"
//     // body: JSON.stringify(data)
// }).then(response=>response.json())
// .then(data=>{ console.log(data); })

 // show tables 
// function showTable(tableId) {
//     var tables = document.getElementsByTagName("table");
//     for (var i = 0; i < tables.length; i++) {
//         tables[i].style.display = "none";
//     }
//     document.getElementById(tableId).style.display = "table";

//     var buttons = document.getElementsByClassName("nav-bar")[0].getElementsByTagName("button");
//     for (var j = 0; j < buttons.length; j++) {
//         buttons[j].classList.remove("active");
//     }
//     document.getElementById(tableId + "Btn").classList.add("active");
// }

var allData;

function createTables(){
    data = allData;
    const tableContainer = document.querySelector(".table-container");
    for(let i = 0; i < data.names.length; i++){
        const tables = document.createElement("table");
        const caption = document.createElement("caption");
        const text = document.createTextNode(data.names[i]);
        caption.appendChild(text);
        tables.appendChild(caption);
        tables.classList.add(data.names[i].replace(/\s/g,''))
        tableContainer.appendChild(tables);

        const thead = document.createElement("thead");
        tr = document.createElement("tr");
        for(let j = 0; j < data.data[i].Names.length; j++){
            const th = document.createElement("th");
            
            const text = document.createTextNode(data.data[i].Names[j]);
            th.appendChild(text);
            tr.appendChild(th);
        }
        th = document.createElement("th");
        const updateText = document.createTextNode("update");
        th.appendChild(updateText);
        tr.appendChild(th);
        thead.appendChild(tr);
        const tbody = document.createElement("tbody");
        for(let j = 0; j < data.data[i].data.length; j++){
            const tr = document.createElement("tr");
            let th = document.createElement("th");
            const text = document.createTextNode(data.data[i].data[j][0]);
            th.appendChild(text);
            tr.appendChild(th);
            for(let k = 1; k < data.data[i].data[j].length; k++){
                const th = document.createElement("th");
                const editBox = document.createElement("input");
                editBox.defaultValue = data.data[i].data[j][k];
                th.appendChild(editBox);
                tr.appendChild(th);
            }
            th = document.createElement("th");
            const updateButton = document.createElement("button");
            const updateText = document.createTextNode("update");
            updateButton.appendChild(updateText);
            th.appendChild(updateButton);
            tr.appendChild(th);
            tbody.appendChild(tr);
        }
        const tfoot = document.createElement("tfoot");
        tr = document.createElement("tr");
        th = document.createElement("th");
        const textConst = document.createTextNode("auto");
        th.appendChild(textConst);
        tr.appendChild(th);
        for(let j = 1; j < data.data[i].Names.length; j++){
            const th = document.createElement("th");
            editBox = document.createElement("input");
            editBox.classList.add(data.data[i].dataValues[j]);
            th.appendChild(editBox);
            tr.appendChild(th);
        }
        th = document.createElement("th");
        const div = document.createElement("div");
        div.classList.add("add-button");
        const button = document.createElement("button");
        button.addEventListener("click", () => {
            content = {
                database: data.names[i].replace(/\s/g,''),
                types: [],
                data: []
            };
            for(let j = 1; j < data.data[i].dataValues.length; j++){
                content.types.push(data.data[i].dataValues[j]);
                editbox = document.querySelector("." + data.data[i].dataValues[j]);
                content.data.push(editbox.value);
            }
            var request = new Request("/create");
            fetch(request,{
                method: "POST",
                body: JSON.stringify(content),
                headers: {"Content-Type": "application/json"}
            })
        });
        const addButtonText = document.createTextNode("Add");
        button.appendChild(addButtonText);
        div.appendChild(button);
        th.appendChild(div);
        tr.appendChild(th);
        tfoot.appendChild(tr);
        tables.appendChild(thead);
        tables.appendChild(tbody);
        tables.appendChild(tfoot);
    }
}

function createNav(){
    data = allData;
    const navBar = document.querySelector(".nav-bar");
    for(let i = 0; i < data.names.length; i++){
        type = document.createElement("button");
        text = document.createTextNode(data.names[i]);
        type.appendChild(text);
        navBar.appendChild(type);
        type.addEventListener("click", () => {
            const brukerTable = document.querySelector("." + data.names[i].replace(/\s/g,''));
            const allTables = document.querySelectorAll("table");
            for(let j = 0; j < allTables.length; j++){
                allTables[j].classList.remove("visible");
            }
            brukerTable.classList.add("visible")
        });
    }
}

function createAll(){
    console.log(allData)
    createTables();
    createNav();
}

function getDatabases(){
    url = "/All"
    fetch(url, {method: "GET"}).then(response=>response.json()).then(data=>{
        allData = data;
        createAll();
    });
}

getDatabases();



// var request = new Request("/create");
// fetch(request,{
//     method: "POST",
//     body: JSON.stringify({
//         database: "Brukere",
//         types: ["BrukerNavn", "Navn", "EPost", "Telefon"],
//         data: ["ger", "ret", "rek@something.com", "84037450"]
//     }),
//     headers: {"Content-Type": "application/json"}
// })