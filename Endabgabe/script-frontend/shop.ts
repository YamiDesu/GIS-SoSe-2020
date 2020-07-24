
namespace frontShop {

    let serverUrl: string = "https://theoneandgis.herokuapp.com";
    let combinationArray: string[] = [];
    let combinationCount: number = 0;
    let tisch: string = "";

    interface Products {
        [type: string]: string | number;
    }

    // create page
    
    init();

    async function init(): Promise<void> {
        printTopButtons();
        await getProductList();
        addButtonFunctions();
        fixCartCount();
    }

    function printTopButtons(): void {
        for (let i: number = 1; i <= 20; i++) {
            let button: HTMLButtonElement = document.createElement("button");
            button.setAttribute("id", "id_table_" + `${i}`);
            button.setAttribute("content", `{"tisch":"${i}"}`);
            button.classList.add("product_button");
            button.innerHTML = `Tisch: ${i}`;
            (<HTMLDivElement>document.querySelector("#topTable")).append(button);
        }
        let button: HTMLButtonElement = document.createElement("button");
        button.setAttribute("id", "id_table_0");
        button.setAttribute("content", `{"tisch":"0"}`);
        button.innerHTML = "Zum Mitnehmen!";
        (<HTMLDivElement>document.querySelector("#topTake")).append(button);
    }

    async function getProductList(): Promise<void> {
        let url: string = serverUrl + "/mongo/products/findCollection" + "?";
        let response: Response = await fetch(url);
        let jsonResponse: Products[] = await response.json();
        printProducts(jsonResponse);
    }

    function printProducts(_jsonResponse: Products[]): void {
        for (const iterator of _jsonResponse) {
            delete iterator._id;
            (<HTMLElement>document.querySelector(`#${iterator.category}Div`)).innerHTML += ` 
                        <div class="${iterator.category}">
                            <img src="images/${iterator.imageName}" alt="Product"/><br> 
                            <div class="product_name">${(<string>iterator.name).replace("-", " ")}</div>
                            <button class="product_button" content=${JSON.stringify(iterator)}>Hinzufügen</button>
                        </div>
                    `;
        }
    }

    function addButtonFunctions(): void {
        let buttonList: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".product_button");
        for (const iterator of buttonList)
            iterator.addEventListener("click", addProduct);

        (<HTMLButtonElement>document.querySelector("#id_table_0")).addEventListener("click", addProduct);
        (<HTMLButtonElement>document.querySelector("#nextButton")).addEventListener("click", addCurrent);
        (<HTMLButtonElement>document.querySelector("#sendButton")).addEventListener("click", addToLocal);
        (<HTMLButtonElement>document.querySelector("#resetButton")).addEventListener("click", clearCombination);
    } 

    function addProduct(_event: Event): void {
        let target: HTMLElement = (<HTMLElement>_event.target);
        let product: Products = JSON.parse(target.getAttribute("content")!);
        if (product.tisch != undefined) {
            tisch = JSON.stringify(product);
            console.log(tisch);
        }

        switch (product.category) {
            case "container": {
                if (checkMaximum(1, product)) {
                    let index: number = combinationArray.indexOf(combinationArray.find(_element => _element = <string>product.category)!);
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

    function checkMaximum(_maximum: number, _targetString: Products): boolean {
        let countOccurence: number = 0;
        for (let i: number = 0; i < combinationArray.length; i++) {
            let checkString: string = combinationArray[i];
            if (checkString.includes(<string>_targetString.category))
                countOccurence++;   
            if (countOccurence == _maximum) {
                alert("Die maximale Anzahl von " + _maximum + " wurde bereits erreicht");
                return true;
            }
        }      
        return false;
    }

    function addCurrent(): void {
        addToLocal();
        clearCombination();
        fixCartCount();
        combinationCount++;
    }

    function clearCombination(): void {
        combinationArray = [];
        displayOrder();
    }

    function fixCartCount(): void {
        if (localStorage["CartCount"] != undefined)
            localStorage.removeItem("CartCount");
        let count: number = 0;
        for (const key in localStorage) {
            if (key.includes("Combination")) {
                count++;
            }
        }
        localStorage.setItem("CartCount", `${count}`);
        (<HTMLElement>document.querySelector("#warenkorb span")).innerHTML = `${localStorage.CartCount}`;
    }

    function addToLocal(): void {
        combinationArray.push(tisch);
        localStorage.setItem(`Combination${combinationCount}`, "[" + combinationArray.toLocaleString() + "]");
    }

    function displayOrder(): void {
        (<HTMLElement>document.querySelector("#displayContainer")).innerHTML = "";
        for (let i: number = combinationArray.length - 1; i > -1; i--) {
            console.log(combinationArray[i]);
            let obj: Products = JSON.parse(combinationArray[i]);
            (<HTMLElement>document.querySelector("#displayContainer")).innerHTML += `<img src="images/${obj.imageName}" alt=""/>`;
        }
    }

}

