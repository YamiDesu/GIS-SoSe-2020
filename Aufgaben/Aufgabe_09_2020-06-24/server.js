"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSide = void 0;
const Http = require("http");
const url = require("url");
var ServerSide;
(function (ServerSide) {
    console.log("Starting server");
    let port = Number(process.env.PORT);
    // der als numerisches Objekt abgespeichert werden soll
    if (!port)
        port = 8100;
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);
    function handleListen() {
        console.log("Listening");
    }
    function handleRequest(_request, _response) {
        console.log("http://localhost:8100" + `${_request.url}`);
        let myData = url.parse(`${_request.url}`, true);
        let myQuery = myData.query;
        let splitThis = _request.url.slice(0, 5);
        let myJsonString = JSON.stringify(myQuery);
        // Damit ich im Hinterkopf behalte, dass das so funktioniert
        // console.log("myQuery.vorname: " + myQuery.vorname );
        // console.log("myQuery.nachname: " + myQuery.nachname);
        if (splitThis == "/html") {
            _response.setHeader("content-type", "application/json");
            _response.setHeader("Access-Control-Allow-Origin", "*");
        }
        else if (splitThis == "/json") {
            _response.setHeader("content-type", "text/html");
            _response.setHeader("Access-Control-Allow-Origin", "*");
        }
        console.log(myJsonString);
        _response.write(myJsonString);
        _response.end();
    }
})(ServerSide = exports.ServerSide || (exports.ServerSide = {}));
//# sourceMappingURL=server.js.map