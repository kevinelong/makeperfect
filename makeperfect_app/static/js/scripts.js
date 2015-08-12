var content;

function toggleSongs() {
    var setlist = document.getElementById("sidebar-all-songs");
    if (setlist.style.display == "none") {
        setlist.style.display = "block";
            //showAllSidebarSongs();
    } else {
            setlist.style.display = "none";
        }
}

function toggleSetlists() {
    var setlist = document.getElementById("list-of-sets");
    if (setlist.style.display == "none") {
        setlist.style.display = "block";

    } else {
            setlist.style.display = "none";

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
