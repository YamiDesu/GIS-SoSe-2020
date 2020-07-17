"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSide = void 0;
const Http = require("http");
const url = require("url");
const mongo_1 = require("./mongo");
//import {testThis } from "mongo.js";
var ServerSide;
(function (ServerSide) {
    console.log("Starting server");
    let port = Number(process.env.PORT);
    if (!port)
        port = 8100;
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);
    let myArgs = process.argv.slice(2);
    let whichDB = myArgs[0];
    mongo_1.handleMongo.connectDB(whichDB);
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        console.log("https://theoneandgis.herokuapp.com" + `${_request.url}`);
        let myData = url.parse(`${_request.url}`, true);
        let myQuery = myData.query;
        let myQueryString = JSON.stringify(myQuery);
        //let splitString: string = (<string>_request.url).slice(0, 9);
        _response.setHeader("content-type", "application/json");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url.includes("/mongo")) {
            console.log(" myQueryString: ", myQueryString);
            console.log(" <string>_request.url: ", _request.url);
            await mongoAction(_response, myQueryString, _request.url);
        }
        _response.end();
    }
    async function mongoAction(_response, _query, _command) {
        if (_command.includes("/send")) {
            let myJsonObj = JSON.parse(_query);
            mongo_1.handleMongo.insertData(myJsonObj);
            _response.write(_query);
        }
        if (_command.includes("/retrieve")) {
            let value = await mongo_1.handleMongo.findCollection();
            let handlThis = JSON.stringify(value);
            _response.write(handlThis);
        }
        if (_command.includes("/remove")) {
            let myJsonObj = JSON.parse(_query);
            await mongo_1.handleMongo.removeData(myJsonObj);
            _response.write(`{"":""}`);
        }
    }
})(ServerSide = exports.ServerSide || (exports.ServerSide = {}));
//# sourceMappingURL=server.js.map