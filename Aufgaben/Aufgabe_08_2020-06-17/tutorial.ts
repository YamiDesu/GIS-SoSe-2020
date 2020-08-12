
namespace tutorial08 {

    /*console.log(formData.get("vorname"));

    for (let entry of formData) {
        console.log(entry);
        console.log("name: " + entry[0]);
        console.log("value: " + entry[1]);
    }*/

    // Trennlinie

    (<HTMLButtonElement>document.querySelector("#theButton")).addEventListener("click", communicate);

    //communicate("https://theoneandgis.herokuapp.com/");

    async function communicate(): Promise<void> {

        // let response: Response = await fetch(_url);
        // let jsonObj = await response.json();

        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://theoneandgis.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        url += "?" + query.toString();

        let response: Response = await fetch(url);
        let theAnswer: string = await response.url;


        // await fetch(url);
        console.log(theAnswer);
    }

    console.log("hello");



}
