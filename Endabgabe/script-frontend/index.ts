
namespace frontShop {

    fixCartCount();

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

}