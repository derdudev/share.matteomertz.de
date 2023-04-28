const sidebar = document.getElementById("sidebar");

class Navigation{
    constructor() {

    }
}

class Main{
    constructor() {
        this.intervalPeriod = 0;
        this.mainElement = document.getElementById("main");
    }
    addLink(link){
        this.mainElement.append(link);
    }
    clear(){
        this.mainElement.innerHTML = "";
    }
    setNone(){
        this.mainElement.innerHTML = "Keine Links hier";
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

        let link = document.createElement("span");
        link.className = "link-element-link";
        let linkText = document.createElement("span");
        linkText.className = "link-element-link-text";
        linkText.innerText = "matteomertz.de/s/"+objectInfo.linkId;
        link.append(linkText);
        link.innerHTML += "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"M450 776H280q-83 0-141.5-58.5T80 576q0-83 58.5-141.5T280 376h170v60H280q-58.333 0-99.167 40.765-40.833 40.764-40.833 99Q140 634 180.833 675q40.834 41 99.167 41h170v60ZM325 606v-60h310v60H325Zm185 170v-60h170q58.333 0 99.167-40.765 40.833-40.764 40.833-99Q820 518 779.167 477 738.333 436 680 436H510v-60h170q83 0 141.5 58.5T880 576q0 83-58.5 141.5T680 776H510Z\"/></svg>";
        link.onclick = () => {
            // TODO
        }

        let qrCode = document.createElement("div");
        qrCode.className = "link-element-qrcode";
        qrCode.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"M120 546V216h330v330H120Zm60-60h210V276H180v210Zm-60 450V606h330v330H120Zm60-60h210V666H180v210Zm330-330V216h330v330H510Zm60-60h210V276H570v210Zm188 450v-82h82v82h-82ZM510 689v-83h82v83h-82Zm82 82v-82h83v82h-83Zm-82 83v-83h82v83h-82Zm82 82v-82h83v82h-83Zm83-82v-83h83v83h-83Zm0-165v-83h83v83h-83Zm83 82v-82h82v82h-82Z\"/></svg>";
        qrCode.onclick = () => {
            // TODO
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
        }

        linkElement.append(title, link, qrCode, interactions, editBtn);
        main.addLink(linkElement);
    }
}

let dropdown = new Dropdown();
let main = new Main();

const onFolderClick = (objectInfo) => {
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
                    linkId: dbLink.id,
                    id: dbLink._id,
                    interactions: dbLink.interactions
                }, main);
            }
        }
    });
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
