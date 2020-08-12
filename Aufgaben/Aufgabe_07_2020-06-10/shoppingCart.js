"use strict";
var Aufgabe07;
(function (Aufgabe07) {
    let shoppingPrice = 0;
    if (localStorage.length > 0)
        printProducts();
    //showPrice();
    //printProducts(100);
    //console.log(jsonObj[1].products[3].title);
    //create Structure;
    function printProducts() {
        //clearProducts();
        shoppingPrice = 0;
        let container = document.createElement("div");
        container.classList.add("container");
        document.querySelector("#übersicht").appendChild(container);
        for (let iterator = 0; iterator < localStorage.length; iterator++) {
            if (localStorage.key(iterator) == "shoppingCount")
                continue;
            let zeug = JSON.parse(localStorage.getItem(localStorage.key(iterator)));
            let product = document.createElement("div");
            product.classList.add("product");
            product.innerHTML = `                                                
                <h3 class="title"> ${zeug.title} </h3>                                
                <div class=shopIn>                                                     
                    <span class="price"> ${zeug.price} ¥</span>                                                                         
                    <button class="removeProduct" itemIndex="${iterator}">-</button>                                               
                </div>
                <img src="files/${zeug.imgName}" alt="Product" />            
                <p class="size"> Size: ${zeug.size}</p>
                <div class="description">                                            
                    <p> ${zeug.description}</p>
                </div>
            `;
            container.appendChild(product);
            /*let shoppingPrice: HTMLSpanElement = (<HTMLDivElement>document.querySelector("#showPrice"));
            myPrice += zeug.price;
            shoppingPrice.innerHTML = myPrice.toLocaleString() + " ¥";
            //alles.innerHTML = "";*/
            fixPrice(zeug.price);
        }
        document.querySelector("#removeAllItems").addEventListener("click", clearLocalStorage);
        addRemoveFunction();
    } // zeug.price.toFixed(2).toLocaleString()
    //addShoppingFunction();
    function clearLocalStorage() {
        localStorage.clear();
        document.querySelector("#übersicht").innerHTML = "";
    }
    function removeItem(_event) {
        let target = _event.target;
        //let price: number = parseFloat(target.getAttribute("productPrice")!);
        //let price: number = jsonObj[parseInt(target.getAttribute("categoryNumber")!)].products[parseInt(target.getAttribute("productIndex")!)].price;
        localStorage.removeItem(`${localStorage.key(parseInt(target.getAttribute("itemIndex")))}`);
        document.querySelector("#übersicht").innerHTML = "";
        printProducts();
    }
    function addRemoveFunction() {
        const buttons = document.getElementsByClassName("removeProduct");
        for (const button of buttons) {
            button.addEventListener("click", removeItem);
        }
    }
    function fixPrice(_price) {
        shoppingPrice += _price;
        let shoppingPriceEle = document.querySelector("#showPrice");
        shoppingPriceEle.innerHTML = shoppingPrice.toLocaleString() + " ¥";
    }
    /*function money(_event: Event): void {
        let target: HTMLElement = (<HTMLElement>_event.target);
        //let price: number = parseFloat(target.getAttribute("productPrice")!);
        let price: number = jsonObj[parseInt(target.getAttribute("categoryNumber")!)].products[parseInt(target.getAttribute("productIndex")!)].price;
        console.log("Artikel-Preis: " + price + " ¥");
        shoppingPrice += price;
        console.log("Shopping-Cart-Preis: " + shoppingPrice + " ¥");
        shoppingCount++;
        (<HTMLLIElement>document.querySelector("#shoppingCartNumber")).innerHTML = shoppingCount.toLocaleString();
    }
 
    function removeLocal(_event: Event): void {
        if (localStorage.shoppingCount) {
            localStorage.shoppingCount = Number(localStorage.shoppingCount) + 1;
        } else {
            localStorage.shoppingCount = 1;
        }
        let target: HTMLElement = (<HTMLElement>_event.target);
        let shoppingProduct: Product = jsonObj[parseInt(target.getAttribute("categoryNumber")!)].products[parseInt(target.getAttribute("productIndex")!)];
        localStorage.setItem(`${shoppingProduct.title}`, JSON.stringify(shoppingProduct));
    }
 
    function addShoppingFunction(): void {
        const buttons: HTMLCollectionOf<Element> = document.getElementsByClassName("addProduct");
        for (const button of buttons) {
            button.addEventListener("click", money);
            button.addEventListener("click", removeLocal);
        }
    }*/
})(Aufgabe07 || (Aufgabe07 = {}));
//# sourceMappingURL=shoppingCart.js.map