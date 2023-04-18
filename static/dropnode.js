class Dropnode {
    constructor(title, children, load) {
        this.title = title;
        if(children == null){
            this.children = [];
        } else {
            this.children = children;
        }
        if(load == null){
            this.load = () => {

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

        if(this.children.length == 0){
            children.innerHTML = "<div class=\"no-children\">No subfolder</div>";
        } else {
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].build(children);
            }
        }

        // Folder Header
        let folderHeader = document.createElement("div");
        folderHeader.className = "folder-header";
        let expandBtn = document.createElement("div");
        expandBtn.className = "expand-btn";
        expandBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"m375 840-67-67 198-198-198-198 67-67 265 265-265 265Z\"/></svg>";
        expandBtn.onclick = () => {
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
        folderHeader.append(expandBtn, folderName);

        dropdownElement.append(folderHeader, children);

        this.domElement = dropdownElement;
        parent.append(dropdownElement);
    }
}