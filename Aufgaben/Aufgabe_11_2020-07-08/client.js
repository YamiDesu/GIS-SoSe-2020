"use strict";
//mongodb + srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority
//http://localhost:8100
//https://theoneandgis.herokuapp.com
var clientSide;
(function (clientSide) {
    document.querySelector("#abschicken").addEventListener("click", sendData);
    function sendData() {
        communicate("https://theoneandgis.herokuapp.com", "mongo", "send", "");
    }
    document.querySelector("#abfragen").addEventListener("click", retrieveData);
    function retrieveData() {
        communicate("https://theoneandgis.herokuapp.com", "mongo", "retrieve", "");
    }
    function removeData(_event) {
        let target = _event.target;
        /*console.log(target.getAttribute("thisEntry")! );
        let entry: string = target.getAttribute("thisEntry")!;
        console.log("entry: ", entry);*/
        let id = target.getAttribute("thisEntry");
        communicate("https://theoneandgis.herokuapp.com", "mongo", "remove", id);
    }
    async function communicate(_baseUrl, _aim, _task, _id) {
        let formData = new FormData(document.forms[0]);
        let url = "";
        if (_id == "") {
            //tslint:disable-next-line: no-any
            let query = new URLSearchParams(formData);
            url = _baseUrl + "/" + _aim + "/" + _task + "?" + query.toString();
        }
        else {
            url = _baseUrl + "/" + _aim + "/" + _task + "?" + "_id=" + `${_id}`;
        }
        let response = await fetch(url);
        let jsonResponse = await response.json();
        if (_task == "send") {
            let jsonString = JSON.stringify(jsonResponse);
            document.querySelector("#divResponse").innerHTML = jsonString;
            //console.log(jsonResponse[0].vorname + " " + jsonResponse[0].nachname + " " + jsonResponse[0].geburtsjahr);
        }
        if (_task == "retrieve") {
            let jsonString = formatCollection(jsonResponse);
            document.querySelector("#divDatabase").innerHTML = jsonString;
            addRemoveFunction();
        }
        document.getElementById("myForm").reset();
    }
    function formatCollection(_jsonResponse) {
        let jsonString = "";
        for (let index = 0; index <= _jsonResponse.length; index++) {
            if (_jsonResponse[index]) {
                jsonString += `<button class="removeButton" thisEntry=${(JSON.stringify(_jsonResponse[index]._id))}> Delete Entry </button><br>`;
                let current = _jsonResponse[index];
                for (let key in current) {
                    jsonString += key + ": " + JSON.stringify(current[key]) + "<br>";
                }
                jsonString += "<br>";
            }
        }
        return jsonString;
    }
    function addRemoveFunction() {
        let removeButtons = document.querySelectorAll(".removeButton");
        for (const iterator of removeButtons)
            iterator.addEventListener("click", removeData);
    }
})(clientSide || (clientSide = {}));
//# sourceMappingURL=client.js.map