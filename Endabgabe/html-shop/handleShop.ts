namespace shop {

    interface LocalProduct {
        [type: string]: string | number; //| string[] | undefined;
    }

    let countBall: number = 0;
    let countTopping: number = 0;
    let storageArray: String[];
    let storageObject: LocalProduct;
    
    export function addProduct(_targetString: string): void {
        let storageProduct: String[] = [""];
        console.log(_targetString);
        storageProduct.push("category");
        storageProduct.push("name");
        storageProduct.push("price");
        storageProduct.push("imageName");
    }

    export function fixCount(): void {
        console.log("I reached here");
    }
    
    /*export function addToLocal(): void {
        localStorage.setItem("Combination", storageArray.toLocaleString());
    }*/
    

}

