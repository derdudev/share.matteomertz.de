const sidebar = document.getElementById("sidebar");

class FolderNavigation{
    constructor() {

    }
    getPathAsString(){

    }
    getPath(){

    }
}

class Path{

}

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

class Main{
    constructor() {
        this.intervalPeriod = 0;
        this.mainElement = document.getElementById("main");
        this.reset();
    }
    addLink(link){
        this.mainElement.append(link);
    }
    clear(){
        this.mainElement.innerHTML = "";
    }
    reset(){
        this.mainElement.innerHTML = "<div id=\"main-info-text\">Navigiere einfach in einen deiner Ordner oder erstelle einen Ordner, um mit Links zu arbeiten</div>";
    }
    setNone(){
        this.mainElement.innerHTML = "<div id=\"main-info-text\">Hier sind noch keine Links</div>";
    }
}

class Link{
    /*
    objectInfo: {
        title, linkId, interactions, id,
    }
     */
    constructor(objectInfo, main) {
        let linkElement = document.createElement("div");
        linkElement.className = "link-element";

        let title = document.createElement("span");
        title.className = "link-element-title";
        title.innerText = objectInfo.title;

        tippy(title, {
            arrow: false,
            delay: [400,0],
            content: objectInfo.title,
            placement: "top-start",
            animation: "scale-subtle"
        })

        let link = document.createElement("span");
        link.className = "link-element-link";
        let linkText = document.createElement("span");
        linkText.className = "link-element-link-text";
        linkText.innerText = "matteomertz.de/s/"+objectInfo.linkId;
        link.append(linkText);
        link.innerHTML += "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"M450 776H280q-83 0-141.5-58.5T80 576q0-83 58.5-141.5T280 376h170v60H280q-58.333 0-99.167 40.765-40.833 40.764-40.833 99Q140 634 180.833 675q40.834 41 99.167 41h170v60ZM325 606v-60h310v60H325Zm185 170v-60h170q58.333 0 99.167-40.765 40.833-40.764 40.833-99Q820 518 779.167 477 738.333 436 680 436H510v-60h170q83 0 141.5 58.5T880 576q0 83-58.5 141.5T680 776H510Z\"/></svg>";
        link.onclick = () => {
            // TODO
            copyTextToClipboard("https://matteomertz.de/s/"+objectInfo.linkId);
        }

        let qrCode = document.createElement("div");
        qrCode.className = "link-element-qrcode";
        qrCode.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"M120 546V216h330v330H120Zm60-60h210V276H180v210Zm-60 450V606h330v330H120Zm60-60h210V666H180v210Zm330-330V216h330v330H510Zm60-60h210V276H570v210Zm188 450v-82h82v82h-82ZM510 689v-83h82v83h-82Zm82 82v-82h83v82h-83Zm-82 83v-83h82v83h-82Zm82 82v-82h83v82h-83Zm83-82v-83h83v83h-83Zm0-165v-83h83v83h-83Zm83 82v-82h82v82h-82Z\"/></svg>";
        qrCode.onclick = () => {
            // TODO
            Navigator.loadPopup(() => {
                let popup = document.createElement("div");
                popup.style.background = "#fff";
                popup.style.padding = "20px 30px";

                let title = document.createElement("div");
                title.innerText = "QR-Code";
                title.style.color = "#B4B3AF";
                title.style.paddingBottom = "20px";
                popup.append(title);

                let contentContainer = document.createElement("div");
                contentContainer.style.display = "flex";
                contentContainer.style.alignItems = "center";
                contentContainer.style.justifyContent = "stretch";
                contentContainer.style.flexDirection = "column";

                let canvas = document.createElement("canvas");
                new QRious({
                    element: canvas,
                    size: 256,
                    value: "https://matteomertz.de/s/"+objectInfo.linkId
                });
                contentContainer.append(canvas);

                let name = document.createElement("div");
                name.style.textAlign = "center";
                name.style.maxWidth = canvas.width+"px";
                name.style.fontWeight = "bold";
                name.style.marginTop = "10px";
                name.innerText = objectInfo.title;

                let link = document.createElement("span");
                link.style.textAlign = "center";
                link.style.maxWidth = canvas.width+"px";
                link.style.marginTop = "10px";
                link.style.marginBottom = "20px";
                link.style.fontFamily = "Roboto Mono";
                link.style.fontSize = ".95em";
                link.innerText = "https://matteomertz.de/s/"+objectInfo.linkId;

                let downloadPngBtn = document.createElement("div");
                downloadPngBtn.innerText = "Download PNG";
                downloadPngBtn.className = "primary-btn";
                downloadPngBtn.style.textAlign = "center";
                downloadPngBtn.style.display = "block";
                downloadPngBtn.style.width = "unset";
                downloadPngBtn.onclick = () => {
                    canvas.toBlob((blob) => {
                        let a = document.createElement("a");
                        a.href = window.URL.createObjectURL(blob);
                        a.setAttribute("download", "matteomertz-"+objectInfo.linkId+".png")
                        document.body.append(a);
                        a.click();
                    });
                }

                let downloadPngContainer = document.createElement("div");
                downloadPngContainer.style.width = canvas.width + "px";
                downloadPngContainer.append(downloadPngBtn);

                contentContainer.append(name, link, downloadPngContainer);

                popup.append(contentContainer)

                return popup;
            });
        }

        let interactions = document.createElement("div");
        interactions.className = "link-element-interactions";
        interactions.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path fill=\"#72716C\" d=\"M160 896V456h140v440H160Zm250 0V256h140v640H410Zm250 0V616h140v280H660Z\"/></svg>";
        let interactionsText = document.createElement("span");
        interactionsText.className = "link-element-interactions-text";
        interactionsText.innerText = objectInfo.interactions;
        interactions.append(interactionsText);

        let editBtn = document.createElement("div");
        editBtn.className = "link-element-edit secondary-btn";
        editBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path fill=\"#72716C\" d=\"M797 398 665 266l38-39q20-20 49-20t52 21l33 32q23 22 20.5 51T835 360l-38 38Zm-41 41L247 948H115V816l508-508 133 131Z\"/></svg>";
        editBtn.innerHTML += "Bearbeiten";
        editBtn.onclick = () => {
            // TODO
            Navigator.loadPopup(() => {
                let popup = document.createElement("div");
                popup.style.background = "#fff";
                popup.style.padding = "20px 30px";

                let title = document.createElement("div");
                title.innerText = "Link Bearbeiten";
                title.style.color = "#B4B3AF";
                title.style.paddingBottom = "20px";
                popup.append(title);

                let linkFieldContainer = document.createElement("div");
                linkFieldContainer.className = "input";
                linkFieldContainer.setAttribute("desc", "Ziel-URL");
                let linkFieldFlexContainer = document.createElement("div");
                linkFieldFlexContainer.style.display = "flex";
                let linkField = document.createElement("input");
                linkField.className = "input-element";
                linkField.type = "text";
                linkField.placeholder = "https://example.com";
                linkField.value = objectInfo.link;
                linkFieldFlexContainer.append(linkField);
                linkFieldContainer.append(linkFieldFlexContainer);

                let titleFieldContainer = document.createElement("div");
                titleFieldContainer.className = "input";
                titleFieldContainer.setAttribute("desc", "Titel");
                let titleFieldFlexContainer = document.createElement("div");
                titleFieldFlexContainer.style.display = "flex";
                let titleField = document.createElement("input");
                titleField.className = "input-element";
                titleField.type = "text";
                titleField.placeholder = "Beispiel Titel";
                titleField.value = objectInfo.title;
                titleFieldFlexContainer.append(titleField);
                titleFieldContainer.append(titleFieldFlexContainer);

                let actionButtonContainer = document.createElement("div");
                actionButtonContainer.style.marginTop = "20px";
                let editButton = document.createElement("div");
                editButton.innerText = "Speichern";
                editButton.className = "primary-btn";
                editButton.style.textAlign = "center";
                editButton.style.display = "block";
                editButton.style.width = "unset";
                actionButtonContainer.append(editButton);

                popup.append(linkFieldContainer, titleFieldContainer, actionButtonContainer);

                return popup;
            });
        }

        linkElement.append(title, link, qrCode, interactions, editBtn);
        main.addLink(linkElement);
    }
}

let main = new Main();

let dropdown = new Dropdown({main: main});

const newLinkBtn = document.getElementById("new-link-btn");
const newLinkBtnDeactivatedTippy = tippy(newLinkBtn, {
    arrow: true,
    trigger: "click",
    content: "Navigiere erst in einen Ordner!",
    placement: "bottom",
    animation: "shift-away",
    duration: [100,100]
});

newLinkBtn.onclick = () => {
    if(dropdown.activeNode != null) {
        Navigator.loadPopup(() => {
            let popup = document.createElement("div");
            popup.style.background = "#fff";
            popup.style.padding = "20px 30px";

            let title = document.createElement("div");
            title.innerText = "Neuer Link";
            title.style.color = "#B4B3AF";
            title.style.paddingBottom = "20px";
            popup.append(title);

            let linkFieldContainer = document.createElement("div");
            linkFieldContainer.className = "input";
            linkFieldContainer.setAttribute("desc", "Ziel-URL");
            let linkFieldFlexContainer = document.createElement("div");
            linkFieldFlexContainer.style.display = "flex";
            let linkField = document.createElement("input");
            linkField.className = "input-element";
            linkField.type = "text";
            linkField.placeholder = "https://example.com";
            linkFieldFlexContainer.append(linkField);
            linkFieldContainer.append(linkFieldFlexContainer);

            let titleFieldContainer = document.createElement("div");
            titleFieldContainer.className = "input";
            titleFieldContainer.setAttribute("desc", "Titel");
            let titleFieldFlexContainer = document.createElement("div");
            titleFieldFlexContainer.style.display = "flex";
            let titleField = document.createElement("input");
            titleField.className = "input-element";
            titleField.type = "text";
            titleField.placeholder = "Beispiel Titel";
            titleFieldFlexContainer.append(titleField);
            titleFieldContainer.append(titleFieldFlexContainer);

            let actionButtonContainer = document.createElement("div");
            actionButtonContainer.style.marginTop = "20px";
            let createButton = document.createElement("div");
            createButton.innerText = "Erstellen";
            createButton.className = "primary-btn";
            createButton.style.textAlign = "center";
            createButton.style.display = "block";
            createButton.style.width = "unset";
            actionButtonContainer.append(createButton);

            popup.append(linkFieldContainer, titleFieldContainer, actionButtonContainer);

            return popup;
        });
    }
}

const onFolderClick = (objectInfo) => {
    console.log(dropdown.activeNode)
    if(dropdown.activeNode == null){
        newLinkBtnDeactivatedTippy.enable();
    } else {
        newLinkBtnDeactivatedTippy.disable();
        fetch("/api/get",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    interval: main.intervalPeriod,
                    folderId: objectInfo.id
                })
            }).then(data => data.json()).then(data => {
            main.clear();
            if(data.length == 0){
                main.setNone();
            } else {
                let link, dbLink;
                for (let i = 0; i < data.length; i++) {
                    dbLink = data[i];
                    link = new Link({
                        title: dbLink.title,
                        link: dbLink.link,
                        linkId: dbLink.id,
                        id: dbLink._id,
                        interactions: dbLink.interactions
                    }, main);
                }
            }
        });
    }
}

const load = (childrenContainer, preLoadedChildren, objectInfo) => {
    fetch("/api/subfolders",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            folderId: objectInfo.id
        })
    }).then(data => data.json()).then(data => {
        if(data.length == 0){
            childrenContainer.innerHTML = "<div class=\"no-children\">No subfolder</div>";
        } else {
            let dn, subfolder;
            for (let i = 0; i < data.length; i++) {
                subfolder = data[i];
                dn = new Dropnode(
                    subfolder.name,
                    [],
                    {
                        id: subfolder._id,
                        name: subfolder.name
                    },
                    dropdown,
                    load,
                    onFolderClick
                );
                dn.build(childrenContainer);
            }
        }
    })
}

fetch("/api/folders").then(data => data.json()).then((data) => {
    if(data.length == 0){
        let info = document.createElement("span");
        info.innerHTML = "No folders here";
        info.className = "no-children";
        sidebar.append(info);
    } else {
        let dn, folder;
        for (let i = 0; i < data.length; i++) {
            folder = data[i];
            dn = new Dropnode(
                folder.name,
                [],
                {
                    id: folder._id,
                    name: folder.name
                },
                dropdown,
                load,
                onFolderClick
            );
            dn.build(sidebar);
        }
    }
});
