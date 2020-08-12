import * as Http from "http";
import * as url from "url";
import { ParsedUrlQuery } from "querystring";
import { handleMongo } from "./mongo";

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
    handleMongo.connectDB(whichDB);


    function handleListen(): void {
        console.log("Listening");
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        console.log("https://theoneandgis.herokuapp.com" + `${_request.url}`);

        let myData: url.UrlWithParsedQuery = url.parse(`${_request.url}`, true);
        let myQuery: ParsedUrlQuery = myData.query;
        let myQueryString: string = JSON.stringify(myQuery);
        //let splitString: string = (<string>_request.url).slice(0, 9);

        _response.setHeader("content-type", "application/json");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        if ( (<string>_request.url).includes("/mongo") ) {  
            console.log(" myQueryString: ", myQueryString);
            console.log(" <string>_request.url: ", <string>_request.url);
            await mongoAction( _response, myQueryString , (<string>_request.url) );
        }

        _response.end();
    }

    async function mongoAction(_response: Http.ServerResponse, _query: string, _command: string): Promise<void> {
        if (_command.includes("/send")) {
            let myJsonObj: handleMongo.Personalien = JSON.parse(_query);
            handleMongo.insertData(myJsonObj);
            _response.write(_query);
        }

        if ( _command.includes("/retrieve") ) {
            let value: handleMongo.Personalien[] = await handleMongo.findCollection();
            let handlThis: string = JSON.stringify(value);
            _response.write(handlThis);
        }

        if ( _command.includes("/remove") ) {
            let myJsonObj: handleMongo.Personalien = JSON.parse(_query);
            await handleMongo.removeData(myJsonObj);
            _response.write(`{"":""}`);
        }
    }

}
