// Konzept-Idee: https://www.w3schools.com/howto/howto_js_slideshow_gallery.asp

let pictureNames: string[] = ["GiSBeLike.png", "ItWasAllAMystery.png", "JsTs.png", "LearningTsBeLike.png"];

document.querySelector("#buttonLeft")!.addEventListener("click", previousImage);
document.querySelector("#buttonRight")!.addEventListener("click", nextImage);

function nextImage(): void {
    changeImage(1);
}
function previousImage(): void {
    changeImage(-1);
}

function changeImage(_vorzeichen: number): void {
    for (const iterator of pictureNames) {
        let currentImage: string = (<string>document.querySelector("#imageBox img")!.getAttribute("src"));
        if (iterator == currentImage) {
            if (pictureNames.indexOf(iterator) == pictureNames.length - 1 && _vorzeichen == +1)
                document.querySelector("#imageBox img")!.setAttribute("src", `images/${pictureNames[0]}`);
            else if (pictureNames.indexOf(iterator) == 0 && _vorzeichen == -1)
                document.querySelector("#imageBox img")!.setAttribute("src", `images/${pictureNames[pictureNames.length - 1]}`);
            else 
                document.querySelector("#imageBox img")!.setAttribute("src", `images/${pictureNames[pictureNames.indexOf(iterator) + _vorzeichen]}`);
            break;
        }
    }
}

