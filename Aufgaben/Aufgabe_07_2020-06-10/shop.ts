// Datensammlung für Produkte

namespace Aufgabe07 {

    let shoppingPrice: number = 0;
    let shoppingCount: number = localStorage.length;
    if ( localStorage.length > 1)
        shoppingCount --;

    (<HTMLLIElement>document.querySelector("#shoppingCartNumber")).innerHTML = shoppingCount.toLocaleString();

    let jsonObj: Category[];

    export interface Product {
        title: string;
        price: number;
        size: string;
        imgName: string;
        description: string;
    }

    export interface Category {
        title: string;
        id: string;
        products: Product[];
    }

    communicate("https://yamidesu.github.io/GIS-SoSe-2020/Aufgaben/Aufgabe_07_2020-06-10/myJSON.json");

    export async function communicate(_url: RequestInfo): Promise<void> {
        let response: Response = await fetch(_url);
        jsonObj = await response.json();
        console.log("Response", response);
        printProducts(100);

        /*console.log(jsonObj);
        console.log(jsonObj[0].products[2].price);
        console.log(jsonObj[1].products[3].title);*/

        (<HTMLLIElement>document.querySelector("#special_a")).addEventListener("click", drawSpecial);
        function drawSpecial(): void {
            printProducts(0);
        }
        (<HTMLLIElement>document.querySelector("#bunt_a")).addEventListener("click", drawBunt);
        function drawBunt(): void {
            printProducts(1);
        }
        (<HTMLLIElement>document.querySelector("#grün_a")).addEventListener("click", drawGrün);
        function drawGrün(): void {
            printProducts(2);
        }
        (<HTMLLIElement>document.querySelector("#all_a")).addEventListener("click", drawAll);
        function drawAll(): void {
            printProducts(100);
        }
    }

    updateShoppingCount();

    function updateShoppingCount(): void {
        shoppingCount = localStorage.length - 1;
    }

    //printProducts(100);
    //console.log(jsonObj[1].products[3].title);

    //create Structure;

    function printProducts(_catNumber: number): void {

        clearProducts();

        let catCheck: boolean = false;
        if (_catNumber != 100)
            catCheck = true;
        else
            _catNumber = 0;

        for (let nummer: number = _catNumber; nummer < jsonObj.length; nummer++) {

            let heading: HTMLHeadingElement = document.createElement("h1");
            heading.setAttribute("id", jsonObj[nummer].id);
            heading.innerHTML = `${jsonObj[nummer].title}`;
            (<HTMLDivElement>document.querySelector("#übersicht")).appendChild(heading);

            let container: HTMLDivElement = document.createElement("div");
            container.classList.add("container");
            (<HTMLDivElement>document.querySelector("#übersicht")).appendChild(container);

            for (let index: number = 0; index < jsonObj[nummer].products.length; index++) {
                let product: HTMLDivElement = document.createElement("div");
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

    function clearProducts(): void {
        for (let nummer: number = 0; nummer < jsonObj.length; nummer++) {
            let alles: HTMLDivElement = (<HTMLDivElement>document.querySelector("#übersicht"));
            alles.innerHTML = "";
        }
    }

    function money(_event: Event): void {
        let target: HTMLElement = (<HTMLElement>_event.target);
        //let price: number = parseFloat(target.getAttribute("productPrice")!);
        let price: number = jsonObj[parseInt(target.getAttribute("categoryNumber")!)].products[parseInt(target.getAttribute("productIndex")!)].price;
        console.log("Artikel-Preis: " + price + " ¥");
        shoppingPrice += price;
        console.log("Shopping-Cart-Preis: " + shoppingPrice + " ¥");
        shoppingCount++;
        (<HTMLLIElement>document.querySelector("#shoppingCartNumber")).innerHTML = shoppingCount.toLocaleString();
    }

    function addLocal(_event: Event): void {
        if (localStorage.shoppingCount) {
            localStorage.shoppingCount = Number(localStorage.shoppingCount) + 1;
        } else {
            localStorage.shoppingCount = 1;
        }
        let target: HTMLElement = (<HTMLElement>_event.target);
        let shoppingProduct: Product = jsonObj[parseInt(target.getAttribute("categoryNumber")!)].products[parseInt(target.getAttribute("productIndex")!)];
        localStorage.setItem(`${shoppingProduct.title}`, JSON.stringify(shoppingProduct) );
    }

    function addShoppingFunction(): void {
        const buttons: HTMLCollectionOf<Element> = document.getElementsByClassName("addProduct");
        for (const button of buttons) {
            button.addEventListener("click", money);
            button.addEventListener("click", addLocal);
        }
    }
}

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