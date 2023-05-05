class Link{
    /*
    objectInfo: {
        title, linkId, interactions, id,
    }
     */
    constructor(objectInfo, main) {
        this.objectInfo = objectInfo;

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
        });

        this.title = title;

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
                contentContainer.style.padding = "20px 30px"

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
                editButton.style.marginBottom = "10px";
                editButton.className = "primary-btn";
                editButton.style.textAlign = "center";
                editButton.style.display = "block";
                editButton.style.width = "unset";
                editButton.onclick = () => {
                    if(titleField.value != "" && linkField.value != ""){
                        fetch("/api/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: this.objectInfo.id,
                                title: titleField.value,
                                link: linkField.value
                            })
                        }).then(data => data.json()).then(data => {
                            if(data.acknowledged){
                                this.objectInfo.title = titleField.value;
                                this.objectInfo.link = linkField.value;
                                this.title.innerText = this.objectInfo.title;
                                Navigator.closeUpperPopup();
                            }
                        })
                    }
                }

                let separator = document.createElement("hr");
                separator.style.border = "none";
                separator.style.height = "2px";
                separator.style.background = "#DFDEDD";

                let deleteButton = document.createElement("div");
                deleteButton.innerText = "Diesen Link löschen";
                deleteButton.className = "primary-btn negative-button";
                deleteButton.style.marginTop = "10px";
                deleteButton.style.textAlign = "center";
                deleteButton.style.display = "block";
                deleteButton.style.width = "unset";
                deleteButton.onclick = () => {
                    fetch("/api/delete", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            linkId: this.objectInfo.id
                        })
                    }).then(data => data.json()).then(data => {
                        if(data.acknowledged){
                            this.remove();
                            Navigator.closeUpperPopup();
                        } else {
                            // TODO: error handling
                        }
                    })
                }

                actionButtonContainer.append(editButton, separator, deleteButton);

                contentContainer.append(linkFieldContainer, titleFieldContainer, actionButtonContainer)

                popup.append(contentContainer);

                return popup;
            });
        }

        linkElement.append(title, link, qrCode, interactions, editBtn);
        main.addLink(linkElement);

        this.linkElement = linkElement;
    }

    remove(){
        this.linkElement.remove();
    }
}