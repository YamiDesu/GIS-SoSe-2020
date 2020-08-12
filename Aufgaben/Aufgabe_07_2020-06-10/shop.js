"use strict";
// Datensammlung für Produkte
var Aufgabe07;
(function (Aufgabe07) {
    let shoppingPrice = 0;
    let shoppingCount = localStorage.length;
    if (localStorage.length > 1)
        shoppingCount--;
    document.querySelector("#shoppingCartNumber").innerHTML = shoppingCount.toLocaleString();
    let jsonObj;
    communicate("https://yamidesu.github.io/GIS-SoSe-2020/Aufgaben/Aufgabe_07_2020-06-10/myJSON.json");
    async function communicate(_url) {
        let response = await fetch(_url);
        jsonObj = await response.json();
        console.log("Response", response);
        printProducts(100);
        /*console.log(jsonObj);
        console.log(jsonObj[0].products[2].price);
        console.log(jsonObj[1].products[3].title);*/
        document.querySelector("#special_a").addEventListener("click", drawSpecial);
        function drawSpecial() {
            printProducts(0);
        }
        document.querySelector("#bunt_a").addEventListener("click", drawBunt);
        function drawBunt() {
            printProducts(1);
        }
        document.querySelector("#grün_a").addEventListener("click", drawGrün);
        function drawGrün() {
            printProducts(2);
        }
        document.querySelector("#all_a").addEventListener("click", drawAll);
        function drawAll() {
            printProducts(100);
        }
    }
    Aufgabe07.communicate = communicate;
    updateShoppingCount();
    function updateShoppingCount() {
        shoppingCount = localStorage.length - 1;
    }
    //printProducts(100);
    //console.log(jsonObj[1].products[3].title);
    //create Structure;
    function printProducts(_catNumber) {
        clearProducts();
        let catCheck = false;
        if (_catNumber != 100)
            catCheck = true;
        else
            _catNumber = 0;
        for (let nummer = _catNumber; nummer < jsonObj.length; nummer++) {
            let heading = document.createElement("h1");
            heading.setAttribute("id", jsonObj[nummer].id);
            heading.innerHTML = `${jsonObj[nummer].title}`;
            document.querySelector("#übersicht").appendChild(heading);
            let container = document.createElement("div");
            container.classList.add("container");
            document.querySelector("#übersicht").appendChild(container);
            for (let index = 0; index < jsonObj[nummer].products.length; index++) {
                let product = document.createElement("div");
                product.classList.add("product");
                product.innerHTML = `                                                
                <h3 class="title"> ${jsonObj[nummer].products[index].title} </h3>                                
                <div class=shopIn>                                                     
                    <span class="price"> ${jsonObj[nummer].products[index].price.toFixed(2).toLocaleString()} ¥</span>                            
                    <button class="addProduct" CategoryNumber="${nummer}" productIndex="${index}">+</button>                                               
                    <button class="removeProduct">-</button>                                               
                </div>
                <img src="files/${jsonObj[nummer].products[index].imgName}" alt="Product" />            
                <p class="size"> Size: ${jsonObj[nummer].products[index].size}</p>
                <div class="description">                                            
                    <p> ${jsonObj[nummer].products[index].description}</p>
                </div>
            `;
                container.appendChild(product);
            }
            if (catCheck)
                break;
        }
        addShoppingFunction();
    }
    function clearProducts() {
        for (let nummer = 0; nummer < jsonObj.length; nummer++) {
            let alles = document.querySelector("#übersicht");
            alles.innerHTML = "";
        }
    }
    function money(_event) {
        let target = _event.target;
        //let price: number = parseFloat(target.getAttribute("productPrice")!);
        let price = jsonObj[parseInt(target.getAttribute("categoryNumber"))].products[parseInt(target.getAttribute("productIndex"))].price;
        console.log("Artikel-Preis: " + price + " ¥");
        shoppingPrice += price;
        console.log("Shopping-Cart-Preis: " + shoppingPrice + " ¥");
        shoppingCount++;
        document.querySelector("#shoppingCartNumber").innerHTML = shoppingCount.toLocaleString();
    }
    function addLocal(_event) {
        if (localStorage.shoppingCount) {
            localStorage.shoppingCount = Number(localStorage.shoppingCount) + 1;
        }
        else {
            localStorage.shoppingCount = 1;
        }
        let target = _event.target;
        let shoppingProduct = jsonObj[parseInt(target.getAttribute("categoryNumber"))].products[parseInt(target.getAttribute("productIndex"))];
        localStorage.setItem(`${shoppingProduct.title}`, JSON.stringify(shoppingProduct));
    }
    function addShoppingFunction() {
        const buttons = document.getElementsByClassName("addProduct");
        for (const button of buttons) {
            button.addEventListener("click", money);
            button.addEventListener("click", addLocal);
        }
    }
})(Aufgabe07 || (Aufgabe07 = {}));
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
//# sourceMappingURL=shop.js.map