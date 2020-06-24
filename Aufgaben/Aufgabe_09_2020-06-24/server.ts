import * as Http from "http";
import * as url from "url";
import { ParsedUrlQuery } from "querystring";

export namespace ServerSide {
    console.log("Starting server");                                                                    
    let port: number = Number(process.env.PORT);                                                        
    // der als numerisches Objekt abgespeichert werden soll
    if (!port)                                                                                          
        port = 8100;                                                                                    

    let server: Http.Server = Http.createServer();                                                      
    server.addListener("request", handleRequest);                                                       
    server.addListener("listening", handleListen);                                                      
    server.listen(port);                                                                                

    function handleListen(): void {                                                                     
        console.log("Listening");                                                                       
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {     
        console.log("http://localhost:8100" + `${_request.url}`);   
        
        let myData: url.UrlWithParsedQuery = url.parse(`${_request.url}`, true);
        let myQuery: ParsedUrlQuery = myData.query;
        let splitThis: string = (<string>_request.url).slice(0 , 5);
        let myJsonString: string = JSON.stringify(myQuery);
        
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
}
