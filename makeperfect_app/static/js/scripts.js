var content;

function toggleSongList() {
    var list = document.getElementById("sidebar-all-songs");
    if (list.style.display == "none") {
        list.style.display = "block";
            //showAllSidebarSongs();
    } else {
            list.style.display = "none";
        }
}

function toggleListOfLists() {
    var list = document.getElementById("list-of-lists");
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
    //content = document.getElementById("sidebar-all-songs");
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

function showAllListsInSidebar() {
    content = document.getElementById("list-of-lists");
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllListsListener;
    xhr.open("get", "/api_all_lists/");
    xhr.send();
}

function showAllLists() {
    content = document.getElementById("all-lists");
    hideOtherContent();
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
    if (id=="0") {
        var songsInListMessage = document.getElementById("songs-in-edit-list-form");
        var message =  document.createElement('p');
        message.innerHTML = "There are no songs in this list.";
        songsInListMessage.appendChild(message);
    }
    document.getElementById("edit-song-list-title").value="";
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListListener;
    xhr.open("get", "/api_list/" + id + '/');
    xhr.send();
    showAvailableSongs(id);
}

function showNewListForm() {
    window.currentListId = 0;
    document.getElementById("list-title").innerHTML="";
    document.getElementById("edit-song-list-title").value="";
    document.getElementById("edit-list-title").innerHTML="";
    document.getElementById("songs-in-edit-list-form").innerHTML="";
    document.getElementById("available-songs").innerHTML="";
    showListEditForm();
}

function showAvailableSongs(id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAvailableSongsListener;
    xhr.open("get", "/api_all_not_in_list/" + id + '/');
    xhr.send();
}


//---------------------EDITING AND ADDING SONGS AND LISTS---------------------
//----------------------------------------------------------------------------

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
    request.onload=reqSongDetailsListener;
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
    showAllSidebarSongs();
}

function sendListPost(item, url) {
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload=reqListListener;
    request.open("POST", url);
    request.send(form_data);
}

function sendListDetails () {
    id = window.currentListId;
    var item = {
        "action": "save",
        "id": window.currentListId,
        "list_name": document.getElementById("edit-song-list-title").value
    };
    sendListPost(item, "/api_list/" + id + '/');
    showAllListsInSidebar();
    showListDetails(id);
}

//---------------------DELETING SONGS AND LISTS---------------------
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

function sendListDelete(id) {
    var form_data = new FormData();
    form_data.append("id", id);
    form_data.append("action", "DELETE");
    var request = new XMLHttpRequest();
    request.onload=reqListListener;
    request.open("POST", "/api_list/" + id + '/');
    request.send(form_data);
}

function deleteList() {
    id = window.currentListId;
    sendListDelete(id);
    showAllLists();
}

function confirmDeleteSong() {
    document.getElementById('confirm-delete-song').style.display="block";

    document.getElementById('delete-song-btn-true').onclick = function(){
        deleteSong();
    };

    document.getElementById('delete-song-btn-false').onclick = function(){
        document.getElementById('confirm-delete-song').style.display="none";
        return false;
    };
}

function confirmDeleteList() {
    document.getElementById('confirm-delete-list').style.display="block";

    document.getElementById('delete-list-btn-true').onclick = function(){
        deleteList();
    };

    document.getElementById('delete-list-btn-false').onclick = function(){
        document.getElementById('confirm-delete-list').style.display="none";
        return false;
    };
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

function reqAllListsListener() {
    console.log(this.responseText);
    var lists = JSON.parse(this.responseText);
    var listOfLists = document.getElementById("list-of-lists");
    listOfLists.innerHTML="";

    if (lists.length==0){
        var message = document.createElement('a');
        message.setAttribute("href", "#");
        message.addEventListener("click", function(e){
            showNewListForm();
        });
        message.innerHTML = "Add a list!";
        listOfLists.appendChild(message);
    } else {
        for (var i=0; i <lists.length; i++) {
            var list = document.createElement("a");
            var id = lists[i].id;
            list.setAttribute("href", "#");
            list.setAttribute("data-id", id);
            list.addEventListener("click", function(e){
                showListDetails(e.target.getAttribute("data-id"));
            });
            list.innerHTML=lists[i].name;
            listOfLists.appendChild(list);
        }

        var allLists = document.getElementById("all-lists-list");
        allLists.innerHTML="";
        for (var i=0; i <lists.length; i++) {
            list = document.createElement("a");
            id = lists[i].id;
            list.setAttribute("href", "#");
            list.setAttribute("data-id", id);
            list.addEventListener("click", function(e){
                showListDetails(e.target.getAttribute("data-id"));
            });
            list.innerHTML=lists[i].name;
            allLists.appendChild(list);
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
    window.currentListId = list.id;
    console.log(window.currentListId);
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
        var songContainer = document.createElement("div");
        var listSong = document.createElement("a");
        id = list.songs[i].id;
        listSong.setAttribute("href", "#");
        listSong.setAttribute("data-id", id);
        listSong.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });

        var addButton = document.createElement("button");
        addButton.innerHTML="remove from list";
        addButton.setAttribute("data-id", id);
        addButton.setAttribute("class", "remove-from-list-button");
        addButton.setAttribute("href", "#");

        listSong.innerHTML=list.songs[i].name;
        songContainer.appendChild(addButton);
        songContainer.appendChild(listSong);
        editSongList.appendChild(songContainer);
    }
    showAllListsInSidebar();
}

function reqAvailableSongsListener() {
    console.log(this.responseText);
    var songs = JSON.parse(this.responseText);
    var availableSongs = document.getElementById("available-songs");
    availableSongs.innerHTML="";

    for (i=0; i <songs.length; i++) {
        var songContainer = document.createElement("div");
        var song = document.createElement("a");
        id = songs[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.setAttribute("class", "available-song");

        var addButton = document.createElement("button");
        addButton.innerHTML="add to list";
        addButton.setAttribute("data-id", id);
        addButton.setAttribute("class", "add-to-list-button");
        addButton.setAttribute("href", "#");

        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });

        song.innerHTML=songs[i].name;
        songContainer.appendChild(addButton);
        songContainer.appendChild(song);
        availableSongs.appendChild(songContainer);
    }
}
showAllSidebarSongs();
showAllListsInSidebar();