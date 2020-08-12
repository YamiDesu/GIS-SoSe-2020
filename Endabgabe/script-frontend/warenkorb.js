"use strict";
var frontShop;
(function (frontShop) {
    let serverUrl = "https://theoneandgis.herokuapp.com";
    let orderArray = [];
    let orderPrice = 0;
    let orderNumber = 0;
    init();
    async function init() {
        await setOrder();
        await addButtonListener();
        fixCartCount();
    }
    async function setOrder() {
        //let formData: FormData = new FormData(document.forms[0]);
        orderNumber = await getNumber();
        for (const key in localStorage) {
            if (localStorage.getItem(key) != null && key.includes("Combination")) {
                let content = localStorage.getItem(key);
                let contentObj = await JSON.parse(content);
                let contentString = "{";
                let countFlavour = 1;
                let countTopping = 1;
                let countPrice = 0;
                let div = document.createElement("div");
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
                        orderPrice += keys.price;
                        countPrice += keys.price;
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
                document.querySelector("#check").append(div);
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
    async function confirmOrder() {
        let formData = new FormData(document.forms[0]);
        let url = "";
        //tslint:disable-next-line: no-any
        let query = new URLSearchParams(formData);
        url = serverUrl + "/" + "mongo" + "/" + "orders" + "/" + "insertEntry" + "/" + "?" + query.toString() + `&Nr=${orderNumber}` + `&orderPrice=${orderPrice.toFixed(2)}`;
        await fetch(url);
        for (const iterator of orderArray) {
            console.log("{" + `"area":"mongo","collection":"orders","action":"insertEntry",` + iterator.slice(1, iterator.length - 1));
            await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: "{" + `"area":"mongo","collection":"orders","action":"insertEntry",` + iterator.slice(1, iterator.length - 1) + "}"
            });
        }
        orderNumber++;
        await fetch(serverUrl + "/mongo/orders/updateEntry" + "?_id=5f34701a11221b807b8df54d&orderCount=" + orderNumber.toString());
        localStorage.clear();
        location.reload();
        alert("Ihre Bestellung wurde eingereicht. Bitte melden Sie sich am Tresen, sobald Ihre Nummer aufgerufen wird! ♥");
    }
    async function getNumber() {
        let response = await fetch(serverUrl + "/mongo/orders/findEntry?_id=5f34701a11221b807b8df54d");
        let orderObj = await response.json();
        let orderObjNumber = parseFloat(orderObj.orderCount);
        return orderObjNumber;
    }
    async function addButtonListener() {
        //(<HTMLElement>document.querySelector("#printOrder")).addEventListener("click", setOrder);
        document.querySelector("#sendOrder").addEventListener("click", confirmOrder);
        //(<HTMLElement>document.querySelector("#formButton")).addEventListener("click", saveForm);
        let elementList = document.querySelectorAll(".removeButton");
        for (const iterator of elementList)
            iterator.addEventListener("click", removeCombination);
    }
    function removeCombination(_event) {
        localStorage.setItem("CartCount", `${parseFloat(localStorage.getItem("CartCount")) - 1}`);
        let target = _event.target;
        delete orderArray[parseFloat(target.getAttribute("arrayindex"))];
        localStorage.removeItem(target.getAttribute("localname"));
        location.reload();
    }
    function fixCartCount() {
        if (localStorage["CartCount"] != undefined)
            localStorage.removeItem("CartCount");
        let count = 0;
        for (const key in localStorage) {
            if (key.includes("Combination")) {
                count++;
            }
        }
        localStorage.setItem("CartCount", `${count}`);
        document.querySelector("#warenkorb span").innerHTML = `${localStorage.CartCount}`;
    }
})(frontShop || (frontShop = {}));
//# sourceMappingURL=warenkorb.js.map