//-------------------------------------------------------
//---------------------HELPERS---------------------------
//-------------------------------------------------------

//used by drawSetslistsInSidebar() and  drawAllSetlists()
function createSetlistElements(setlistItem) {
    var setlistElement = document.createElement("a");
    console.log(setlistItem);
    var id = setlistItem.id;
    setlistElement.setAttribute("href", "#");
    setlistElement.setAttribute("data-id", id);
    setlistElement.addEventListener("click", function(e){
        showSetDetails(e.target.getAttribute("data-id"));
    });
    setlistElement.innerHTML = setlistItem.name;
    return setlistElement;
}

//--------------------------------------------------------------
//---------------SET  LISTENERS AND DRAW FUNCTIONS--------------
//--------------------------------------------------------------

function reqAllSetsListener() {
    console.log(this.responseText);
    window.listOfSets = JSON.parse(this.responseText);
    drawSetslistsInSidebar();
    drawAllSetlists();
}

function drawSetslistsInSidebar() {
    var sidebarSetLists = document.getElementById("list-of-sets");
    sidebarSetLists.innerHTML = "";

    if (listOfSets.length == 0) {
        var message = document.createElement('a');
        message.setAttribute("href", "#");
        message.addEventListener("click", function (e) {
            showNewSetForm();
        });
        message.innerHTML = "Add a list!";
        sidebarSetLists.appendChild(message);
    } else {
        for (var i = 0; i < listOfSets.length; i++) {
            var setlist = createSetlistElements(listOfSets[i]);
            sidebarSetLists.appendChild(setlist);
        }
    }
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

function reqSetListener() {
    console.log(this.responseText);
    window.setlist = JSON.parse(this.responseText);
    drawSetlist();
    drawSetlistEditForm();
}

function drawSetlist(){
    var setlist = window.setlist;
    console.log(setlist.songs);
    // Set details
    document.getElementById("set-title").innerHTML=setlist.name;
    window.currentSetId = setlist.id;
    console.log(window.currentSetId);
    var songList = document.getElementById("songs-in-set");
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
    for (i=0; i <setlist.songs.length; i++) {
        console.log(setlist.songs[i]);
        var song = createSongElements(setlist.songs[i]);
        songList.appendChild(song);
    }
}

function drawSetlistEditForm(){
    document.getElementById("edit-set-title").innerHTML=setlist.name;
    document.getElementById("edit-set-title").value=setlist.name;
    drawSongsInSetlist();
    //showSetsInSidebar();  //TODO:  FIGURE OUT WHY I WAS CALLING THIS HERE
}

function drawSongsInSetlist(){
    var editSongsInSet = document.getElementById("songs-in-edit-set-form");
    editSongsInSet.innerHTML="";

    //CREATE LIST OF SONGS IN SET WITH EVENT LISTENERS
    for (i=0; i <setlist.songs.length; i++) {
        var songContainer = document.createElement("div");
        var songInSet = document.createElement("a");
        id = setlist.songs[i].id;
        songInSet.setAttribute("href", "#");
        songInSet.setAttribute("data-id", id);
        songInSet.addEventListener("click", function(e){
            selectSong(e.target.getAttribute("data-id"));
        });

    //CREATE BUTTONS TO REMOVE SONGS FROM THE LIST
        var removeButton = document.createElement("button");
        removeButton.innerHTML="x";
        removeButton.setAttribute("data-id", id);
        removeButton.setAttribute("class", "remove-from-set-button");
        removeButton.setAttribute("href", "#");
        removeButton.addEventListener("click", function(e){
            removeSongFromSet(e.target.getAttribute("data-id"));
        });

    //DRAW SONGS TO THE LIST EDIT FORM
        songInSet.innerHTML=setlist.songs[i].name;
        songContainer.appendChild(removeButton);
        songContainer.appendChild(songInSet);
        editSongsInSet.appendChild(songContainer);
    }
}

//---------------------SETS & SET FORMS---------------------------------
//----------------------------------------------------------------------

function showSetsInSidebar() {
    content = document.getElementById("list-of-sets");
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSetsListener;
    xhr.open("get", "/api_all_lists/");
    xhr.send();
}

function showAllSetlists() {
    content = document.getElementById("all-sets");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqAllSetsListener;
    xhr.open("get", "/api_all_lists/");
    xhr.send();
}

function showSetDetails(id) {
    window.currentSetId = id;
    content = document.getElementById("set-details");
    hideOtherContent();
    var xhr = new XMLHttpRequest();
    xhr.onload = reqSetListener;
    xhr.open("get", "/api_list/" + id + '/');
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
        message.innerHTML = "There are no songs in this list.";
        songsInListMessage.appendChild(message);
        document.getElementById("edit-songs-in-set").style.display="none";
    }
    document.getElementById("set-title-h1").value="";
    var xhr = new XMLHttpRequest();
    xhr.onload = reqSetListener;
    xhr.open("get", "/api_list/" + id + '/');
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
    xhr.open("get", "/api_all_not_in_list/" + id + '/');
    xhr.send();
}



//---------------------EDITING AND ADDING SETS---------------------
//------------------------------------------------------------------
// TODO: NEED TO REDRAW EDITED SONG TO THE SIDEBAR and SONG DETAILS PAGE IN A WAY THAT AVOIDS A RACE CONDITION
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
        "list_name": document.getElementById("edit-set-title").value
    };
    sendSetPost(item, "/api_list/" + id + '/');
    showSetsInSidebar();
    showSetDetails(id);
}

//---------------------DELETING SETS-------------------------------
//------------------------------------------------------------------

function sendSetDelete(id) {
    var form_data = new FormData();
    form_data.append("id", id);
    form_data.append("action", "DELETE");
    var request = new XMLHttpRequest();
    request.onload=reqSetListener;
    request.open("POST", "/api_list/" + id + '/');
    request.send(form_data);
}

function deleteSet() {
    id = window.currentSetId;
    sendSetDelete(id);
    showAllSetlists();
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


//--------------------AVAILABLE SONG LISTENER AND DRAW FUNCTION-------
//--------------------------------------------------------------------
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


//---------------------SET-SONG-ASSOCIATIONS-----------------------
//------------------------------------------------------------------

function sendNewAssociation (item, url) {
    var form_data = new FormData();
    //form_data.append("setlist_id", setId);
    //form_data.append("song_id", songId);
    var form_data = new FormData();
    // adds each key-value pair to the FormData
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
        "id": id,
        "setlist_id": currentSetId,
        "song_id": currentSongId
    };
    sendNewAssociation(item, "/api_association/" + id + '/');
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
            console.log("removed from set: ", song);
            break;
        }
    }

    window.songs.push(song);
    drawSongsInSetlist();
    drawAvailableSongs();
}

showSetsInSidebar();