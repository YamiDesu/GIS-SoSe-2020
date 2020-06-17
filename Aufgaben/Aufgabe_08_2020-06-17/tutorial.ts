
import * as HTTp from "http";
import * as Url from "url";

export namespace tutorial08 {

let formData: FormData = new FormData(document.forms[0]);

console.log(formData.get("vorname"));

for (let entry of formData) {
    console.log(entry);
    console.log("name: " + entry[0]);
    console.log("value: " + entry[1]);
}

// Trennlinie

let url: string = "https://WeOwnTheWorld.server/path/file";
let query: URLSearchParams = new URLSearchParams(<any>formData);
url += url + "?" + query.toString();
// await fetch(url);

}
