const myHeader = new Headers();
myHeader.append('Accept', 'application/json');

url = 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=4342012'

let fetchData = { 
    method: 'GET', 
    headers: myHeader
}

fetch(url, fetchData)
.then((response) => response.json())
.then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.log(`Data failed to be fetched: ${error}`);
    });







const myHeader3 = new Headers();
myHeader.append('Accept', 'application/json');

let url3 = 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Condition?patient=4342012'

let fetchData3 = { 
    method: 'GET', 
    headers: myHeader
}

fetch(url3, fetchData3)
.then((response) => response.json())
.then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.log(`Data failed to be fetched: ${error}`);
    });
