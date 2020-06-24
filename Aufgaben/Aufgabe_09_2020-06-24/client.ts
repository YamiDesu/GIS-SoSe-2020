
namespace clientSide {

    (<HTMLButtonElement>document.querySelector("#getJson")).addEventListener("click", communicateJson);
    (<HTMLButtonElement>document.querySelector("#getHtml")).addEventListener("click", communicateHtml);

    //communicate("https://theoneandgis.herokuapp.com/");

    async function communicate(_path: string): Promise<void> {

        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://theoneandgis.herokuapp.com" + _path;
        //let url: string = "http://localhost:8100" + _path;
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        url += "?" + query.toString();

        let response: Response = await fetch(url);
        let responseUrl: string;
    
        if (_path == "/json") {
            responseUrl = await response.json();
            console.log(responseUrl);
            (<HTMLDivElement>document.getElementById("htmlResponse")).innerHTML = JSON.stringify(responseUrl);
        }

        if (_path == "/html") {
            let responseUrl: string = await response.text();
            console.log("html-log: " + responseUrl);
            (<HTMLDivElement>document.getElementById("htmlResponse")).innerHTML = responseUrl;
        }       
    }

    function communicateJson(): void {
        communicate("/json");
    }
    function communicateHtml(): void {
        communicate("/html");
    }

}













/*namespace tutorial09 {

    /*console.log(formData.get("vorname"));

    for (let entry of formData) {
        console.log(entry);
        console.log("name: " + entry[0]);
        console.log("value: " + entry[1]);
    }

    // Trennlinie

    (<HTMLButtonElement>document.querySelector("#getHtml")).addEventListener("click", startCommunication);

    function startCommunication(): void {
        communicate("http://localhost:8100");
    }

    async function communicate(_url: RequestInfo): Promise<void> {

        // let response: Response = await fetch(_url);
        // let jsonObj = await response.json();

        let formData: FormData = new FormData(document.forms[0]);
        let formquery: URLSearchParams = new URLSearchParams(<any>formData);
        _url += "?" + formquery.toString();
        console.log("_url: " + _url);
        //let url: string = "https://theoneandgis.herokuapp.com/";
        //let query: URLSearchParams = new URLSearchParams(<any>formData);

        //url += "?" + query.toString();

        //debugger;

        //let response: Response = await fetch(_url);
        let response: Response = await fetch("Data.json");
        console.log("response: " + response);
        console.log(response);
        let theAnswer: string = await response.text;
        //let text: string = theAnswer
        

        console.log("theAnswer: " + theAnswer);
        //let query: URLSearchParams = new URLSearchParams(theAnswer);
        //console.log(query.toString());
        //console.log( new URLSearchParams(theAnswer).values() );
        //console.log(query.keys() );
        //let queryvorname: string = query.get("/?vorname")!;
        //let querynachname: string = query.get("nachname")!;

        //console.log(queryvorname);
        //console.log(querynachname);

        (<HTMLDivElement>document.querySelector("#htmlResponse")).innerHTML = `${theAnswer}`;


        // await fetch(url);
        console.log(theAnswer);
    }

    console.log("hello");

}*/


