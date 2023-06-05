data = "nothing";
url = "/ProsjektType"
response = fetch(url, {
    method: "GET"
    // body: JSON.stringify(data)
}).then(response => {
    console.log(response.json());
})
