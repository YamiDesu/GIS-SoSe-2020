
namespace frontShop {

    interface Products {
        [type: string]: string | number;
    }

    let serverUrl: string = "https://theoneandgis.herokuapp.com";

    init();

    async function init(): Promise<void> {
        await getOrderList();
        addListening();
        fixCartCount();
    }
    async function getOrderList(): Promise<void> {
        let url: string = serverUrl + "/mongo/orders/findCollection" + "?";
        let response: Response = await fetch(url);
        let jsonResponse: Products[] = await response.json();
        let previousNr: number = -1;
        //(<HTMLDivElement>document.querySelector("#tableDiv")).innerHTML = JSON.stringify(jsonResponse);

        for (const iterator of jsonResponse) {
            if (iterator.orderCount != undefined)
                continue;
            let table: HTMLTableElement = document.createElement("table");

            if (previousNr != iterator.Nr) {
                let button: HTMLButtonElement = document.createElement("button");
                button.setAttribute("content", `${iterator.Nr}`);
                button.classList.add("removeButton");
                button.innerHTML = `Bestellung Nr. ${iterator.Nr} entfernen`;
                (<HTMLDivElement>document.querySelector("#tableDiv")).append(button);
                previousNr = <number>iterator.Nr;
            }


            if (!(iterator.vorname == undefined)) {
                table.innerHTML = `
                    <tr>
                        <th>Bestellung</th>
                        <td>Nr. ${iterator.Nr}</td>
                    <tr>
                    <tr>
                        <th>Preis</th>
                        <td>${iterator.orderPrice} €</td>
                    </tr>
                        <th>Name</th>
                        <td>${iterator.vorname} ${iterator.nachname}</td>
                    </tr>
                    <tr>
                        <th>Straße</th>
                        <td>${iterator.straße}</td>
                    </tr>
                    <tr>
                        <th>Wohnort</th>
                        <td>${iterator.postleitzahl}</td>
                    </tr>
                `;
            }
            else {
                table.innerHTML += `
                    <tr>
                        <th>Bestellung</th>
                        <td>Nr. ${iterator.Nr}</td>
                    </tr>
                    <tr>
                        <th>Preis</th>
                        <td>${iterator.productPrice}€</td>
                    </tr>`;
                for (const key in iterator) {
                    switch (key) {
                        case ("container"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.container}</td></tr>`;
                                            break;
                        case ("flavour1"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour1}</td></tr>`;
                                           break;
                        case ("flavour2"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour2}</td></tr>`;
                                           break;
                        case ("flavour3"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour3}</td></tr>`;
                                           break;
                        case ("flavour4"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour4}</td></tr>`;
                                           break;
                        case ("flavour5"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour5}</td></tr>`;
                                           break;
                        case ("flavour6"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour6}</td></tr>`;
                                           break;
                        case ("topping1"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.topping1}</td></tr>`;
                                           break;
                        case ("topping2"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.topping2}</td></tr>`;
                                           break;
                        case ("topping3"): table.innerHTML += `<tr><th>${key}</th><td>${iterator.topping3}</td></tr>`;
                                           break;
                    }
                }
                
            }
            (<HTMLDivElement>document.querySelector("#tableDiv")).append(table);
            let div: HTMLDivElement = document.createElement("div");
            div.classList.add("buttonDiv");
            div.innerHTML = `
            <button class="removeOne" content=${JSON.stringify(iterator._id)}>▲ Entfernen ▲</button>
            <button class="editOne" content=${JSON.stringify(iterator)}>▲ Bearbeiten ▲</button> `;
            (<HTMLDivElement>document.querySelector("#tableDiv")).append(div);
        }
    }

    function addListening(): void {
        let elementList: NodeListOf<Element> = document.querySelectorAll(".removeOne");
        for (const iterator of elementList)
            iterator.addEventListener("click", removeDataID);
        let elementList2: NodeListOf<Element> = document.querySelectorAll(".removeButton");
        for (const iterator of elementList2)
            iterator.addEventListener("click", removeDataNR);
        let elementList3: NodeListOf<Element> = document.querySelectorAll(".editOne");
        for (const iterator of elementList3)
            iterator.addEventListener("click", editData);
    }

    async function removeDataID(_event: Event): Promise<void> {
        await removeData(_event, "id");
    }

    async function removeDataNR(_event: Event): Promise<void> {
        await removeData(_event, "order");
    }

    async function removeData(_event: Event, _parameter: string): Promise<void> {
        let target: HTMLElement = (<HTMLElement>_event.target);
        let query: string = "";
        if (_parameter == "id")
            query = `_id=${target.getAttribute("content")!}`;
        else if (_parameter == "order")
            query = `Nr=${target.getAttribute("content")!}`;
        console.log(query);
        let url: string = serverUrl + "/mongo/orders/removeEntry/?" + query;
        await fetch(url);
        location.reload();
    }  

    function editData(_event: Event): void {
        
        let target: HTMLElement = (<HTMLElement>_event.target);
        let obj: Products = JSON.parse(target.getAttribute("content")!);
        let div: HTMLDivElement = document.createElement("div");
        div.setAttribute("id", "formDiv");
        div.innerHTML = `<form id="myForm"></form>`;
        if ((<HTMLFormElement>document.querySelector("#myForm")) != null)
            (<HTMLDivElement>document.querySelector("#tableDiv")).removeChild(div); 
        (<HTMLDivElement>document.querySelector("#tableDiv")).append(div);
        for (const iterator in obj) {
            let label: HTMLLabelElement = document.createElement("label");
            label.setAttribute("for", iterator);
            label.innerHTML = `${iterator}`;
            let input: HTMLInputElement = document.createElement("input"); 
            input.setAttribute("type", "text");
            input.setAttribute("name", `${iterator}`);
            input.setAttribute("id", `${iterator}`);
            input.setAttribute("value", <string>obj[iterator]);
            
            if (iterator == "_id") {
                input.setAttribute("readonly", "");
            }
            else {
                input.setAttribute("onfocus", `if(this.value == "${<string>obj[iterator]}") this.value=""`);
                input.setAttribute("onblur", `if(this.value == "") this.value="${<string>obj[iterator]}"`);
            }
            
            (<HTMLLabelElement>document.querySelector("#myForm")).append(label);
            (<HTMLInputElement>document.querySelector("#myForm")).append(input);
        }
        let button: HTMLButtonElement = document.createElement("button");
        button.setAttribute("id", "setAttribute");
        button.innerHTML = "Bestätigung";
        button.addEventListener("click", confirmForm);
        (<HTMLInputElement>document.querySelector("#myForm")).append(button);
    }

    async function confirmForm(): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "";
        //tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = serverUrl + "/" + "mongo" + "/" + "orders" + "/" + "updateEntry" + "/" + "?" + query.toString();
        await fetch(url);
    }

    function fixCartCount(): void {
        if (localStorage["CartCount"] != undefined)
            localStorage.removeItem("CartCount");
        let count: number = 0;
        for (const key in localStorage) {
            if (key.includes("Combination")) {
                count++;
            }
        }
        localStorage.setItem("CartCount", `${count}`);
        (<HTMLElement>document.querySelector("#warenkorb span")).innerHTML = `${localStorage.CartCount}`;
    }

}