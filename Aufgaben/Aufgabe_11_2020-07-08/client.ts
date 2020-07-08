//mongodb + srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority
//http://localhost:8100
//https://theoneandgis.herokuapp.com

namespace clientSide {

    interface Personalien {
        [type: string]: string | string[] | number | undefined;
    }

    (<HTMLButtonElement>document.querySelector("#abschicken")).addEventListener("click", sendData);
    function sendData(): void {
        communicate("https://theoneandgis.herokuapp.com", "mongo", "send", "");
    }

    (<HTMLButtonElement>document.querySelector("#abfragen")).addEventListener("click", retrieveData);
    function retrieveData(): void {
        communicate("https://theoneandgis.herokuapp.com", "mongo", "retrieve", "");
    }

    function removeData(_event: Event): void {
        let target: HTMLElement = (<HTMLElement>_event.target);
        /*console.log(target.getAttribute("thisEntry")! );
        let entry: string = target.getAttribute("thisEntry")!;
        console.log("entry: ", entry);*/
        let id: string = target.getAttribute("thisEntry")!;
        communicate("https://theoneandgis.herokuapp.com", "mongo", "remove", id);
    }

    interface Personalien {
        vorname: string;
        nachname: string;
        geburtsjahr: number;
    }
    
    async function communicate(_baseUrl: string, _aim: string , _task: string, _id: string): Promise<void> {    
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "";
        if (_id == "") {
            //tslint:disable-next-line: no-any
            let query: URLSearchParams = new URLSearchParams(<any>formData);
            url = _baseUrl + "/" + _aim + "/" + _task + "?" + query.toString();  
        } else {
            url = _baseUrl + "/" + _aim + "/" + _task + "?" + "_id=" + `${_id}`;  
        }
        let response: Response = await fetch(url);        
        let jsonResponse: Personalien[] = await response.json();
        
        if (_task == "send") {
            let jsonString: string = JSON.stringify(jsonResponse);
            (<HTMLDivElement>document.querySelector("#divResponse")).innerHTML = jsonString;
            //console.log(jsonResponse[0].vorname + " " + jsonResponse[0].nachname + " " + jsonResponse[0].geburtsjahr);
        }
        if (_task == "retrieve") {
            let jsonString: string = formatCollection(jsonResponse);
            (<HTMLDivElement>document.querySelector("#divDatabase")).innerHTML = jsonString;
            addRemoveFunction();
        }

        (<HTMLFormElement>document.getElementById("myForm")).reset();
    }

    function formatCollection(_jsonResponse: Personalien[]): string {
        let jsonString: string = "";
        for (let index: number = 0; index <= _jsonResponse.length; index++) {
            if (_jsonResponse[index]) {
                jsonString += `<button class="removeButton" thisEntry=${(JSON.stringify(_jsonResponse[index]._id))}> Delete Entry </button><br>`;
                let current: Personalien = <Personalien>_jsonResponse[index];
                for (let key in current) {
                    jsonString += key + ": " + JSON.stringify(current[key]) + "<br>";
                }
                jsonString += "<br>";
            }
        }
        return jsonString;
    }

    function addRemoveFunction(): void {
        let removeButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".removeButton");
        for (const iterator of removeButtons)
            iterator.addEventListener("click", removeData);
    }

}

