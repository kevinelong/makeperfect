function showAllSongs() {
    var content = document.getElementById("all-songs");
    var otherContent = document.getElementsByClassName("main-content");
    for (i=0; i < otherContent.length; i++) {
        otherContent[i].style.display = 'none';
    }
    content.style.display = 'block';

}

function toggleSongList() {
    var list = document.getElementById("sidebar-all-songs");
    if (list.style.display == "block") {
        list.style.display = "none";
    } else {
            list.style.display = "block";
        }
}

function reqListener(){
    console.log(this.responseText);
    song = JSON.parse(this.responseText);
    console.log(song);
    console.log("Song List Name = ", song.list);
    document.getElementById("song-title").innerHTML=song.name;
    document.getElementById("artist").innerHTML=song.artist;
    document.getElementById("key").innerHTML=song.key;
    document.getElementById("chords-text").innerHTML=song.chords;
    document.getElementById("lyrics-text").innerHTML=song.lyrics;
    document.getElementById("notes").innerHTML=song.notes;

    document.getElementById("edit-title").value=song.name;
    document.getElementById("edit-artist").value=song.artist;
    document.getElementById("edit-key").value=song.key;
    document.getElementById("edit-chords").innerHTML=song.chords;
    document.getElementById("edit-lyrics").innerHTML=song.lyrics;
    document.getElementById("edit-notes").innerHTML=song.notes;
}

function reqListListener() {
    console.log(this.responseText);
    list = JSON.parse(this.responseText);
    document.getElementById("list-title").innerHTML=list.name;
    var songList = document.getElementById("songs-in-list");
    songList.innerHTML="";

    for (i=0; i <list.songs.length; i++) {
        var song = document.createElement("a");
        id = list.songs[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
        song.innerHTML=list.songs[i].name;
        songList.appendChild(song);
    }
}

function showSongDetails(id) {
    var content = document.getElementById("song-details");
    var otherContent = document.getElementsByClassName("main-content");
    for (i=0; i < otherContent.length; i++) {
        otherContent[i].style.display = 'none';
    }
    content.style.display = 'block';
    window.scrollTo(0, 0);
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListener;
    xhr.open("get", "/api_details/" + id);
    xhr.send();
}

function showSongEditForm(id) {
    var content = document.getElementById("edit-song");
    var otherContent = document.getElementsByClassName("main-content");
    for (i=0; i < otherContent.length; i++) {
        otherContent[i].style.display = 'none';
    }
    content.style.display = 'block';
    window.scrollTo(0, 0);
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListener;
    xhr.open("get", "/api_details/" + id);
    xhr.send();
}

function showListDetails(id) {
    var content = document.getElementById("song-list");
    var otherContent = document.getElementsByClassName("main-content");
    for (i=0; i < otherContent.length; i++) {
        otherContent[i].style.display = 'none';
    }
    content.style.display = 'block';
    window.scrollTo(0, 0);
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListListener;
    xhr.open("get", "/api_list/" + id);
    xhr.send();
}