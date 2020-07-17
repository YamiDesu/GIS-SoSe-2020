"use strict";
//mongodb + srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority
//http://localhost:8100
//https://theoneandgis.herokuapp.com
var shop;
(function (shop) {
    let obj = { "_id": 1, "category": "test" };
    console.log(obj);
    let serverUrl = "http://localhost:8100";
    let storageArray = [];
    let combinationCount = 0;
    init();
    async function init() {
        printPage();
        await getProductList();
        addShopping();
    }
    function printPage() {
        for (let i = 1; i <= 20; i++) {
            let button = document.createElement("button");
            button.setAttribute("id", "id_table_" + `${i}`);
            //button.setAttribute("countNumber", "id_table_" + `${i}`);
            button.innerHTML = `${i}`;
            document.querySelector("#orderContainer").append(button);
        }
    }
    async function getProductList() {
        let url = serverUrl + "/mongo/products/findCollection" + "?";
        let response = await fetch(url);
        let jsonResponse = await response.json();
        printProducts(jsonResponse);
        printShopButton();
        //let jsonString: string = JSON.stringify(jsonResponse); //formatCollection(jsonResponse);
        //(<HTMLDivElement>document.querySelector("#test")).innerHTML = jsonString;
    }
    function printProducts(_jsonResponse) {
        let categoryString = [];
        for (const iterator of _jsonResponse) {
            if (!categoryString.find(element => element == iterator.category)) {
                categoryString.push(iterator.category);
                let div = document.createElement("div");
                div.setAttribute("id", "id_" + `${iterator.category}`);
                document.querySelector("#productContainer").append(div);
                let heading = document.createElement("h1");
                heading.innerHTML = `${iterator.category}`;
                document.querySelector(`#id_${iterator.category}`).append(heading);
            }
        }
        for (const iterator of _jsonResponse) {
            let div = document.createElement("div");
            delete iterator._id;
            div.innerHTML = ` 
                        <div class="${iterator.category}">
                            <div class="product_name">${iterator.name}</div>
                            <img src="images/filler.png" alt="Product" /> 
                            <button class="product_button" content=${JSON.stringify(iterator)}>in den Einkaufswagen</button>
                        </div>
                    `; //${ innerIterator.imageName }
            document.querySelector(`#id_${iterator.category}`).append(div);
        }
    }
    function printShopButton() {
        let next = document.createElement("button");
        let send = document.createElement("button");
        next.setAttribute("id", "nextButton");
        send.setAttribute("id", "sendButton");
        next.innerHTML = "Nächstes Eis";
        send.innerHTML = "Bestellung speichern";
        document.querySelector("#buttonContainer").append(next);
        document.querySelector("#buttonContainer").append(send);
        document.querySelector("#nextButton").addEventListener("click", fixCount);
        document.querySelector("#sendButton").addEventListener("click", addToLocal);
    }
    // Button Interaction
    function addShopping() {
        let buttonList = document.querySelectorAll(".product_button");
        for (const iterator of buttonList)
            iterator.addEventListener("click", sendProduct);
    }
    function sendProduct(_event) {
        let target = _event.target;
        let obj = JSON.parse(target.getAttribute("content"));
        console.log(obj);
        //console.log(target.getAttribute("content"));
        addProduct(obj);
    }
    shop.sendProduct = sendProduct;
    function addProduct(_targetString) {
        //debugger;
        switch (_targetString.category) {
            case "container": {
                if (checkMaximum(1, _targetString)) {
                    let index = storageArray.indexOf(storageArray.find(element => element = _targetString.category));
                    storageArray[index] = JSON.stringify(_targetString);
                    console.log(storageArray, storageArray.toLocaleString());
                    break;
                }
                else {
                    storageArray.push(JSON.stringify(_targetString));
                    break;
                }
            }
            case "flavour": {
                storageArray.push(JSON.stringify(_targetString));
                console.log("_storageArray.push", JSON.stringify(_targetString));
                break;
            }
            case "topping": {
                storageArray.push(JSON.stringify(_targetString));
                console.log("_storageArray.push", JSON.stringify(_targetString));
                break;
            }
        }
        /*for (const iterator of storageArray)
            console.log(iterator);
        storageArray.push(JSON.stringify(_targetString));
        console.log(storageArray.toLocaleString());*/
    }
    function checkMaximum(_maximum, _targetString) {
        let countOccurence = 0;
        for (let i = 0; i < storageArray.length; i++) {
            let checkString = storageArray[i];
            if (checkString.includes(_targetString.category))
                countOccurence++;
            if (countOccurence == _maximum) {
                alert("You've already reached the maximum of " + _maximum);
                return true;
            }
        }
        return false;
    }
    function fixCount() {
        addToLocal();
        storageArray = [];
        combinationCount++;
    }
    function addToLocal() {
        localStorage.setItem(`Combination${combinationCount}`, "[" + storageArray.toLocaleString() + "]");
    }
})(shop || (shop = {}));
//# sourceMappingURL=createShop.js.map