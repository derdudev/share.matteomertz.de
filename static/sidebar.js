const sidebar = document.getElementById("sidebar");

let f1 = new Dropnode(
    "Studium",
    [
        new Dropnode(
            "Workshop",
        ),
        new Dropnode(
            "Analysis 2",
        )
    ]
);

let f2 = new Dropnode(
    "Showroom",
    [
        new Dropnode(
            "For subfolders",
            [
                new Dropnode(
                    "Subfolder 1"
                ),
                new Dropnode(
                    "Subfolder 2"
                )
            ]
        ),
        new Dropnode(
            "No Subfolders here",
        )
    ]
);

f1.build(sidebar);
f2.build(sidebar);
