"use strict";
// Datensammlung für Produkte
var Aufgabe06;
(function (Aufgabe06) {
    let shoppingPrice = 0;
    let shoppingCount = 0;
    communicate("http://127.0.0.1:5500/Aufgaben/Aufgabe_07_2020-06-10/myJSON.json");
    async function communicate(_url) {
        let response = await fetch(_url);
        let jsonObj = await response.json();
        console.log("Response", response);
        printProducts(100, jsonObj);
        /*console.log(jsonObj);
        console.log(jsonObj[0].products[2].price);
        console.log(jsonObj[1].products[3].title);*/
        document.querySelector("#special_a").addEventListener("click", drawSpecial);
        function drawSpecial() {
            printProducts(0, jsonObj);
        }
        document.querySelector("#bunt_a").addEventListener("click", drawBunt);
        function drawBunt() {
            printProducts(1, jsonObj);
        }
        document.querySelector("#grün_a").addEventListener("click", drawGrün);
        function drawGrün() {
            printProducts(2, jsonObj);
        }
        document.querySelector("#all_a").addEventListener("click", drawAll);
        function drawAll() {
            printProducts(100, jsonObj);
        }
    }
    Aufgabe06.communicate = communicate;
    //printProducts(100);
    //console.log(jsonObj[1].products[3].title);
    //create Structure;
    function printProducts(_catNumber, _jsonObj) {
        clearProducts(_jsonObj);
        let catCheck = false;
        if (_catNumber != 100)
            catCheck = true;
        else
            _catNumber = 0;
        for (let nummer = _catNumber; nummer < _jsonObj.length; nummer++) {
            let heading = document.createElement("h1");
            heading.setAttribute("id", _jsonObj[nummer].id);
            heading.innerHTML = `${_jsonObj[nummer].title}`;
            document.querySelector("#übersicht").appendChild(heading);
            let container = document.createElement("div");
            container.classList.add("container");
            document.querySelector("#übersicht").appendChild(container);
            for (let index = 0; index < _jsonObj[nummer].products.length; index++) {
                let product = document.createElement("div");
                product.classList.add("product");
                product.innerHTML = `                                                
                <h3 class="title"> ${_jsonObj[nummer].products[index].title} </h3>                                
                <div class=shopIn>                                                     
                    <span class="price"> ${_jsonObj[nummer].products[index].price.toFixed(2).toLocaleString()} ¥</span>                            
                    <button class="addProduct" productPrice="${_jsonObj[nummer].products[index].price}">+</button>                                               
                    <button class="removeProduct">-</button>                                               
                </div>
                <img src="files/${_jsonObj[nummer].products[index].imgName}" alt="Product" />            
                <p class="size"> Size: ${_jsonObj[nummer].products[index].size}</p>
                <div class="description">                                            
                    <p> ${_jsonObj[nummer].products[index].description}</p>
                </div>
            `;
                container.appendChild(product);
            }
            if (catCheck)
                break;
        }
        addShoppingFunction();
    }
    function clearProducts(_jsonObj) {
        console.log("Ich wurde geklickt");
        for (let nummer = 0; nummer < _jsonObj.length; nummer++) {
            let alles = document.querySelector("#übersicht");
            alles.innerHTML = "";
        }
    }
    function money(_event) {
        let target = _event.target;
        let price = parseFloat(target.getAttribute("productPrice"));
        console.log("Artikel-Preis: " + price + " ¥");
        shoppingPrice += price;
        console.log("Shopping-Cart-Preis: " + shoppingPrice + " ¥");
        shoppingCount++;
        document.querySelector("#shoppingCartNumber").innerHTML = shoppingCount.toLocaleString();
    }
    function addShoppingFunction() {
        const buttons = document.getElementsByClassName("addProduct");
        for (const button of buttons) {
            button.addEventListener("click", money);
        }
    }
})(Aufgabe06 || (Aufgabe06 = {}));
// Folgender auskommentierter Code dient mir als Archiv für Gedankenansätze oder Verläufe. 
// Wenn dies nicht gerne gesehen ist, gebt mir kurz Bescheid und ich werde es entfernen
/*
function zeichnen(tagArray: Tag[]): void {
    for (let i: number = 0; i < tagArray.length ; i++){
        let title: HTMLElement = document.createElement(tagArray[i].tag);
        title.innerHTML = "I bims title";
        title.classList.add("title");
        if (tagArray[i].image) {
            title.setAttribute("src", "value");
            title.setAttribute("alt", "value");
        }
        document.body.appendChild(title);
    }
}
*/
/*
console.log("Hello Console");
let theName: String = "Justin" + "Dretvic" + 20;
console.log(theName);
*/
/*
# Template für ein Produkt in HTML
<div class="product">                                                       tag     class
    <h3 class="title"> Color: Rainbow </h3>                                 tag     class   content
    <div class=shopIn>                                                      tag     class
        <span class="price"> 3279,99 ¥ </span>                              tag     class   content
        <button>+</button>                                                  tag             content
        <button>-</button>                                                  tag             content
    </div>
    <img src="files/grass-rainbow-square.png" alt="Product" />              tag                         attribute1  attribute2
    <p class="size"> Size: 4m²</p>                                          tag     class   content
    <div class="description">                                               tag     class
        <p> If you can't choose one color, go and catch them all!</p>       tag             content
    </div>
</div>
*/
/*
let myJSON: string = JSON.stringify(categories);
JSON.stringify(categories);
console.log(myJSON);
*/ 
//# sourceMappingURL=script.js.map