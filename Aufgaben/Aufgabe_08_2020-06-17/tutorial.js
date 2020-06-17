"use strict";
var tutorial08;
(function (tutorial08) {
    /*console.log(formData.get("vorname"));

    for (let entry of formData) {
        console.log(entry);
        console.log("name: " + entry[0]);
        console.log("value: " + entry[1]);
    }*/
    // Trennlinie
    document.querySelector("#theButton").addEventListener("click", communicate);
    //communicate("https://theoneandgis.herokuapp.com/");
    async function communicate() {
        // let response: Response = await fetch(_url);
        // let jsonObj = await response.json();
        let formData = new FormData(document.forms[0]);
        let url = "https://theoneandgis.herokuapp.com/";
        let query = new URLSearchParams(formData);
        url += "?" + query.toString();
        let response = await fetch(url);
        let theAnswer = await response.url;
        // await fetch(url);
        console.log(theAnswer);
    }
    console.log("hello");
})(tutorial08 || (tutorial08 = {}));
//# sourceMappingURL=tutorial.js.map