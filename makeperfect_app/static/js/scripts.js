var content;
var logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", logout);

function logout() {
    window.location="/logout_view/";
}

function hideOtherContent(){
    var otherContent = document.getElementsByClassName("main-content");
    for (i=0; i < otherContent.length; i++) {
        otherContent[i].style.display = 'none';
    }
    window.scrollTo(0, 0);
    content.style.display = 'block';
}
