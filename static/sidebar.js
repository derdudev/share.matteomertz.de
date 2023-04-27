const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");

let dropdown = new Dropdown();

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
                    (objectInfo) => {
                        console.log("Loading " + objectInfo.name + " items")
                    }
                );
                dn.build(childrenContainer);
            }
        }
    })
}

fetch("/api/folders").then(data => data.json()).then((data) => {
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
            (objectInfo) => console.log("Loading " + objectInfo.name + " items")
        );
        dn.build(sidebar);
    }
});
