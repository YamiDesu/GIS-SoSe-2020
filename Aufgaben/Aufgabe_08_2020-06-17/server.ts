import * as Http from "http";

export namespace A008Server {
    console.log("Starting server");                                                                     // Ausgabe in der Server-Console
    let port: number = Number(process.env.PORT);                                                        // Deklaration der number "port" mit einem Port aus der Umgebungsvariable,
                                                                                                        // der als numerisches Objekt abgespeichert werden soll
    if (!port)                                                                                          // "Wenn kein Port vergeben wurde...
        port = 8100;                                                                                    // ...verwende den Port 8100"

    let server: Http.Server = Http.createServer();                                                      // Der Server wird aufgesetzt
    server.addListener("request", handleRequest);                                                       // Listener für wenn Serveranfragen reinkommen
    server.addListener("listening", handleListen);                                                      // Listener für wenn der Server startet
    server.listen(port);                                                                                // Achtet auf Anfragen, die durch den Port durchkommen

    function handleListen(): void {                                                                     // wird ausgeführt, wenn der Server gestartet wird und eine Abfrage erwartet
        console.log("Listening");                                                                       // Ausgabe in der Server-Console
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {      // wird ausgeführt, wenn eine Serveranfrage eintrifft
        console.log("https://theoneandgis.herokuapp.com" + `${_request.url}`);                          // Ausgabe in der Server-Console
        // console.log("-------------");
        // console.log("I hear voices!");

        _response.setHeader("content-type", "text/html; charset=utf-8");                                // Der Datentyp der Antwort wird festgelegt
        _response.setHeader("Access-Control-Allow-Origin", "*");                                        // erlaubt beliebigen Anfragen aus dem Netz, die Antwort zu lesen

        _response.write(_request.url);                                                                  // Die Antwort wird mit einem string (in diesem Fall die URL) beschrieben

        _response.end();                                                                                // deaktiviert den Server bis zur nächsten Anfrage
    }
}