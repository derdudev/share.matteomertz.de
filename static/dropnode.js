class Dropnode {
    constructor(title, children, objectInfo, dropdown, load, onclick) {
        this.title = title;
        this.childElementsLoaded = false;
        this.clicked = false;
        this.dropdown = dropdown;
        dropdown.addNode(this);
        if(objectInfo == null){
            this.objectInfo = {};
        } else {
            this.objectInfo = objectInfo;
        }
        if(onclick == null) this.onclick = () => {};
        else this.onclick = onclick;
        if(children == null){
            this.children = [];
        } else {
            this.children = children;
        }
        if(load == null){
            this.load = (childrenContainer, preLoadedChildren, objectInfo) => {
                if(preLoadedChildren.length == 0){
                    childrenContainer.innerHTML = "<div class=\"no-children\">No subfolder</div>";
                } else {
                    for (let i = 0; i < this.children.length; i++) {
                        preLoadedChildren[i].build(childrenContainer);
                    }
                }
            }
        } else {
            this.load = load;
        }
    }

    // builds the actual html dom element that gets displayed (with all event listeners attached)
    build(parent){
        let dropdownElement = document.createElement("div");
        dropdownElement.className = "dropdown-element";

        // Children
        let children = document.createElement("div");
        children.className = "children";

        // Folder Header
        let folderHeader = document.createElement("div");
        folderHeader.className = "folder-header";
        let expandBtn = document.createElement("div");
        expandBtn.className = "expand-btn";
        expandBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"m375 840-67-67 198-198-198-198 67-67 265 265-265 265Z\"/></svg>";
        expandBtn.onclick = () => {
            if(!this.childElementsLoaded) {
                this.load(children, this.children, this.objectInfo);
                this.childElementsLoaded = true;
            }

            if(children.style.display == "none" || children.style.display == ""){
                children.style.display = "block";
                expandBtn.children.item(0).style.transform = "rotate(90deg)";
            } else {
                children.style.display = "none";
                expandBtn.children.item(0).style.transform = "";
            }
        }

        let folderName = document.createElement("span");
        folderName.className = "folder-name";
        folderName.innerText = this.title;

        folderHeader.onclick = (e) => {
            if(e.target == folderHeader || e.target == folderName){
                this._toggleClicked();
                this.onclick(this.objectInfo);
            }
        }

        let moreButton = document.createElement("div");
        moreButton.className = "expand-btn";
        moreButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"M184.783 635Q161 635 143.5 617.7T126 576.106Q126 551 143.373 534t41.769-17q23.458 0 41.658 16.894 18.2 16.894 18.2 41.5T226.783 617.5q-18.217 17.5-42 17.5Zm295.823 0Q456 635 438.5 617.7T421 576.106Q421 551 438.3 534t41.594-17Q505 517 522 533.894t17 41.5Q539 600 522.106 617.5t-41.5 17.5Zm294.288 0q-24.823 0-42.359-17.3Q715 600.4 715 576.106 715 551 732.677 534t42.5-17Q800 517 817.5 533.894t17.5 41.5Q835 600 817.358 617.5 799.717 635 774.894 635Z\"/></svg>";
        tippy(moreButton, {
            arrow: false,
            content: "Umbenennen, Löschen, ...",
            placement: "bottom",
        })

        let addSubFolder = document.createElement("div");
        addSubFolder.className = "expand-btn";
        addSubFolder.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z\"/></svg>";
        tippy(addSubFolder, {
            arrow: false,
            content: "Neuen Unterordner erstellen",
            placement: "bottom",
        })

        folderHeader.append(expandBtn, folderName, moreButton, addSubFolder);

        moreButton.style.display = "none";
        addSubFolder.style.display = "none";
        folderHeader.onmouseenter = () => {
            moreButton.style.display = "block";
            addSubFolder.style.display = "block";
        }
        folderHeader.onmouseleave = () => {
            moreButton.style.display = "none";
            addSubFolder.style.display = "none";
        }

        dropdownElement.append(folderHeader, children);

        this.domElements = {
            dropdownElement: dropdownElement,
            children: children,
            folderHeader: folderHeader,
            expandBtn: expandBtn,
            folderName: folderName
        }

        parent.append(dropdownElement);
    }

    _toggleClicked(){
        if(this.clicked){
            // was already clicked => deactivate
            this.domElements.folderName.style.fontWeight = "normal";
            this.domElements.folderName.style.color = "#72716C";

            this.domElements.folderHeader.style.background = "none";
            this.clicked = false;
            dropdown.activeNode = null;
            dropdown.objectInfo.main.reset();
        } else {
            // was newly clicked => activate
            this._deactivateOthers();

            this.domElements.folderName.style.fontWeight = "bold";
            this.domElements.folderName.style.color = "#37352F";

            this.domElements.folderHeader.style.backgroundColor = "#ededeb";
            this.clicked = true;
            dropdown.activeNode = this;
        }
    }

    _deactivateOthers(){
        for (let i = 0; i < this.dropdown.nodes.length; i++) {
            if(this.dropdown.nodes[i] != this && this.dropdown.nodes[i].clicked){
                this.dropdown.nodes[i]._toggleClicked();
                break;
            }
        }
    }
}

class Dropdown{
    constructor(objectInfo) {
        this.nodes = [];
        this.activeNode = null;
        this.objectInfo = objectInfo;
    }

    addNode(node){
        this.nodes.push(node);
    }
}