class Dropdown{
    constructor(objectInfo) {
        this.nodes = [];
        this.activeNode = null;
        this.objectInfo = objectInfo;
        this.folderNavigation = null;
    }

    addNode(node){
        this.nodes.push(node);
    }

    getNode(id){
        for (let i = 0; i < this.nodes.length; i++) {
            if(this.nodes[i].objectInfo.id == id) return this.nodes[i];
        }
        return null;
    }

    updateFolderNavigation(){
        if(this.folderNavigation != null){
            this.folderNavigation.update();
            return true;
        }
        return false;
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

let main = new Main();

let dropdown = new Dropdown({main: main});