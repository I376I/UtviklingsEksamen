//her ligger alt dataene sånn at alle funksjonene kan få tak i det
var allData;

//lager alle de forskjellige tabelene
function createInnerTables(i){
    data = allData;
    const table = document.createElement("table");
    table.setAttribute('id', data.names[i].replace(/\s/g,''));
    const caption = document.createElement("caption");
    const text = document.createTextNode(data.names[i]);
    caption.appendChild(text);
    table.appendChild(caption);
    table.appendChild(createTableHead(i));
    table.appendChild(createTableBody(i));
    table.appendChild(createTableFoot(i));
    return table;
}

//lager headen til tabellen
function createTableHead(i){
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    for(let j = 0; j < data.data[i].Names.length; j++){
        const th = document.createElement("th");
        const text = document.createTextNode(data.data[i].Names[j]);
        th.appendChild(text);
        tr.appendChild(th);
    }
    const th = document.createElement("th");
    const text = document.createTextNode("Update/Delete");
    th.appendChild(text);
    tr.appendChild(th);
    thead.appendChild(tr);
    return thead;
}

//setter inn de forskjellige kollonene i en rad i hoved delen av tabell
function colBody(i, j, k){
    const th = document.createElement("th");
    const editBox = document.createElement("input");
    editBox.defaultValue = data.data[i].data[j][k];
    th.appendChild(editBox);
    return th;
}

//gjer funksjon til delete knappen
function eventDeleteButton(button, i, j){
    data = allData;
    button.addEventListener("click", () => {
        content = {database: data.names[i].replace(/\s/g,''),
                    id: data.data[i].data[j][0]}
        var request = new Request("/delete");
        fetch(request,{
            method: "POST",
            body: JSON.stringify(content),
            headers: {"Content-Type": "application/json"}
        }).then(refresh())
    });
}

//sette opp oppdatering og sletting knapp i en div
function updateDelete(i, j){
    const div = document.createElement("div");
    const updateButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const deleteText = document.createTextNode("delete");
    const updateText = document.createTextNode("update");
    updateButton.appendChild(updateText);
    deleteButton.appendChild(deleteText);
    eventDeleteButton(deleteButton, i, j);
    div.appendChild(updateButton);
    div.appendChild(deleteButton);
    return div;
}

//setter opp hver rad i tabelen
function rowBody(i, j){
    const tr = document.createElement("tr");
    let th = document.createElement("th");
    const text = document.createTextNode(data.data[i].data[j][0]);
    th.appendChild(text);
    tr.appendChild(th);
    for(let k = 1; k < data.data[i].data[j].length; k++){
        tr.appendChild(colBody(i, j, k));
    }
    th = document.createElement("th");
    th.appendChild(updateDelete(i, j));
    tr.appendChild(th);
    return tr;
}

//lager hoved delen i tabelen
function createTableBody(i){
    const tbody = document.createElement("tbody");
    for(let j = 0; j < data.data[i].data.length; j++){
        tbody.appendChild(rowBody(i, j));
    }
    return tbody;
}

//lager knappen for å legge til ting
function addButton(i){
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
            editbox = document.querySelector("." + data.names[i].replace(/\s/g,'') + data.data[i].dataValues[j]);
            content.data.push(editbox.value);
        }
        var request = new Request("/create");
        fetch(request,{
            method: "POST",
            body: JSON.stringify(content),
            headers: {"Content-Type": "application/json"}
        }).then(refresh())
    });
    const addButtonText = document.createTextNode("Add");
    button.appendChild(addButtonText);
    div.appendChild(button);
    return div;
}

//lager foot-en av tabelen
function createTableFoot(i){
    const tr = document.createElement("tr");
    th = document.createElement("th");
    const textConst = document.createTextNode("auto");
    th.appendChild(textConst);
    tr.appendChild(th);

    for(let j = 1; j < data.data[i].Names.length; j++){
        const th = document.createElement("th");
        const editBox = document.createElement("input");
        editBox.classList.add(data.names[i].replace(/\s/g,'') + data.data[i].dataValues[j]);
        th.appendChild(editBox);
        tr.appendChild(th);
    }

    th = document.createElement("th");
    th.appendChild(addButton(i));
    tr.appendChild(th);
    return tr;
}

//lager alle tabelene
function createTables(){
    data = allData;
    const tableContainer = document.querySelector(".table-container");
    for(let i = 0; i < data.names.length; i++){
        tableContainer.appendChild(createInnerTables(i));
    }
}

//lager nav baren
function createNav(){
    data = allData;
    const navBar = document.querySelector(".nav-bar");
    for(let i = 0; i < data.names.length; i++){
        type = document.createElement("button");
        text = document.createTextNode(data.names[i]);
        type.appendChild(text);
        navBar.appendChild(type);
        type.addEventListener("click", () => {
            const brukerTable = document.querySelector("#" + data.names[i].replace(/\s/g,''));
            const allTables = document.querySelectorAll("table");
            for(let j = 0; j < allTables.length; j++){
                allTables[j].classList.remove("visible");
            }
            brukerTable.classList.add("visible")
        });
    }
}

//kjører funksjonen for å lage nav bar og tabelene
function createAll(){
    createTables();
    createNav();
}

//henter ut data fra databasen
function getDatabases(id = undefined){
    url = "/All"
    fetch(url, {method: "GET"}).then(response=>response.json()).then(data=>{
        allData = data;
        createAll();
        if(id){
            const makeVisible = document.getElementById(id);
            makeVisible.classList.add("visible");
        }
    });
}

function deleteAllChilds(element){
    while(element.firstChild){ //kjører slett siste unge helt til først unge ikke eksisterer mer, så den sletter alle
        element.removeChild(element.lastChild);
    }
}

//laseter inn sida på nytt etter noe har blit endret på
function refresh(){
    idOfVisible = document.querySelector(".visible").id;
    const navBar = document.querySelector(".nav-bar");
    const tableContainer = document.querySelector(".table-container");
    deleteAllChilds(navBar);
    deleteAllChilds(tableContainer);
    getDatabases(idOfVisible);
}

getDatabases();