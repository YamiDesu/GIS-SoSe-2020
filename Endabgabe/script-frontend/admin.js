"use strict";
var frontShop;
(function (frontShop) {
    let serverUrl = "https://theoneandgis.herokuapp.com";
    init();
    async function init() {
        await getOrderList();
        addListening();
        fixCartCount();
    }
    async function getOrderList() {
        let url = serverUrl + "/mongo/orders/findCollection" + "?";
        let response = await fetch(url);
        let jsonResponse = await response.json();
        let previousNr = -1;
        //(<HTMLDivElement>document.querySelector("#tableDiv")).innerHTML = JSON.stringify(jsonResponse);
        for (const iterator of jsonResponse) {
            if (iterator.orderCount != undefined)
                continue;
            let table = document.createElement("table");
            if (previousNr != iterator.Nr) {
                let button = document.createElement("button");
                button.setAttribute("content", `${iterator.Nr}`);
                button.classList.add("removeButton");
                button.innerHTML = `Bestellung Nr. ${iterator.Nr} entfernen`;
                document.querySelector("#tableDiv").append(button);
                previousNr = iterator.Nr;
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
                        case ("container"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.container}</td></tr>`;
                            break;
                        case ("flavour1"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour1}</td></tr>`;
                            break;
                        case ("flavour2"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour2}</td></tr>`;
                            break;
                        case ("flavour3"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour3}</td></tr>`;
                            break;
                        case ("flavour4"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour4}</td></tr>`;
                            break;
                        case ("flavour5"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour5}</td></tr>`;
                            break;
                        case ("flavour6"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.flavour6}</td></tr>`;
                            break;
                        case ("topping1"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.topping1}</td></tr>`;
                            break;
                        case ("topping2"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.topping2}</td></tr>`;
                            break;
                        case ("topping3"):
                            table.innerHTML += `<tr><th>${key}</th><td>${iterator.topping3}</td></tr>`;
                            break;
                    }
                }
            }
            document.querySelector("#tableDiv").append(table);
            let div = document.createElement("div");
            div.classList.add("buttonDiv");
            div.innerHTML = `
            <button class="removeOne" content=${JSON.stringify(iterator._id)}>▲ Entfernen ▲</button>
            <button class="editOne" content=${JSON.stringify(iterator)}>▲ Bearbeiten ▲</button> `;
            document.querySelector("#tableDiv").append(div);
        }
    }
    function addListening() {
        let elementList = document.querySelectorAll(".removeOne");
        for (const iterator of elementList)
            iterator.addEventListener("click", removeDataID);
        let elementList2 = document.querySelectorAll(".removeButton");
        for (const iterator of elementList2)
            iterator.addEventListener("click", removeDataNR);
        let elementList3 = document.querySelectorAll(".editOne");
        for (const iterator of elementList3)
            iterator.addEventListener("click", editData);
    }
    async function removeDataID(_event) {
        await removeData(_event, "id");
    }
    async function removeDataNR(_event) {
        await removeData(_event, "order");
    }
    async function removeData(_event, _parameter) {
        let target = _event.target;
        let query = "";
        if (_parameter == "id")
            query = `_id=${target.getAttribute("content")}`;
        else if (_parameter == "order")
            query = `Nr=${target.getAttribute("content")}`;
        console.log(query);
        let url = serverUrl + "/mongo/orders/removeEntry/?" + query;
        await fetch(url);
        location.reload();
    }
    function editData(_event) {
        let target = _event.target;
        let obj = JSON.parse(target.getAttribute("content"));
        let div = document.createElement("div");
        div.setAttribute("id", "formDiv");
        div.innerHTML = `<form id="myForm"></form>`;
        if (document.querySelector("#myForm") != null)
            document.querySelector("#tableDiv").removeChild(div);
        document.querySelector("#tableDiv").append(div);
        for (const iterator in obj) {
            let label = document.createElement("label");
            label.setAttribute("for", iterator);
            label.innerHTML = `${iterator}`;
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("name", `${iterator}`);
            input.setAttribute("id", `${iterator}`);
            input.setAttribute("value", obj[iterator]);
            if (iterator == "_id") {
                input.setAttribute("readonly", "");
            }
            else {
                input.setAttribute("onfocus", `if(this.value == "${obj[iterator]}") this.value=""`);
                input.setAttribute("onblur", `if(this.value == "") this.value="${obj[iterator]}"`);
            }
            document.querySelector("#myForm").append(label);
            document.querySelector("#myForm").append(input);
        }
        let button = document.createElement("button");
        button.setAttribute("id", "setAttribute");
        button.innerHTML = "Bestätigung";
        button.addEventListener("click", confirmForm);
        document.querySelector("#myForm").append(button);
    }
    async function confirmForm() {
        let formData = new FormData(document.forms[0]);
        let url = "";
        //tslint:disable-next-line: no-any
        let query = new URLSearchParams(formData);
        url = serverUrl + "/" + "mongo" + "/" + "orders" + "/" + "updateEntry" + "/" + "?" + query.toString();
        await fetch(url);
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
//# sourceMappingURL=admin.js.map