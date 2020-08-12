// Datensammlung für Produkte

namespace Aufgabe06 {

    let shoppingPrice: number = 0;
    let shoppingCount: number = 0;

    interface Product {
        title: string;
        price: number;
        size: string;
        imgName: string;
        description: string;
    }

    interface Category {
        title: string;
        id: string;
        products: Product[];
    }

    let categories: Category[] = [
        {
            title: "Special Offers!",
            id: "special",
            products: [
                {
                    title: "Color: Rainbow",
                    price: 3279.99,
                    size: "4m²",
                    imgName: "grass-rainbow-square.png",
                    description: "If you can't choose one color, go and catch them all!"
                }, {
                    title: "Color: White",
                    price: 3279.99,
                    size: "4m²",
                    imgName: "grass-white.png",
                    description: "The appearance of many sparkling stars on your garden floor."
                }, {
                    title: "Color: Black",
                    price: 3279.99,
                    size: "4m²",
                    imgName: "grass-black.png",
                    description: "Dark as the night. Be careful not to form a black hole!"
                }, {
                    title: "Pattern: Murica",
                    price: 3279.99,
                    size: "4m²",
                    imgName: "grass-green-murica.png",
                    description: "Texas, Trump, Guns & Hamburgers"
                }, {
                    title: "Pattern: Schachbrett",
                    price: 3279.99,
                    size: "4m²",
                    imgName: "grass-green-chess-square.png",
                    description: "Show your intellect on your own lawn and embarrass your opponents!"
                }
            ]
        }, {
            title: "Bunte Gräser",
            id: "bunt",
            products: [
                {
                    title: "Color: Green",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-green.png",
                    description: "The standard model in our range. Ensures a natural look and pleasant freshness in your living room!"
                }, {
                    title: "Color: Desert",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-yellow.png",
                    description: "Summer, sun and oh my god, I'm hot! Are they pyramids in my garden ?!"
                }, {
                    title: "Color: Beach",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-orange.png",
                    description: "Summer, sun and hot feelings!"
                }, {
                    title: "Pattern: Hell",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-red.png",
                    description: "Look into the abyss that could await you after your death and invite guests to it!"
                }, {
                    title: "Pattern: Unicorn",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-pink.png",
                    description: "PINK FLUFFY UNICORN, DANCING ON RAINBOWS (which you can also buy in here) !!!"
                }, {
                    title: "Pattern: Grape",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-purple.png",
                    description: "It looks purple. Do you have to say more?"
                }, {
                    title: "Pattern: Atlantic",
                    price: 2339.99,
                    size: "4m²",
                    imgName: "grass-blue.png",
                    description: "Blue like the ocean. A deep look and mysterious nature."
                }
            ]
        }, {
            title: "Green-Tones",
            id: "grün",
            products: [
                {
                    title: "Green: 3B",
                    price: 3499.99,
                    size: "10m²",
                    imgName: "grass-green-dark-3.png",
                    description: "Green in every way. Nothing more to know about it."
                }, {
                    title: "Green: 2B",
                    price: 3499.99,
                    size: "10m²",
                    imgName: "grass-green-dark-2.png",
                    description: "Green in every way. Nothing more to know about it."
                }, {
                    title: "Green: B",
                    price: 3499.99,
                    size: "10m²",
                    imgName: "grass-green-dark-1.png",
                    description: "Green in every way. Nothing more to know about it."
                }, {
                    title: "Green: HB",
                    price: 2339.99,
                    size: "10m²",
                    imgName: "grass-green.png",
                    description: "The standard model in our range. Ensures a natural look and pleasant freshness in your living room!"
                }, {
                    title: "Green: H",
                    price: 3499.99,
                    size: "10m²",
                    imgName: "grass-green-light-1.png",
                    description: "Green in every way. Nothing more to know about it."
                }, {
                    title: "Green: 2H",
                    price: 3499.99,
                    size: "10m²",
                    imgName: "grass-green-light-2.png",
                    description: "Green in every way. Nothing more to know about it."
                }, {
                    title: "Green: 3H",
                    price: 3499.99,
                    size: "10m²",
                    imgName: "grass-green-light-3.png",
                    description: "Green in every way. Nothing more to know about it."
                }
            ]
        }
    ];

    printProducts(100);

    //create Structure;

    function printProducts(_catNumber: number): void {

        clearProducts();

        let catCheck: boolean = false;
        if (_catNumber != 100)
            catCheck = true;
        else 
            _catNumber = 0;

        for (let nummer: number = _catNumber; nummer < categories.length; nummer++) {

            let heading: HTMLHeadingElement = document.createElement("h1");
            heading.setAttribute("id", categories[nummer].id);
            heading.innerHTML = `${categories[nummer].title}`;
            (<HTMLDivElement>document.querySelector("#übersicht")).appendChild(heading);

            let container: HTMLDivElement = document.createElement("div");
            container.classList.add("container");
            (<HTMLDivElement>document.querySelector("#übersicht")).appendChild(container);

            for (let index: number = 0; index < categories[nummer].products.length; index++) {
                let product: HTMLDivElement = document.createElement("div");
                product.classList.add("product");
                product.innerHTML = `                                                
                <h3 class="title"> ${categories[nummer].products[index].title} </h3>                                
                <div class=shopIn>                                                     
                    <span class="price"> ${categories[nummer].products[index].price.toFixed(2).toLocaleString()} ¥</span>                            
                    <button class="addProduct" productPrice="${categories[nummer].products[index].price}">+</button>                                               
                    <button class="removeProduct">-</button>                                               
                </div>
                <img src="files/${categories[nummer].products[index].imgName}" alt="Product" />            
                <p class="size"> Size: ${categories[nummer].products[index].size}</p>
                <div class="description">                                            
                    <p> ${categories[nummer].products[index].description}</p>
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
        console.log("Ich wurde geklickt");
        for (let nummer: number = 0; nummer < categories.length; nummer++) {
            let alles: HTMLDivElement = (<HTMLDivElement>document.querySelector("#übersicht"));
            alles.innerHTML = "";
        }
    }

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

    function money(_event: Event): void {
        let target: HTMLElement = (<HTMLElement>_event.target);
        let price: number = parseFloat(target.getAttribute("productPrice")!);
        console.log("Artikel-Preis: " + price + " ¥");
        shoppingPrice += price;
        console.log("Shopping-Cart-Preis: " + shoppingPrice + " ¥");
        shoppingCount++;
        (<HTMLLIElement>document.querySelector("#shoppingCartNumber")).innerHTML = shoppingCount.toLocaleString();
    }

    function addShoppingFunction(): void {
        const buttons: HTMLCollectionOf<Element> = document.getElementsByClassName("addProduct");
        for (const button of buttons) {
            button.addEventListener("click", money);
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