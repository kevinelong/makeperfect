var content;

function toggleListOfSongs() {
    var list = document.getElementById("sidebar-all-songs");
    if (list.style.display == "none") {
        list.style.display = "block";
            //showAllSidebarSongs();
    } else {
            list.style.display = "none";
        }
}

function toggleListOfSets() {
    var list = document.getElementById("list-of-sets");
    if (list.style.display == "none") {
        list.style.display = "block";

    } else {
            list.style.display = "none";

        }
}

function hideOtherContent(){
    var otherContent = document.getElementsByClassName("main-content");
    for (i=0; i < otherContent.length; i++) {
        otherContent[i].style.display = 'none';
    }
    window.scrollTo(0, 0);
    content.style.display = 'block';
}
