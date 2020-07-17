//var lastname = localStorage.getItem("key");

(<HTMLElement>document.querySelector("#confirmOrder")).addEventListener("click", printOrder);
(<HTMLElement>document.querySelector("#sendOrder")).addEventListener("click", confirmOrder);

interface LocalProduct {
    [type: string]: string | number; //| string[] | undefined;
}

let orderArray: string[] = [];
let orderNumber: number = 0;

async function printOrder(): Promise<void> {
    for (const key in localStorage) {
        if (localStorage.getItem(key) != null) {
            let content: string = localStorage.getItem(key)!;
            let contentObj: LocalProduct[] = await JSON.parse(content);
            let contentString: string = "{";
            let countFlavour: number = 1;
            let countTopping: number = 1;

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

            contentString = contentString.slice(0, contentString.length - 1 ) + "}";
            console.log("string", contentString);
            orderArray.push(contentString);

            (<HTMLElement>document.querySelector("#check")).innerHTML += content ;
            console.log(contentObj);
        }
    }
}

async function confirmOrder(): Promise<void> {
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