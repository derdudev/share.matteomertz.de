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

        folderHeader.append(expandBtn, folderName);

        dropdownElement.append(folderHeader, children);

        this.domElements = {
            dropdownElement: dropdownElement,
            children: children,
            folderHeader: folderHeader,
            expandBtn: expandBtn,
            folderName: folderName
        }

        this.domElement = dropdownElement;
        parent.append(dropdownElement);
    }

    _toggleClicked(){
        if(this.clicked){
            // was already clicked => deactivate
            this.domElements.folderName.style.fontWeight = "normal";
            this.domElements.folderName.style.color = "#72716C";

            this.domElements.folderHeader.style.background = "none";
            this.clicked = false;
        } else {
            // was newly clicked => activate
            this._deactivateOthers();

            this.domElements.folderName.style.fontWeight = "bold";
            this.domElements.folderName.style.color = "#37352F";

            this.domElements.folderHeader.style.backgroundColor = "#ededeb";
            this.clicked = true;
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
    constructor() {
        this.nodes = [];
    }

    addNode(node){
        this.nodes.push(node);
    }
}