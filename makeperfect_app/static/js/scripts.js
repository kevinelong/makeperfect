var content;

function toggleSongList() {
    var list = document.getElementById("sidebar-all-songs");
    if (list.style.display == "block") {
        list.style.display = "none";
    } else {
            list.style.display = "block";
            showAllSidebarSongs();
        }
}

function toggleListOfLists() {
    var list = document.getElementById("list-of-lists");
    if (list.style.display == "block") {
        list.style.display = "none";
    } else {
            list.style.display = "block";
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

//---------------------SHOWING SONGS AND SONG LISTS---------------------
//----------------------------------------------------------------------

function showAllSongs() {
    content = document.getElementById("all-songs");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSongsListener;
    xhr.open("get", "/api_all/");
    xhr.send();
}

function showAllSidebarSongs() {
    content = document.getElementById("sidebar-all-songs");
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSidebarSongsListener;
    xhr.open("get", "/api_all/");
    xhr.send();
}

function showSongDetails(id) {
    window.currentSongId = id;
    showSong();
}

function showSongView() {
    var id = window.currentSongId;
    content = document.getElementById("song-details");
    hideOtherContent();
}

function showSong() {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListener;
    xhr.open("get", "/api_details/" + window.currentSongId + '/');
    xhr.send();
}

function showSongEditForm() {
    content = document.getElementById("edit-song");
    hideOtherContent();
}

function showNewSongForm() {
    window.currentSongId = 0;
    document.getElementById("edit-title").value="";
    document.getElementById("edit-artist").value="";
    document.getElementById("edit-key").value="";
    document.getElementById("edit-chords").innerHTML="";
    document.getElementById("edit-lyrics").innerHTML="";
    document.getElementById("edit-notes").innerHTML="";
    showSongEditForm();
}

function showAllLists() {
    content = document.getElementById("list-of-lists");
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllListsListener;
    xhr.open("get", "/api_all_lists/");
    xhr.send();
}

function showListDetails(id) {
    window.currentListId = id;
    content = document.getElementById("song-list");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListListener;
    xhr.open("get", "/api_list/" + id + '/');
    xhr.send();
}

function showListEditForm() {
    var id = window.currentListId;
    content = document.getElementById("edit-song-list-details");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListListener;
    xhr.open("get", "/api_list/" + id + '/');
    xhr.send();
    showAvailableSongs(id);
}

function showAvailableSongs(id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAvailableSongsListener;
    xhr.open("get", "/api_all_not_in_list/" + id + '/');
    xhr.send();
}


//---------------------EDITING AND ADDING SONGS---------------------
//------------------------------------------------------------------

function sendPost(item, url) {
    // create new FormData
    // FormData holds a set of key/value pairs to send using XMLHttpRequest. It works like a form's submit button.
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload=reqListener;
    request.open("POST", url);
    request.send(form_data);
}

function sendSongDetails() {
    // creates a dictionary to hold the information on the form
    id = window.currentSongId;
    var item = {
        "action": "save",
        "id": window.currentSongId,
        "song_title": document.getElementById("edit-title").value,
        "artist" : document.getElementById("edit-artist").value,
        "key": document.getElementById("edit-key").value,
        "chords": document.getElementById("edit-chords").value,
        "lyrics": document.getElementById("edit-lyrics").value,
        "notes": document.getElementById("edit-notes").value,
    };
    // calls the sendPost function with the dictionary created and a url
    sendPost(item, "/api_details/" + id + '/');
}

//---------------------DELETING SONGS---------------------
//--------------------------------------------------------

function sendDelete(id) {
    var form_data = new FormData();
    form_data.append("id", id);
    form_data.append("action", "DELETE");
    var request = new XMLHttpRequest();
    request.onload=showAllSongs;
    request.open("POST", "/api_details/" + id + '/');
    request.send(form_data);
}

function deleteSong() {
    id = window.currentSongId;
    sendDelete(id);
}

//---------------------REQ LISTENERS---------------------
//-------------------------------------------------------

function reqAllSongsListener() {
    console.log(this.responseText);
    var list = JSON.parse(this.responseText);
    var songList = document.getElementById("all-songs-list");
    songList.innerHTML="";

    for (i=0; i <list.length; i++) {
        var song = document.createElement("a");
        id = list[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
        song.innerHTML=list[i].name;
        songList.appendChild(song);
    }
}

function reqAllSidebarSongsListener() {
    console.log(this.responseText);
    var list = JSON.parse(this.responseText);
    var sidebarSongList = document.getElementById("sidebar-all-songs");
    sidebarSongList.innerHTML="";
        for (i=0; i <list.length; i++) {
        var song = document.createElement("a");
        var id = list[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
        song.innerHTML=list[i].name;
        sidebarSongList.appendChild(song);
    }
}

function reqAllListsListener() {
    console.log(this.responseText);
    var lists = JSON.parse(this.responseText);
    var listOfLists = document.getElementById("list-of-lists");
    listOfLists.innerHTML="";

    for (var i=0; i <lists.length; i++) {
        var list = document.createElement("a");
        var id = lists[i].id;
        console.log(lists[i].id);
        list.setAttribute("href", "#");
        list.setAttribute("data-id", id);
        list.addEventListener("click", function(e){
            showListDetails(e.target.getAttribute("data-id"));
        });
        list.innerHTML=lists[i].name;
        listOfLists.appendChild(list);
    }
}

function reqListener(){
    showSongView();
    console.log(this.responseText);
    var song = JSON.parse(this.responseText);
    window.currentSongId = song.id;
    console.log(song);

    document.getElementById("song-title").innerHTML=song.name;
    document.getElementById("artist").innerHTML=song.artist;
    document.getElementById("key").innerHTML=song.key;
    document.getElementById("chords-text").innerHTML=song.chords;
    document.getElementById("lyrics-text").innerHTML=song.lyrics;
    document.getElementById("notes").innerHTML=song.notes;
// add values to song edit form
    document.getElementById("edit-title").value=song.name;
    document.getElementById("edit-artist").value=song.artist;
    document.getElementById("edit-key").value=song.key;
    document.getElementById("edit-chords").innerHTML=song.chords;
    document.getElementById("edit-lyrics").innerHTML=song.lyrics;
    document.getElementById("edit-notes").innerHTML=song.notes;
}

function reqListListener() {
    console.log(this.responseText);
    var list = JSON.parse(this.responseText);

    // List details
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
    // edit list form
    document.getElementById("edit-list-title").innerHTML=list.name;
    document.getElementById("edit-song-list-title").value=list.name;
    var editSongList = document.getElementById("songs-in-edit-list-form");
    editSongList.innerHTML="";

    for (i=0; i <list.songs.length; i++) {
        var listSong = document.createElement("a");
        id = list.songs[i].id;
        listSong.setAttribute("href", "#");
        listSong.setAttribute("data-id", id);
        listSong.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
        listSong.innerHTML=list.songs[i].name;
        editSongList.appendChild(listSong);
    }
}

function reqAvailableSongsListener() {
    console.log(this.responseText);
    var songs = JSON.parse(this.responseText);
    var availableSongs = document.getElementById("available-songs");
    availableSongs.innerHTML="";
    for (i=0; i <songs.length; i++) {
        var song = document.createElement("a");
        id = songs[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
        song.innerHTML=songs[i].name;
        availableSongs.appendChild(song);
    }
}

