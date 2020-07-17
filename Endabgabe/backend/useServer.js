"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSide = void 0;
const Http = require("http");
const url = require("url");
const useMongo_1 = require("./useMongo");
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
    useMongo_1.handleMongo.connectDB(whichDB);
    function handleListen() {
        console.log("Your server Listening");
    }
    async function handleRequest(_request, _response) {
        console.log("https://theoneandgis.herokuapp.com" + `${_request.url}`);
        let myData = url.parse(`${_request.url}`, true);
        let myQuery = myData.query;
        let myQueryString = JSON.stringify(myQuery);
        let responseUrlString = _request.url;
        //let splitString: string = (<string>_request.url).slice(0, 9);
        let post = {};
        _response.setHeader("content-type", "application/json");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("_request.method", _request.method);
        if (_request.method == "POST") {
            let body = "";
            _request.on("data", data => {
                body += data;
            });
            _request.on("end", async () => {
                post = JSON.parse(body);
                console.log("post: ", post);
                post = await JSON.parse(body);
                responseUrlString = "/mongo/orders/insertEntry";
                handleAction(_request, _response, myQueryString, responseUrlString, post);
            });
        }
        else {
            await handleAction(_request, _response, myQueryString, responseUrlString, {});
        }
        _response.end();
    }
    async function handleAction(_request, _response, _myQueryString, _responseUrlString, _orderObj) {
        console.log("handleAction", _orderObj);
        let whichCollection = "products";
        if (_responseUrlString.includes("/products")) {
            whichCollection = "products";
        }
        if (_responseUrlString.includes("/orders")) {
            whichCollection = "products";
        }
        if (_responseUrlString.includes("/mongo")) {
            await mongoAction(_response, _myQueryString, whichCollection, _responseUrlString, _orderObj);
        }
    }
    async function mongoAction(_response, _query, _whichCollection, _command, _orderObj) {
        let myJsonObj = JSON.parse(_query);
        console.log("mongoAction", _orderObj);
        if (_command.includes("/findCollection")) {
            let value = await useMongo_1.handleMongo.findCollection(_whichCollection);
            let handlThis = JSON.stringify(value);
            _response.write(handlThis);
        }
        if (_command.includes("/findEntry")) {
            console.log("/findEntry");
        }
        /*if (_command.includes("/insertObject")) {
            await useMongo.insertObject(_whichCollection, _orderObj);
            //_response.write(_query); // technically no response
        }*/
        if (_command.includes("/insertEntry")) {
            useMongo_1.handleMongo.insertEntry(_whichCollection, myJsonObj);
            _response.write(_query); // technically no response
        }
        if (_command.includes("/removeEntry")) {
            await useMongo_1.handleMongo.removeEntry(_whichCollection, myJsonObj);
            _response.write(`{"":""}`); // technically no response
        }
    }
})(ServerSide = exports.ServerSide || (exports.ServerSide = {}));
//# sourceMappingURL=useServer.js.map