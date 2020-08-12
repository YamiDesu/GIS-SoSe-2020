"use strict";
var frontShop;
(function (frontShop) {
    let serverUrl = "https://theoneandgis.herokuapp.com";
    let combinationArray = [];
    let combinationCount = 0;
    let tisch = "";
    // create page
    init();
    async function init() {
        printTopButtons();
        await getProductList();
        addButtonFunctions();
        fixCartCount();
    }
    function printTopButtons() {
        for (let i = 1; i <= 20; i++) {
            let button = document.createElement("button");
            button.setAttribute("id", "id_table_" + `${i}`);
            button.setAttribute("content", `{"tisch":"${i}"}`);
            button.classList.add("product_button");
            button.innerHTML = `Tisch: ${i}`;
            document.querySelector("#topTable").append(button);
        }
        let button = document.createElement("button");
        button.setAttribute("id", "id_table_0");
        button.setAttribute("content", `{"tisch":"0"}`);
        button.innerHTML = "Zum Mitnehmen!";
        document.querySelector("#topTake").append(button);
    }
    async function getProductList() {
        let url = serverUrl + "/mongo/products/findCollection" + "?";
        let response = await fetch(url);
        let jsonResponse = await response.json();
        printProducts(jsonResponse);
    }
    function printProducts(_jsonResponse) {
        for (const iterator of _jsonResponse) {
            delete iterator._id;
            document.querySelector(`#${iterator.category}Div`).innerHTML += ` 
                        <div class="${iterator.category}">
                            <img src="images/${iterator.imageName}" alt="Product"/><br> 
                            <div class="product_name">${iterator.name.replace("-", " ")}</div>
                            <button class="product_button" content=${JSON.stringify(iterator)}>Hinzufügen</button>
                        </div>
                    `;
        }
    }
    function addButtonFunctions() {
        let buttonList = document.querySelectorAll(".product_button");
        for (const iterator of buttonList)
            iterator.addEventListener("click", addProduct);
        document.querySelector("#id_table_0").addEventListener("click", addProduct);
        document.querySelector("#nextButton").addEventListener("click", addCurrent);
        document.querySelector("#sendButton").addEventListener("click", addOrderToLocal);
        document.querySelector("#resetButton").addEventListener("click", clearCombination);
    }
    function addProduct(_event) {
        let target = _event.target;
        let product = JSON.parse(target.getAttribute("content"));
        if (product.tisch != undefined) {
            tisch = JSON.stringify(product);
            console.log(tisch);
        }
        switch (product.category) {
            case "container": {
                if (checkMaximum(1, product)) {
                    let index = combinationArray.indexOf(combinationArray.find(_element => _element = product.category));
                    combinationArray[index] = JSON.stringify(product);
                    displayOrder();
                }
                else {
                    combinationArray.push(JSON.stringify(product));
                    displayOrder();
                }
                break;
            }
            case "flavour": {
                if (!checkMaximum(6, product)) {
                    combinationArray.push(JSON.stringify(product));
                    displayOrder();
                }
                break;
            }
            case "topping": {
                if (!checkMaximum(3, product)) {
                    combinationArray.push(JSON.stringify(product));
                    displayOrder();
                }
                break;
            }
        }
        console.log("combinationArray", combinationArray);
    }
    function checkMaximum(_maximum, _targetString) {
        let countOccurence = 0;
        for (let i = 0; i < combinationArray.length; i++) {
            let checkString = combinationArray[i];
            if (checkString.includes(_targetString.category))
                countOccurence++;
            if (countOccurence == _maximum) {
                alert("Die maximale Anzahl von " + _maximum + " wurde bereits erreicht");
                return true;
            }
        }
        return false;
    }
    function addCurrent() {
        addToLocal();
        clearCombination();
        fixCartCount();
        combinationCount++;
    }
    function clearCombination() {
        combinationArray = [];
        displayOrder();
        document.querySelector("#topContainer").scrollIntoView(true);
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
    function addOrderToLocal() {
        addToLocal();
        window.location.href = "../html-warenkorb/warenkorb.html";
    }
    function addToLocal() {
        combinationArray.push(tisch);
        localStorage.setItem(`Combination${combinationCount}`, "[" + combinationArray.toLocaleString() + "]");
    }
    function displayOrder() {
        document.querySelector("#displayContainer").innerHTML = "";
        for (let i = combinationArray.length - 1; i > -1; i--) {
            console.log(combinationArray[i]);
            let obj = JSON.parse(combinationArray[i]);
            document.querySelector("#displayContainer").innerHTML += `<img src="images/${obj.imageName}" alt=""/>`;
        }
    }
})(frontShop || (frontShop = {}));
//# sourceMappingURL=shop.js.map