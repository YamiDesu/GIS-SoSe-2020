"use strict";
//var lastname = localStorage.getItem("key");
document.querySelector("#confirmOrder").addEventListener("click", printOrder);
document.querySelector("#sendOrder").addEventListener("click", confirmOrder);
let orderArray = [];
let orderNumber = 0;
async function printOrder() {
    for (const key in localStorage) {
        if (localStorage.getItem(key) != null) {
            let content = localStorage.getItem(key);
            let contentObj = await JSON.parse(content);
            let contentString = "{";
            let countFlavour = 1;
            let countTopping = 1;
            for (const keys of contentObj)
                if (keys.category == "container")
                    contentString += `"container"` + ":" + `"${keys.name}"` + ",";
            for (const keys of contentObj)
                if (keys.category == "flavour") {
                    contentString += `"flavour${countFlavour}"` + ":" + `"${keys.name}"` + ",";
                    countFlavour++;
                }
            for (const keys of contentObj)
                if (keys.category == "topping") {
                    contentString += `"topping${countTopping}"` + ":" + `"${keys.name}"` + ",";
                    countTopping++;
                }
            contentString = contentString.slice(0, contentString.length - 1) + "}";
            console.log("string", contentString);
            orderArray.push(contentString);
            document.querySelector("#check").innerHTML += content;
            console.log(contentObj);
        }
    }
}
async function confirmOrder() {
    for (const iterator of orderArray) {
        await fetch("http://localhost:8100", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: iterator
        });
    }
}
//# sourceMappingURL=warenkorb.js.map