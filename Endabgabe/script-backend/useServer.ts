import * as Http from "http";
import * as url from "url";
import { ParsedUrlQuery } from "querystring";
import { handleMongo as useMongo } from "./useMongo";

//mongodb + srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority
//http://localhost:8100
//https://theoneandgis.herokuapp.com

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
        console.log("http://web-url" + `${_request.url}`); // Hier müsste ggf. auch zu Heruko gewechselt werden, wenn es von Bedeutung ist

        let myData: url.UrlWithParsedQuery = url.parse(`${_request.url}`, true);
        let myQuery: ParsedUrlQuery = myData.query;
        console.log("myQuery", myQuery);
        let myQueryObject: useMongo.ProduktObj = myQuery;
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
            await handleAction(_request, _response, myQueryString, responseUrlString, myQueryObject);
            _response.end();
        }       
    }

    async function handleAction(_request: Http.IncomingMessage, _response: Http.ServerResponse, _myQueryString: string, _responseUrlString: string, _orderObj: useMongo.ProduktObj): Promise<void> {
        console.log("handleAction", _orderObj);
        let whichCollection: string = "";
        if ( _responseUrlString.includes("/products") ) {
            whichCollection = "products";
        }
        if (_responseUrlString.includes("/orders")) {
            whichCollection = "orders";
        }
        
        if ( _responseUrlString.includes("/mongo") ) {
            await mongoAction(_response, _myQueryString, whichCollection, _responseUrlString, _orderObj);
        }
        console.log("end");
        _response.end();
    }

    async function mongoAction(_response: Http.ServerResponse, _query: string, _whichCollection: string, _command: string, _orderObj: useMongo.ProduktObj): Promise<void> {
        let myJsonObj: useMongo.ProduktObj = JSON.parse(_query);
        console.log("mongoAction", _orderObj);
        
        if (_command.includes("/findCollection")) {
            let value: useMongo.ProduktObj[] = await useMongo.findCollection(_whichCollection);
            let handleThis: string = JSON.stringify(value);
            console.log("handleThis", handleThis);
            _response.write(handleThis);
        }
        if (_command.includes("/findEntry")) {
            let foundEntry: useMongo.ProduktObj = await useMongo.findEntry(_whichCollection, _orderObj);
            console.log("foundEntry", foundEntry);
            _response.write(JSON.stringify(foundEntry));
        }
        if (_command.includes("/updateEntry")) {
            useMongo.updateEntry(_whichCollection, _orderObj);
            _response.write(_query); // technically no response
        }
        /*if (_command.includes("/insertObject")) {
            await useMongo.insertObject(_whichCollection, _orderObj);
            //_response.write(_query); // technically no response
        }*/
        if (_command.includes("/insertEntry")) {
            useMongo.insertEntry(_whichCollection, _orderObj); //myJsonObj
            _response.write(_query); // technically no response
        }
        if (_command.includes("/removeEntry")) {
            await useMongo.removeEntry(_whichCollection, myJsonObj);
            _response.write(`{"":""}`); // technically no response
        }
        if (_command.includes("/countEntries")) {
            let countNumber: number = await useMongo.countEntries(_whichCollection);
            _response.write(`{"orderID":"${countNumber}"}`);
        }
    }

}
