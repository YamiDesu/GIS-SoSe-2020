"use strict";
var frontShop;
(function (frontShop) {
    fixCartCount();
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
})(frontShop || (frontShop = {}));
//# sourceMappingURL=index.js.map