//-------------------------------------------------------
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
            console.log(this);
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

    if (list.length==0) {
        var message = document.createElement('a');
        message.setAttribute("href", "#");
        message.addEventListener("click", function(e){
            showNewSongForm();
        });
        message.innerHTML = "Add a song!";
        sidebarSongList.appendChild(message);
    } else {
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
}

function reqSongDetailsListener(){
    showSongView();
    console.log(this.responseText);
    var song = JSON.parse(this.responseText);
    window.currentSongId = song.id;
    console.log(song);

    document.getElementById("song-title").innerHTML=song.name;
    document.getElementById("song-title-edit-form").innerHTML=song.name;
    document.getElementById("artist").innerHTML=song.artist;
    document.getElementById("key").innerHTML=song.key;
    document.getElementById("chords-text").innerHTML=song.chords;
    document.getElementById("lyrics-text").innerHTML=song.lyrics;
    document.getElementById("notes").innerHTML=song.notes;
// add values to song edit form
    document.getElementById("song-title-edit-form").innerText=song.name;
    document.getElementById("edit-title").value=song.name;
    document.getElementById("edit-artist").value=song.artist;
    document.getElementById("edit-key").value=song.key;
    document.getElementById("edit-chords").innerHTML=song.chords;
    document.getElementById("edit-lyrics").innerHTML=song.lyrics;
    document.getElementById("edit-notes").innerHTML=song.notes;
}

//---------------------SHOWING SONGS and SONG EDIT FORMS----------------
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
    xhr.onload = reqSongDetailsListener;
    xhr.open("get", "/api_details/" + window.currentSongId + '/');
    xhr.send();
}

function showSongEditForm() {
    var id = window.currentSongId;
    content = document.getElementById("edit-song");
    hideOtherContent();
}

function showNewSongForm() {
    window.currentSongId = 0;
    document.getElementById("song-title-edit-form").innerHTML="";
    document.getElementById("edit-title").value="";
    document.getElementById("edit-artist").value="";
    document.getElementById("edit-key").value="";
    document.getElementById("edit-chords").innerHTML="";
    document.getElementById("edit-lyrics").innerHTML="";
    document.getElementById("edit-notes").innerHTML="";
    showSongEditForm();
}


//---------------------EDITING AND ADDING SONGS---------------------
//------------------------------------------------------------------

function sendSongPost(item, url) {
    // create new FormData
    // FormData holds a set of key/value pairs to send using XMLHttpRequest. It works like a form's submit button.
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload = function () {
        reqSongDetailsListener();
        reqAllSidebarSongsListener();
    };
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
    sendSongPost(item, "/api_details/" + id + '/');
    showSong();
    showAllSidebarSongs();
}

//---------------------DELETING SONGS-------------------------------
//------------------------------------------------------------------

function sendSongDelete(id) {
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
    sendSongDelete(id);
    showAllSongs();
    showAllSidebarSongs();
}

function confirmDeleteSong() {
    document.getElementById('confirm-delete-song').style.display="block";

    document.getElementById('delete-song-btn-true').onclick = function(){
        deleteSong();
        document.getElementById('confirm-delete-song').style.display="none";
    };

    document.getElementById('delete-song-btn-false').onclick = function(){
        document.getElementById('confirm-delete-song').style.display="none";
    };
}

showAllSidebarSongs();
showAllSongs();