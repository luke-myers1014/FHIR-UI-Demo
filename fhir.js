const conditionsButton = document.getElementById("conditionButton").addEventListener("click", preFetch),
      patientURL = "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=4342012",
      conditionsURL = "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Condition?patient=4342012",
      pubMedURL = "https://www.ncbi.nlm.nih.gov/pubmed/?term=",
      myHeader = new Headers(),
      patientInfoSection = document.getElementById("info"),
      conditionsSection = document.getElementById("conditions");

myHeader.append("Accept", "application/json");

let numClicks = 0,
    conditionsTable = createNode("table"),
    allConditions = [],
    activeConditions = [],
    patient = {
        name: "name",
        gender: "gender",
        birthDate: "date of birth"
    },
    fetchData = {
        method: 'GET',
        headers: myHeader
    };

function createNode(element){
    return document.createElement(element);
}
function append(parent, child){
    return parent.appendChild(child);
}
function preFetch(){
    if(numClicks === 1){
        alert("Already attempted to retrieve the patient's data! Please refresh the page to try again.");
    }else{
        fetchPatientInfo();
        fetchConditions();
        numClicks = 1;
    }
}
function fetchPatientInfo(){
    let span = createNode("span");
    append(patientInfoSection, span);
    span.innerHTML = "<br><br>Retrieving patient's information...";

    fetch(patientURL, fetchData)
    .then((response) => response.json())
    .then(function(data) {
        patient.name = data.entry[0].resource.name[0].text;
        patient.gender = data.entry[0].resource.gender;
        patient.birthDate = data.entry[0].resource.birthDate;
        span.innerHTML = `<br><br><b>Name:</b> ${patient.name}<br><b>Gender:</b> ${patient.gender}<br><b>Date of Birth:</b> ${patient.birthDate}`;
    })
    .catch(function(error) {
        span.innerHTML = "<br><br>Failed to retrieve patient's information.";
        alert(`Failed to retrieve patient's information: ${error}`);
    });
}
function fetchConditions(){
    let span = createNode("span");
    append(conditionsSection, span);
    span.innerHTML = "<br><br>Retrieving patient's active conditions...";

    fetch(conditionsURL, fetchData)
    .then((response) => response.json())
    .then(function(data) {
        allConditions = data.entry;

        for(let i = 0; i < allConditions.length; i++){
            if(allConditions[i].resource.clinicalStatus === "active"){
                let condition = {
                    name: allConditions[i].resource.code.text,
                    dateRecorded: allConditions[i].resource.dateRecorded
                };
                condition.link = pubMedURL + condition.name;
                activeConditions.push(condition);
            }
        }
        span.innerHTML = `<br><br>${activeConditions.length} of ${patient.name}'s ${allConditions.length} conditions are active. See table below.<br><br>`;
        let sortButton = createNode("Button");
        append(conditionsSection, sortButton);
        sortButton.addEventListener("click", sortActiveConditionsByDate);
        sortButton.innerText = "Sort by Date";
        displayActiveConditions();
    })
    .catch(function(error) {
        span.innerHTML = "<br><br>Failed to retrieve patient's active conditions.";
        alert(`Failed to retrieve patient's conditions: ${error}`);
    });
}
function displayActiveConditions(){
    let headingRow = createNode("tr"),
        nameHeading = createNode("th"),
        dateHeading = createNode("th"),
        linkHeading = createNode("th");
    nameHeading.innerText = "Name";
    dateHeading.innerText = "Date Recorded";
    linkHeading.innerText = "Link to PubMed Search";
    append(conditionsSection, conditionsTable);
    append(conditionsTable, headingRow);
    append(headingRow, nameHeading);
    append(headingRow, dateHeading);
    append(headingRow, linkHeading);

    for(let i = 0; i < activeConditions.length; i++){
        let condition = createNode("tr"),
            name = createNode("td"),
            date = createNode("td"),
            link = createNode("a");
        name.innerText = activeConditions[i].name;
        date.innerText = activeConditions[i].dateRecorded;
        link.innerHTML = "More Information";
        link.href = activeConditions[i].link;
        append(conditionsTable, condition);
        append(condition, name);
        append(condition, date);
        append(condition, link);
    }
}
function sortActiveConditionsByDate(){
    conditionsTable.parentNode.removeChild(conditionsTable);
    activeConditions.sort(sortDates);
    conditionsTable = createNode("table");
    displayActiveConditions();
}
function sortDates(a, b){
    const dateA = a.dateRecorded;
    const dateB = b.dateRecorded;
    let comparison = 0;

    if(dateA > dateB){
        comparison = 1;
    } else if(dateA < dateB){
        comparison = -1;
    }
    return comparison;
}
