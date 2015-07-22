

$('.song-list').on('click', function() {
    var listItems = $(this).nextAll("ul");
    $("ul").removeClass("selected");
    $(".song-list").removeClass("selected");
    $(this).addClass("selected");
    $(listItems).addClass("selected");
    $(".edit-list-button").toggle();
    $(".list-items").toggle();
});



