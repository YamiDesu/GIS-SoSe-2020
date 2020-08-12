
namespace frontShop {

    let serverUrl: string = "http://localhost:8100";
    let orderArray: string[] = [];
    let orderPrice: number = 0;
    let orderNumber: number = 0; 

    init();

    async function init(): Promise<void> {
        await setOrder();
        await addButtonListener();
        fixCartCount();
    }

    interface Products {
        [type: string]: string | number;
    }

    async function setOrder(): Promise<void> {
        //let formData: FormData = new FormData(document.forms[0]);
        orderNumber = await getNumber();
        for (const key in localStorage) {
            if (localStorage.getItem(key) != null && key.includes("Combination")) {
                let content: string = localStorage.getItem(key)!;
                let contentObj: Products[] = await JSON.parse(content);
                let contentString: string = "{";
                let countFlavour: number = 1;
                let countTopping: number = 1;
                let countPrice: number = 0;

                let div: HTMLDivElement = document.createElement("div");
                div.classList.add("product");
                div.innerHTML = ``;
                for (const keys of contentObj)
                    if (keys.category == "container") {
                        contentString += `"container"` + ":" + `"${keys.name}"` + ",";
                        div.innerHTML += `<span>Behälter: ${keys.name}</span><br>`;
                    }
                for (const keys of contentObj)
                    if (keys.category == "flavour") {
                        contentString += `"flavour${countFlavour}"` + ":" + `"${keys.name}"` + ",";
                        div.innerHTML += `<span>Kugel Nr. ${countFlavour}: ${keys.name}</span><br>`;
                        countFlavour++;
                    }
                for (const keys of contentObj)
                    if (keys.category == "topping") {
                        contentString += `"topping${countTopping}"` + ":" + `"${keys.name}"` + ",";
                        div.innerHTML += `<span>Topping Nr. ${countTopping}: ${keys.name}</span><br>`;
                        countTopping++;
                    }
                for (const keys of contentObj) {
                    if (keys.price != undefined) {
                        orderPrice += <number>keys.price;
                        countPrice += <number>keys.price;
                    }
                }
                for (const keys of contentObj) {
                    if (keys.tisch != undefined) {
                        contentString += `"tisch"` + ":" + `"${keys.tisch}"` + ",";
                    }
                }
                contentString += `"productPrice"` + ":" + `"${countPrice.toFixed(2)}"` + "," + `"Nr"` + ":" + `"${orderNumber}"` + ",";
                //contentString += `"vorname"` + ":" + `"${formData.get("vorname")}"` + "," + `"nachname"` + ":" + `"${formData.get("nachname")}"` + ",";
                //contentString += `"straße"` + ":" + `"${formData.get("straße")}"` + "," + `"postleitzahl"` + ":" + `"${formData.get("postleitzahl")}"` + ",";
                contentString = contentString.slice(0, contentString.length - 1) + "}";
                div.innerHTML += `<button class="removeButton" arrayIndex="${orderArray.length}" localName="${key}">Kombination Nr. ${orderArray.length + 1} entfernen</button>`;
                orderArray.push(contentString);
                (<HTMLDivElement>document.querySelector("#check")).append(div);
                //(<HTMLDivElement>document.querySelector("#check")).innerHTML += contentString + "<br><br>";
            }
        }
    }

    /*async function saveForm(): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "";
        //tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = "http://localhost:8100" + "/" + "mongo" + "/" + "orders" + "/" + "insertEntry" + "/" + "?" + query.toString();
        await fetch(url);
    }*/

    async function confirmOrder(): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "";
        //tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = serverUrl + "/" + "mongo" + "/" + "orders" + "/" + "insertEntry" + "/" + "?" + query.toString() + `&Nr=${orderNumber}` + `&orderPrice=${orderPrice.toFixed(2)}`;
        await fetch(url);

        for (const iterator of orderArray) {
            console.log("{" + `"area":"mongo","collection":"orders","action":"insertEntry",` + iterator.slice(1, iterator.length - 1) );
            await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: "{" + `"area":"mongo","collection":"orders","action":"insertEntry",` + iterator.slice(1, iterator.length - 1) + "}"
            });
        }

        orderNumber++;
        await fetch(serverUrl + "/mongo/orders/updateEntry" + "?_id=5f34646911221b807b8df54c&orderCount=" + orderNumber.toString());

        localStorage.clear();
        location.reload();
        alert("Ihre Bestellung wurde eingereicht. Bitte melden Sie sich am Tresen, sobald Ihre Nummer aufgerufen wird! ♥");
    }

    async function getNumber(): Promise<number> {
        let response: Response = await fetch(serverUrl + "/mongo/orders/findEntry?_id=5f34646911221b807b8df54c");
        let orderObj: Products = await response.json();
        let orderObjNumber: number = parseFloat(<string>orderObj.orderCount);
        return orderObjNumber; 
    }

    async function addButtonListener(): Promise<void> {
        //(<HTMLElement>document.querySelector("#printOrder")).addEventListener("click", setOrder);
        (<HTMLElement>document.querySelector("#sendOrder")).addEventListener("click", confirmOrder);
        //(<HTMLElement>document.querySelector("#formButton")).addEventListener("click", saveForm);
        let elementList: NodeListOf<Element> = document.querySelectorAll(".removeButton");
        for (const iterator of elementList)
            iterator.addEventListener("click", removeCombination);
    }

    function removeCombination(_event: Event): void {
        localStorage.setItem("CartCount", `${parseFloat(localStorage.getItem("CartCount")!) - 1}`);
        let target: HTMLElement = (<HTMLElement>_event.target);
        delete orderArray[parseFloat(target.getAttribute("arrayindex")!)];
        localStorage.removeItem(target.getAttribute("localname")!) ;
        location.reload();
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