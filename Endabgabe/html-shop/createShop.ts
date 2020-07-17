//mongodb + srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority
//http://localhost:8100

//https://theoneandgis.herokuapp.com
namespace shop {

    interface Products {
        _id: any;
        category: string;
        name: string;
        price: number;
        imageName: string;
    }
    interface LocalProduct {
        [type: string]: string | number; //| string[] | undefined;
    }

    let obj: LocalProduct = {"_id": 1, "category": "test"};
    console.log(obj);

    let serverUrl: string = "http://localhost:8100";

    let storageArray: string[] = [];
    let combinationCount: number = 0;

    init();

    async function init(): Promise<void> {
        printPage();
        await getProductList();
        addShopping();
    }


    function printPage(): void {
        for (let i: number = 1; i <= 20; i++) {
            let button: HTMLButtonElement = document.createElement("button");
            button.setAttribute("id", "id_table_" + `${i}`);
            //button.setAttribute("countNumber", "id_table_" + `${i}`);
            button.innerHTML = `${i}`;
            (<HTMLDivElement>document.querySelector("#orderContainer")).append(button);
        }
    }

    async function getProductList(): Promise<void> {
        let url: string = serverUrl + "/mongo/products/findCollection" + "?";
        let response: Response = await fetch(url);
        let jsonResponse: Products[] = await response.json();
        printProducts(jsonResponse);
        printShopButton();
        //let jsonString: string = JSON.stringify(jsonResponse); //formatCollection(jsonResponse);
        //(<HTMLDivElement>document.querySelector("#test")).innerHTML = jsonString;
    }

    function printProducts(_jsonResponse: Products[]): void {
        let categoryString: string[] = [];
        for (const iterator of _jsonResponse) {
            if (!categoryString.find(element => element == iterator.category)) {
                categoryString.push(iterator.category);
                let div: HTMLHeadingElement = document.createElement("div");
                div.setAttribute("id", "id_" + `${iterator.category}`);
                (<HTMLDivElement>document.querySelector("#productContainer")).append(div);
                let heading: HTMLHeadingElement = document.createElement("h1");
                heading.innerHTML = `${iterator.category}`;
                (<HTMLHeadingElement>document.querySelector(`#id_${iterator.category}`)).append(heading);
            }
        }
        for (const iterator of _jsonResponse) {
            let div: HTMLDivElement = document.createElement("div");
            delete iterator._id;
            div.innerHTML = ` 
                        <div class="${iterator.category}">
                            <div class="product_name">${iterator.name}</div>
                            <img src="images/filler.png" alt="Product" /> 
                            <button class="product_button" content=${JSON.stringify(iterator)}>in den Einkaufswagen</button>
                        </div>
                    `; //${ innerIterator.imageName }
            (<HTMLElement>document.querySelector(`#id_${iterator.category}`)).append(div);
        }
    }

    function printShopButton(): void {
        let next: HTMLButtonElement = document.createElement("button");
        let send: HTMLButtonElement = document.createElement("button");
        next.setAttribute("id", "nextButton");
        send.setAttribute("id", "sendButton");
        next.innerHTML = "Nächstes Eis";
        send.innerHTML = "Bestellung speichern";
        (<HTMLDivElement>document.querySelector("#buttonContainer")).append(next);
        (<HTMLDivElement>document.querySelector("#buttonContainer")).append(send);
        (<HTMLElement>document.querySelector("#nextButton")).addEventListener("click", fixCount);
        (<HTMLElement>document.querySelector("#sendButton")).addEventListener("click", addToLocal);
    }

    // Button Interaction

    function addShopping(): void {
        let buttonList: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".product_button");
        for (const iterator of buttonList)
            iterator.addEventListener("click", sendProduct);
    }

    export function sendProduct(_event: Event): void {
        let target: HTMLElement = (<HTMLElement>_event.target);
        let obj: LocalProduct = JSON.parse(target.getAttribute("content")!);
        console.log(obj);
        //console.log(target.getAttribute("content"));
        addProduct(obj);
    }

    function addProduct(_targetString: LocalProduct): void {
        //debugger;
        switch (_targetString.category) {
            case "container": {
                if (checkMaximum(1, _targetString)) {
                    let index: number = storageArray.indexOf(storageArray.find(element => element = <string>_targetString.category)!);
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

    function checkMaximum(_maximum: number, _targetString: LocalProduct): boolean {
        let countOccurence: number = 0;
        for (let i: number = 0; i < storageArray.length; i++) {
            let checkString: string = storageArray[i];
            if (checkString.includes(<string>_targetString.category))
                countOccurence++;   
            if (countOccurence == _maximum) {
                alert("You've already reached the maximum of " + _maximum);
                return true;
            }
        }      
        return false;
    }

    

    function fixCount(): void {
        addToLocal();
        storageArray = [];
        combinationCount++;
    }

    function addToLocal(): void {
        localStorage.setItem(`Combination${combinationCount}`, "[" + storageArray.toLocaleString() + "]");
    }

}

