class Navigator{
    constructor() {
    }

    static loadPopup(popupBuilder){
        let popup = popupBuilder();
        let onclick = popup.onclick;
        popup.onclick = (e) => {
            if(onclick) onclick(e);
            e.stopPropagation();
        }
        popup.style.minWidth = "30vh";

        let popupContainer = document.createElement("div");
        popupContainer.append(popup);
        let clickInfo = document.createElement("span");
        clickInfo.style.padding = "5px 5px";
        clickInfo.style.fontSize = ".75em";
        clickInfo.style.color = "#72716C";
        clickInfo.style.userSelect = "none";
        clickInfo.innerText = "Klicke neben das Popup, um es zu schließen";
        popupContainer.append(clickInfo);

        let background = document.createElement("div");
        background.style.backgroundColor = "rgba(0,0,0,.2)";
        background.style.zIndex = "5000";
        background.style.position = "absolute";
        background.style.display = "flex";
        background.style.alignItems = "center";
        background.style.justifyContent = "center";
        background.style.top = "0px";
        background.style.height = "100vh";
        background.style.width = "100vw";
        background.onclick = (e) => {
            if(e.target != popup){
                e.target.remove();
            }
        }

        background.append(popupContainer);
        document.body.append(background);
    }
}