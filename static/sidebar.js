const sidebar = document.getElementById("sidebar");

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

            let contentContainer = document.createElement("div");
            contentContainer.style.padding = "20px 30px";

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

            contentContainer.append(linkFieldContainer, titleFieldContainer, actionButtonContainer);
            popup.append(contentContainer);

            return popup;
        });
    }
}

const onFolderClick = (objectInfo) => {
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
                        parent: subfolder.parent,
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
                    parent: null,
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
