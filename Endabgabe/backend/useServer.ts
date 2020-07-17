import * as Http from "http";
import * as url from "url";
import { ParsedUrlQuery } from "querystring";
import { handleMongo as useMongo } from "./useMongo";

//import {testThis } from "mongo.js";

export namespace ServerSide {

    console.log("Starting server");
    let port: number = Number(process.env.PORT);
    if (!port)
        port = 8100;

    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);

    let myArgs: string[] = process.argv.slice(2);
    let whichDB: string = myArgs[0];
    useMongo.connectDB(whichDB);

    function handleListen(): void {
        console.log("Your server Listening");
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        console.log("https://theoneandgis.herokuapp.com" + `${_request.url}`);

        let myData: url.UrlWithParsedQuery = url.parse(`${_request.url}`, true);
        let myQuery: ParsedUrlQuery = myData.query;
        let myQueryString: string = JSON.stringify(myQuery);
        let responseUrlString: string = <string>_request.url;
        //let splitString: string = (<string>_request.url).slice(0, 9);
        let post: useMongo.ProduktObj = {};

        _response.setHeader("content-type", "application/json");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("_request.method", _request.method);
        if (_request.method == "POST") {
            let body: string = "";
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

    async function handleAction(_request: Http.IncomingMessage, _response: Http.ServerResponse, _myQueryString: string, _responseUrlString: string, _orderObj: useMongo.ProduktObj): Promise<void> {
        console.log("handleAction", _orderObj);
        let whichCollection: string = "products";
        if ( _responseUrlString.includes("/products") ) {
            whichCollection = "products";
        }
        if (_responseUrlString.includes("/orders")) {
            whichCollection = "products";
        }
        
        if ( _responseUrlString.includes("/mongo") ) {
            await mongoAction(_response, _myQueryString, whichCollection, _responseUrlString, _orderObj);
        }
    }

    async function mongoAction(_response: Http.ServerResponse, _query: string, _whichCollection: string, _command: string, _orderObj: useMongo.ProduktObj): Promise<void> {
        let myJsonObj: useMongo.ProduktObj = JSON.parse(_query);
        console.log("mongoAction", _orderObj);
        
        if (_command.includes("/findCollection")) {
            let value: useMongo.ProduktObj[] = await useMongo.findCollection(_whichCollection);
            let handlThis: string = JSON.stringify(value);
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
            useMongo.insertEntry( _whichCollection, myJsonObj);
            _response.write(_query); // technically no response
        }
        if (_command.includes("/removeEntry")) {
            await useMongo.removeEntry(_whichCollection, myJsonObj);
            _response.write(`{"":""}`); // technically no response
        }
    }

}
