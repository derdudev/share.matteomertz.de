class FolderNavigation{
    constructor(dropdown, domContainer) {
        this.dropdown = dropdown;
        this.dropdown.folderNavigation = this;
        this.domContainer = domContainer;
        this.path = new Path();
    }
    getPathAsString(){
        return this.path.asString();
    }
    getPath(){
        return this.path;
    }

    update(){
        // lookup activeNode in dropdown
        if(this.dropdown.activeNode != null){
            this.path = this.dropdown.activeNode.path;
            this.domContainer.innerHTML = this.getPathAsString();
        } else {
            this.path = new Path();
            this.domContainer.innerHTML = "Main";
        }
    }
}

class Path{
    constructor(elements) {
        if(elements == null){
            this.pathElements = [];
        } else {
            this.pathElements = elements;
        }
    }

    append(element){
        this.pathElements.push(element);
    }

    asString(){
        let res = "";
        if(this.pathElements.length != 0) res = this.pathElements[0].toString();
        for (let i = 1; i < this.pathElements.length; i++) {
            res += " / " + this.pathElements[i].toString();
        }
        return res;
    }

    copy(){
        return new Path([... this.pathElements]);
    }
}

const folderNavigationDom = document.getElementById("folder-navigation");

const folderNavigation = new FolderNavigation(dropdown, folderNavigationDom);