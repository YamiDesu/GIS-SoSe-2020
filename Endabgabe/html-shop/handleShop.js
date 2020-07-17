"use strict";
var shop;
(function (shop) {
    let countBall = 0;
    let countTopping = 0;
    let storageArray;
    let storageObject;
    function addProduct(_targetString) {
        let storageProduct = [""];
        console.log(_targetString);
        storageProduct.push("category");
        storageProduct.push("name");
        storageProduct.push("price");
        storageProduct.push("imageName");
    }
    shop.addProduct = addProduct;
    function fixCount() {
        console.log("I reached here");
    }
    shop.fixCount = fixCount;
    /*export function addToLocal(): void {
        localStorage.setItem("Combination", storageArray.toLocaleString());
    }*/
})(shop || (shop = {}));
//# sourceMappingURL=handleShop.js.map