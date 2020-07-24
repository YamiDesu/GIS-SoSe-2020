"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSide = void 0;
const Http = require("http");
const url = require("url");
const useMongo_1 = require("./useMongo");
//mongodb + srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority
//http://localhost:8100
//https://theoneandgis.herokuapp.com
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
        console.log("http://web-url" + `${_request.url}`); // Hier müsste ggf. auch zu Heruko gewechselt werden, wenn es von Bedeutung ist
        let myData = url.parse(`${_request.url}`, true);
        let myQuery = myData.query;
        console.log("myQuery", myQuery);
        let myQueryObject = myQuery;
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
            await handleAction(_request, _response, myQueryString, responseUrlString, myQueryObject);
            _response.end();
        }
    }
    async function handleAction(_request, _response, _myQueryString, _responseUrlString, _orderObj) {
        console.log("handleAction", _orderObj);
        let whichCollection = "";
        if (_responseUrlString.includes("/products")) {
            whichCollection = "products";
        }
        if (_responseUrlString.includes("/orders")) {
            whichCollection = "orders";
        }
        if (_responseUrlString.includes("/mongo")) {
            await mongoAction(_response, _myQueryString, whichCollection, _responseUrlString, _orderObj);
        }
        console.log("end");
        _response.end();
    }
    async function mongoAction(_response, _query, _whichCollection, _command, _orderObj) {
        let myJsonObj = JSON.parse(_query);
        console.log("mongoAction", _orderObj);
        if (_command.includes("/findCollection")) {
            let value = await useMongo_1.handleMongo.findCollection(_whichCollection);
            let handleThis = JSON.stringify(value);
            console.log("handleThis", handleThis);
            _response.write(handleThis);
        }
        if (_command.includes("/findEntry")) {
            let foundEntry = await useMongo_1.handleMongo.findEntry(_whichCollection, _orderObj);
            console.log("foundEntry", foundEntry);
            _response.write(JSON.stringify(foundEntry));
        }
        if (_command.includes("/updateEntry")) {
            useMongo_1.handleMongo.updateEntry(_whichCollection, _orderObj);
            _response.write(_query); // technically no response
        }
        /*if (_command.includes("/insertObject")) {
            await useMongo.insertObject(_whichCollection, _orderObj);
            //_response.write(_query); // technically no response
        }*/
        if (_command.includes("/insertEntry")) {
            useMongo_1.handleMongo.insertEntry(_whichCollection, _orderObj); //myJsonObj
            _response.write(_query); // technically no response
        }
        if (_command.includes("/removeEntry")) {
            await useMongo_1.handleMongo.removeEntry(_whichCollection, myJsonObj);
            _response.write(`{"":""}`); // technically no response
        }
        if (_command.includes("/countEntries")) {
            let countNumber = await useMongo_1.handleMongo.countEntries(_whichCollection);
            _response.write(`{"orderID":"${countNumber}"}`);
        }
    }
})(ServerSide = exports.ServerSide || (exports.ServerSide = {}));
//# sourceMappingURL=useServer.js.map