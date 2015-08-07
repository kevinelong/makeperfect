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

//---------------------SHOWING SONGS and SONG FORMS---------------------
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

//---------------------SHOWING SETS and SET FORMS---------------------
//----------------------------------------------------------------------

function showSetsInSidebar() {
    content = document.getElementById("list-of-lists");
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSetsListener;
    xhr.open("get", "/api_all_lists/");
    xhr.send();
}

function showAllSets() {
    content = document.getElementById("all-lists");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSetsListener;
    xhr.open("get", "/api_all_lists/");
    xhr.send();
}

function showSetDetails(id) {
    window.currentListId = id;
    content = document.getElementById("song-list");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListListener;
    xhr.open("get", "/api_list/" + id + '/');
    xhr.send();
}

function showSetEditForm() {
    var id = window.currentListId;
    content = document.getElementById("edit-song-list-details");
    hideOtherContent();
    document.getElementById("edit-song-list").style.display="flex";
    if (id=="0") {
        var songsInListMessage = document.getElementById("songs-in-edit-list-form");
        var message =  document.createElement('p');
        message.innerHTML = "There are no songs in this list.";
        songsInListMessage.appendChild(message);
        document.getElementById("edit-song-list").style.display="none";
    }
    document.getElementById("edit-song-list-title").value="";
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListListener;
    xhr.open("get", "/api_list/" + id + '/');
    xhr.send();
    showAvailableSongs(id);
}

function showNewSetForm() {
    window.currentListId = 0;
    document.getElementById("list-title").innerHTML="";
    document.getElementById("edit-song-list-title").value="";
    document.getElementById("edit-list-title").innerHTML="";
    document.getElementById("songs-in-edit-list-form").innerHTML="";
    document.getElementById("available-songs").innerHTML="";
    showSetEditForm();
}

function showAvailableSongs(id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAvailableSongsListener;
    xhr.open("get", "/api_all_not_in_list/" + id + '/');
    xhr.send();
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

//---------------------EDITING AND ADDING SETS---------------------
//------------------------------------------------------------------

function sendSetPost(item, url) {
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

function sendSetDetails () {
    id = window.currentListId;
    var item = {
        "action": "save",
        "id": window.currentListId,
        "list_name": document.getElementById("edit-song-list-title").value
    };
    sendSetPost(item, "/api_list/" + id + '/');
    showSetsInSidebar();
    showSetDetails(id);
}

//---------------------SET-SONG-ASSOCIATIONS-----------------------
//------------------------------------------------------------------

function sendAssociation (listId, songId) {
    var form_data = new FormData();
    form_data.append("list_id", listId);
    form_data.append("song_id", songId);

    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.send(form_data);
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
    };

    document.getElementById('delete-song-btn-false').onclick = function(){
        document.getElementById('confirm-delete-song').style.display="none";
        return false;
    };
}

//---------------------DELETING SETS-------------------------------
//------------------------------------------------------------------

function sendSetDelete(id) {
    var form_data = new FormData();
    form_data.append("id", id);
    form_data.append("action", "DELETE");
    var request = new XMLHttpRequest();
    request.onload=reqListListener;
    request.open("POST", "/api_list/" + id + '/');
    request.send(form_data);
}

function deleteSet() {
    id = window.currentListId;
    sendSetDelete(id);
    showAllSets();
}

function confirmSetDelete() {
    document.getElementById('confirm-delete-list').style.display="block";

    document.getElementById('delete-list-btn-true').onclick = function(){
        deleteSet();
    };

    document.getElementById('delete-list-btn-false').onclick = function(){
        document.getElementById('confirm-delete-list').style.display="none";
        return false;
    };
}

//---------------------ADDING AND REMOVING SONGS FROM SETS---------
//------------------------------------------------------------------

function addSongToSet(songId) {
    var listId = window.currentListId;
    window.currentSongId = songId;
    console.log("list_id: ", listId, "song_id: ", songId);
    var song;

    for (var i=0; i < window.songs.length; i++){
        song = window.songs[i];
        if (song.id == songId) {
            window.songs.splice(i, 1);
            break;
        }
    }

    window.list.songs.push(song);
    drawSet();
    drawAvailableSongs();
}

function removeSongFromSet(songId){
    var listId = window.currentListId;
    window.currentSongId = songId;
    console.log("list_id: ", listId, "song_id: ", songId);
    var song;

    for (var i=0; i < window.list.songs.length; i++){
        song=window.list.songs[i];
        if (song.id == songId) {
            window.list.songs.splice(i, 1);
            console.log(song);
            break;
        }
    }

    window.songs.push(song);
    drawSet();
    drawAvailableSongs();
}

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
    document.getElementById("edit-title").value=song.name;
    document.getElementById("edit-artist").value=song.artist;
    document.getElementById("edit-key").value=song.key;
    document.getElementById("edit-chords").innerHTML=song.chords;
    document.getElementById("edit-lyrics").innerHTML=song.lyrics;
    document.getElementById("edit-notes").innerHTML=song.notes;
}

//SET DETAILS LISTENER AND DRAW FUNCTIONS
//-------------------------------------------------------

function reqAllSetsListener() {
    console.log(this.responseText);
    var sets = JSON.parse(this.responseText);
    var listOfSets = document.getElementById("list-of-lists");
    listOfSets.innerHTML="";

    if (sets.length==0){
        var message = document.createElement('a');
        message.setAttribute("href", "#");
        message.addEventListener("click", function(e){
            showNewSetForm();
        });
        message.innerHTML = "Add a list!";
        listOfSets.appendChild(message);
    } else {
        for (var i=0; i <sets.length; i++) {
            var set = document.createElement("a");
            var id = sets[i].id;
            set.setAttribute("href", "#");
            set.setAttribute("data-id", id);
            set.addEventListener("click", function(e){
                showSetDetails(e.target.getAttribute("data-id"));
            });
            set.innerHTML=sets[i].name;
            listOfSets.appendChild(set);
        }

        var allSets = document.getElementById("all-lists-list");
        allSets.innerHTML="";
        for (var i=0; i <sets.length; i++) {
            set = document.createElement("a");
            id = sets[i].id;
            set.setAttribute("href", "#");
            set.setAttribute("data-id", id);
            set.addEventListener("click", function(e){
                showSetDetails(e.target.getAttribute("data-id"));
            });
            set.innerHTML=sets[i].name;
            console.log(set);
            allSets.appendChild(set);
        }
    }
}

function reqListListener() {
    console.log(this.responseText);
    window.list = JSON.parse(this.responseText);
    drawSet();
    drawSetEditForm();
}

function drawSet(){
    var list = window.list;
    // List details
    document.getElementById("list-title").innerHTML=list.name;
    window.currentListId = list.id;
    console.log(window.currentListId);
    var songList = document.getElementById("songs-in-list");
    songList.innerHTML="";

    function selectSong(id) {
        for (var i=0; i <songList.children.length; i++) {
            var child = songList.children[i];
            if (id==child.getAttribute("data-id")){
                child.classList.add("selected");
            } else {
                child.classList.remove("selected");
            }
        }
    }
    for (i=0; i <list.songs.length; i++) {
        var song = document.createElement("a");
        id = list.songs[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.addEventListener("click", function(e){
            console.log(this);
            showSongDetails(e.target.getAttribute("data-id"));
        });
        song.innerHTML=list.songs[i].name;
        songList.appendChild(song);
    }
}

function drawSetEditForm(){
    document.getElementById("edit-list-title").innerHTML=list.name;
    document.getElementById("edit-song-list-title").value=list.name;
    var editSongList = document.getElementById("songs-in-edit-list-form");
    editSongList.innerHTML="";

    //CREATE ANCHOR ELEMENTS
    for (i=0; i <list.songs.length; i++) {
        var songContainer = document.createElement("div");
        var listSong = document.createElement("a");
        id = list.songs[i].id;
        listSong.setAttribute("href", "#");
        listSong.setAttribute("data-id", id);
        listSong.addEventListener("click", function(e){
            selectSong(e.target.getAttribute("data-id"));
        });

    //CREATE BUTTONS TO REMOVE SONGS FROM THE LIST
        var removeButton = document.createElement("button");
        removeButton.innerHTML="x";
        removeButton.setAttribute("data-id", id);
        removeButton.setAttribute("class", "remove-from-list-button");
        removeButton.setAttribute("href", "#");
        removeButton.addEventListener("click", function(e){
            removeSongFromSet(e.target.getAttribute("data-id"));
        });

    //DRAW SONGS TO THE LIST EDIT FORM
        listSong.innerHTML=list.songs[i].name;
        songContainer.appendChild(removeButton);
        songContainer.appendChild(listSong);
        editSongList.appendChild(songContainer);
    }
    showSetsInSidebar();
}

//AVAILABLE SONG LISTENER AND DRAW FUNCTION
//-------------------------------------------------------
function reqAvailableSongsListener() {
    console.log(this.responseText);
    window.songs = JSON.parse(this.responseText);
    drawAvailableSongs();
}

function drawAvailableSongs() {
    var availableSongsList = document.getElementById("available-songs");
    availableSongsList.innerHTML="";

    //CREATE ANCHOR ELEMENTS
    for (i=0; i <songs.length; i++) {
        var songContainer = document.createElement("div");
        var song = document.createElement("a");
        id = songs[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.setAttribute("class", "available-song");

    //CREATE BUTTONS TO ADD SONGS FROM THE LIST
        var addButton = document.createElement("button");
        addButton.innerHTML="+";
        addButton.setAttribute("data-id", id);
        addButton.setAttribute("class", "add-to-list-button");
        addButton.setAttribute("href", "#");
        addButton.addEventListener("click", function(e){
           addSongToSet(e.target.getAttribute("data-id"));
        });

        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
    //DRAW AVAILABLE SONGS TO THE LIST EDIT FORM
        song.innerHTML=songs[i].name;
        songContainer.appendChild(addButton);
        songContainer.appendChild(song);
        availableSongsList.appendChild(songContainer);
    }
}

showAllSidebarSongs();
showSetsInSidebar();