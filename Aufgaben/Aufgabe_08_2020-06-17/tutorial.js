"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorial08 = void 0;
var tutorial08;
(function (tutorial08) {
    let formData = new FormData(document.forms[0]);
    console.log(formData.get("vorname"));
    for (let entry of formData) {
        console.log(entry);
        console.log("name: " + entry[0]);
        console.log("value: " + entry[1]);
    }
    // Trennlinie
    let url = "https://WeOwnTheWorld.server/path/file";
    let query = new URLSearchParams(formData);
    url += url + "?" + query.toString();
    // await fetch(url);
})(tutorial08 = exports.tutorial08 || (exports.tutorial08 = {}));
//# sourceMappingURL=tutorial.js.map