class Navigator{
    static popups = [];

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

        Navigator.popups.push(background);
    }

    static closeUpperPopup(){
        Navigator.popups[Navigator.popups.length-1].remove();
    }
}

class FieldPopup{
    constructor(fieldList, actionButtonList) {
    }

    remove(){
        // dom element remove function
    }
}

class Field{
    /*
    options = {
        description: String,
        placeholder: String,
        domId: String
    }
     */
    constructor(options) {
        this.options = options;

        let domFieldContainer = document.createElement("div");
        domFieldContainer.className = "input";
        domFieldContainer.setAttribute("desc", options.description);

        let domFieldFlexContainer = document.createElement("div");
        domFieldFlexContainer.style.display = "flex";

        let domField = document.createElement("input");
        domField.className = "input.element";
        domField.type = "text";
        domField.placeholder = options.placeholder;
        domField.id = options.domId;

        domFieldFlexContainer.append(domField);
        domFieldContainer.append(domFieldFlexContainer);

        this.domElement = domFieldContainer;
        this.domField = domField;
    }
}

class PopupActionButton{
    constructor() {
    }
}