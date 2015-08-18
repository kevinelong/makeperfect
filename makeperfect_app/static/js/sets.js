// TODO ADD ABILITY TO SORT SONGS IN SETLISTS

//-------------------------------------------------------
//---------------------HELPERS---------------------------
//-------------------------------------------------------

//used by drawAllSetlists()
function createSetlistElements(setlistItem) {
    var setlistElement = document.createElement("a");
    //console.log(setlistItem);
    var id = setlistItem.id;
    setlistElement.setAttribute("href", "#");
    setlistElement.setAttribute("data-id", id);
    setlistElement.addEventListener("click", function(e){
        showSetDetails(e.target.getAttribute("data-id"));
    });
    setlistElement.innerHTML = setlistItem.setlist_title;
    return setlistElement;
}

//--------------------------------------------------------------
//---------------SET LISTENERS and DRAW FUNCTIONS--------------
//--------------------------------------------------------------

function reqAllSetsListener() {
    console.log(this.responseText);
    window.listOfSets = JSON.parse(this.responseText);
    drawAllSetlists();
}

function reqSetListener() {
    console.log(this.responseText);
    window.setlist = JSON.parse(this.responseText);
    drawSetlist();
    drawSetlistEditForm();
}

function drawAllSetlists() {
   // draw all sets in main window
    var allSets = document.getElementById("all-sets-list");
    allSets.innerHTML="";

    for (var i = 0; i <listOfSets.length; i++) {
        var setlist = createSetlistElements(listOfSets[i]);
        allSets.appendChild(setlist);
    }
}

function drawSetlist(){
    //var setlist = window.setlist;
    var songList = document.getElementById("songs-in-set");
    console.log(setlist.songs);
    // Set details
    document.getElementById("set-title").innerHTML=setlist.setlist_title;
    window.currentSetId = setlist.id;
    console.log(window.currentSetId);
    songList.innerHTML="";

    for (var i=0; i <setlist.songs.length; i++) {
        console.log(setlist.songs[i]);
        var songContainer = document.createElement("div");
        var songInSet = document.createElement("a");
        var id = setlist.songs[i].id;
        songInSet.setAttribute("href", "#");
        songInSet.setAttribute("data-id", id);
        songInSet.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });
        songInSet.innerHTML=setlist.songs[i].song_title;
        songContainer.appendChild(songInSet);
        songList.appendChild(songContainer);
    }
}

// used by drawSetEditForm()
function drawSetlistEditForm(){
    document.getElementById("edit-set-title").innerHTML=setlist.setlist_title;
    document.getElementById("edit-set-title").value=setlist.setlist_title;
    drawSongsInSetlist();
}

// used by drawSetlistEditForm()
function drawSongsInSetlist(){
    var songsInSet = document.getElementById("songs-in-edit-set-form");
    songsInSet.innerHTML="";
    //function selectSong(id) {
    //    for (var i=0; i < songsInSet.children.length; i++) {
    //        var child = songsInSet.children[i];
    //        if (id==child.getAttribute("data-id")){
    //            child.classList.add("selected");
    //        } else {
    //            child.classList.remove("selected");
    //        }
    //    }
    //}
    //CREATE LIST OF SONGS IN SET WITH EVENT LISTENERS
    for (var i=0; i <setlist.songs.length; i++) {
        var id = setlist.songs[i].id;
        var setlistItemId = setlist.songs[i].setlist_item_id;
        var setlistItemPosition = setlist.songs[i].setlist_item_position;
        //create div with id attributes
        var songContainer = document.createElement("div");
        songContainer.setAttribute("data-id", id);
        songContainer.setAttribute("data-setlistItemId", setlistItemId);
        songContainer.setAttribute("data-position", setlistItemPosition);
        songContainer.setAttribute("class", "setlist-items");
        //create anchor elements
        var songInSet = document.createElement("a");
        songInSet.setAttribute("href", "#");
        songInSet.setAttribute("data-id", id);
        songInSet.setAttribute("data-setlistItemId", setlistItemId);
        songInSet.setAttribute("data-position", setlistItemPosition);
        //songInSet.setAttribute("class", "setlist-items");
        //songInSet.addEventListener("click", function(e){
        //    selectSong(e.target.getAttribute("data-id"));
        //});

        //create buttons to remove songs from the setlist
        var removeButton = document.createElement("button");
        removeButton.innerHTML="x";
        removeButton.setAttribute("data-id", id);
        removeButton.setAttribute("data-setlistItemId", setlistItemId);
        removeButton.setAttribute("class", "remove-from-set-button");
        removeButton.setAttribute("href", "#");
        removeButton.addEventListener("click", function(e){
            removeSongFromSet(e.target.getAttribute("data-id"));
        });

        //create inputs for adjusting setlist item order
        var positionInput = document.createElement("input");
        positionInput.value = setlistItemPosition;
        //positionInput.setAttribute("data-setlistItemId", setlistItemId);
        //positionInput.setAttribute("data-position", setlistItemPosition);

        //DRAW SONGS TO THE LIST EDIT FORM
        songInSet.innerHTML=setlist.songs[i].song_title;
        songContainer.appendChild(positionInput);
        songContainer.appendChild(removeButton);
        songContainer.appendChild(songInSet);
        songsInSet.appendChild(songContainer);
    }
}

//--------------------AVAILABLE SONG LISTENER AND DRAW FUNCTION-------
//--------------------------------------------------------------------
function reqAvailableSongsListener() {
    //console.log(this.responseText);
    window.songs = JSON.parse(this.responseText);
    drawAvailableSongs();
}

// called by showAvailableSongs()
function drawAvailableSongs() {
    var availableSongsList = document.getElementById("available-songs");
    availableSongsList.innerHTML="";

    //CREATE ANCHOR ELEMENTS
    for (i=0; i <window.songs.length; i++) {
        var songContainer = document.createElement("div");
        var song = document.createElement("a");
        id = window.songs[i].id;
        song.setAttribute("href", "#");
        song.setAttribute("data-id", id);
        song.setAttribute("class", "available-song");

    //CREATE BUTTONS TO ADD SONGS FROM THE LIST
        var addButton = document.createElement("button");
        addButton.innerHTML="+";
        addButton.setAttribute("data-id", id);
        addButton.setAttribute("class", "add-to-set-button");
        addButton.setAttribute("href", "#");
        addButton.addEventListener("click", function(e){
           addSongToSet(e.target.getAttribute("data-id"));
        });

        song.addEventListener("click", function(e){
            showSongDetails(e.target.getAttribute("data-id"));
        });

    //DRAW AVAILABLE SONGS TO THE LIST EDIT FORM
        song.innerHTML=window.songs[i].song_title;
        songContainer.appendChild(addButton);
        songContainer.appendChild(song);
        availableSongsList.appendChild(songContainer);
    }
}

//---------------------SETS & SET FORMS---------------------------------
//----------------------------------------------------------------------

function showAllSetlists() {
    content = document.getElementById("all-sets");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSetsListener;
    xhr.open("get", "/api_all_setlists/");
    xhr.send();
}

function showSetDetails(id) {
    window.currentSetId = id;
    content = document.getElementById("set-details");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqSetListener;
    xhr.open("get", "/api_setlist/" + id + '/');
    xhr.send();
}

function showSetEditForm() {
    var id = window.currentSetId;
    content = document.getElementById("edit-set-list-details");
    hideOtherContent();
    document.getElementById("edit-songs-in-set").style.display="flex";
    if (id=="0") {
        var songsInListMessage = document.getElementById("songs-in-edit-set-form");
        var message =  document.createElement('p');
        message.innerHTML = "There are no songs in this set.";
        songsInListMessage.appendChild(message);
        document.getElementById("edit-songs-in-set").style.display="none";
    }
    document.getElementById("set-title-h1").value="";
    var xhr = new XMLHttpRequest();
    xhr.onload = reqSetListener;
    xhr.open("get", "/api_setlist/" + id + '/');
    xhr.send();
    showAvailableSongs(id);
}

function showNewSetForm() {
    window.currentSetId = 0;
    document.getElementById("set-title-h1").innerHTML="";
    document.getElementById("edit-set-title").value="";
    document.getElementById("edit-set-title").innerHTML="";
    document.getElementById("songs-in-edit-set-form").innerHTML="";
    document.getElementById("available-songs").innerHTML="";
    showSetEditForm();
}

function showAvailableSongs(id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAvailableSongsListener;
    xhr.open("get", "/api_available_songs/" + id + '/');
    xhr.send();
}


//---------------------EDITING AND ADDING SETS---------------------
//------------------------------------------------------------------

// changed  key "list_name" to "setlist_title" in JSON objects after changing class model names and names in view functions
function sendSetPost(item, url) {
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload=reqSetListener;
    request.open("POST", url);
    request.send(form_data);
}

function sendSetDetails() {
    id = window.currentSetId;
    var item = {
        "action": "save",
        "id": window.currentSetId,
        "setlist_title": document.getElementById("edit-set-title").value
    };
    sendSetPost(item, "/api_setlist/" + id + '/');
    showSetDetails(id);
}

//---------------------DELETING SETS-------------------------------
//------------------------------------------------------------------

function sendSetDelete(id) {
    var form_data = new FormData();
    form_data.append("id", id);
    form_data.append("action", "DELETE");
    var request = new XMLHttpRequest();
    request.open("POST", "/api_setlist/" + id + '/');
    request.send(form_data);
}

function deleteSet() {
    id = window.currentSetId;
    sendSetDelete(id);
    showAllSetlists();
}

function confirmSetDelete() {
    document.getElementById('confirm-delete-set').style.display="block";

    document.getElementById('delete-set-btn-true').onclick = function(){
        deleteSet();
        document.getElementById('confirm-delete-set').style.display="none";
    };

    document.getElementById('delete-set-btn-false').onclick = function(){
        document.getElementById('confirm-delete-set').style.display="none";
        return false;
    };
}


//---------------------ADDING AND REMOVING SONGS FROM SETS---------
//------------------------------------------------------------------

function addSongToSet(songId) {
    var setId = window.currentSetId;
    window.currentSongId = songId;
    console.log("setlist_id: ", setId, "song_id: ", songId);
    var song;

    for (var i=0; i < window.songs.length; i++){
        console.log(window.songs[i]);
        song = window.songs[i];
        if (song.id == songId) {
            window.songs.splice(i, 1);
            console.log("added to set: ", song);
            break;
        }
    }

    window.setlist.songs.push(song);
    createNewAssociation();
    drawSongsInSetlist();
    drawAvailableSongs();
}

function removeSongFromSet(songId){
    var setId = window.currentSetId;
    window.currentSongId = songId;

    console.log("setlist_id: ", setId, "song_id: ", songId);
    var song;

    for (var i=0; i < window.setlist.songs.length; i++){
        console.log(window.setlist.songs[i]);
        song=window.setlist.songs[i];
        if (song.id == songId) {
            window.setlist.songs.splice(i, 1);
            window.currentSetlistItemId = song.setlist_item_id;
            console.log(window.currentSetlistItemId);
            console.log("removed from set: ", song);
            break;
        }
    }

    window.songs.push(song);
    deleteAssociation(currentSetlistItemId);
    drawSongsInSetlist();
    drawAvailableSongs();
}

//---------------------SET-SONG-ASSOCIATIONS-----------------------
//-----------------------------------------------------------------

function sendAssociation(item, url) {
    var form_data = new FormData();
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.send(form_data);
}

function createNewAssociation() {
        var id=0;
        var item = {
        "action": "save",
        "setlist_item_id": id,
        "setlist_id": currentSetId,
        "song_id": currentSongId
    };
    sendAssociation(item, "/api_association/" + id + '/');
}

function deleteAssociation(id) {
    var item = {
        "action": "DELETE",
        "setlist_item_id": id
    };
    sendAssociation(item, "/api_association/" + id + '/');
}

//---------------------SETLIST SONG ORDER-------------------------
//-----------------------------------------------------------------

function reqSongsInSetListener() {
    console.log(this.responseText);
    window.setlist = JSON.parse(this.responseText);
    drawSongsInSetlist();
}

function loadList() {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqSongsInSetListener;
    xhr.open("get", "/api_setlist/" + id + '/');
    xhr.send();
}

function refreshOrder() {
    id = currentSetId;
    var setlistItems = document.getElementsByClassName("setlist-items");
    for (var i = 0; i < setlistItems.length; i++) {
        var setlistItem = setlistItems[i];
        var setlistItemId = setlistItem.getAttribute("data-setlistItemId");
        var setlistItemPosition = setlistItem.firstChild.value;
        var form_data = new FormData();
        form_data.append("setlist_item_id", setlistItemId);
        form_data.append("setlist_item_position", setlistItemPosition);
        form_data.append("action", "SAVE");
        var request = new XMLHttpRequest();
        request.open("POST", "/api_setlist_item_position/" + setlistItemId + '/');
        if (setlistItems.length - 1 == i) {
            request.onload = loadList;
        }
        request.send(form_data);
    }
}
