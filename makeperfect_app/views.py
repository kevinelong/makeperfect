from django.views.decorators.csrf import csrf_exempt
# from django.template import RequestContext, loader
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from .models import Song, Setlist, SetlistItem
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

import json


def index(request):
    return render(request, 'main.html', {})


@csrf_exempt
def login_view(request):
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect("/main.html")

    return HttpResponseRedirect('/?error=LOGIN_ERROR')


@csrf_exempt
def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/")


@csrf_exempt
def register_view(request):
    if request.POST:
        user = User()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.save()
        return HttpResponseRedirect("/login.html")

    return render(request, 'register.html', {})


def api_all_songs(request):
    songs = Song.objects.filter(user=request.user).order_by('song_title')
    data_list = []
    for song in songs:
        song_data = {"id": song.id, "song_title": song.song_title}
        data_list.append(song_data)
        song.selected = True
    return HttpResponse(json.dumps(data_list))


def api_all_setlists(request):
    setlists = Setlist.objects.filter(user=request.user).order_by('setlist_title')  # changed to Setlist and setlist_title
    data_list = []
    for setlist in setlists:
        setlist_data = {"id": setlist.id, "setlist_title": setlist.setlist_title, }  # changed to setlist.setlist_title
        data_list.append(setlist_data)
        setlist.selected = True
    return HttpResponse(json.dumps(data_list))


def api_available_songs(request, setlist_id):
    songs = Song.objects.filter(user=request.user).order_by('song_title')
    output_songs = list(songs) # list is a keyword, no need to change code here
    data_list = []
    song_data = {}

    if setlist_id == "0":
        for song in songs:
            song_data = {"id": song.id,
                         "song_title": song.song_title} # changed name to song_title
            data_list.append(song_data)
        return HttpResponse(json.dumps(data_list, indent=4))

    filtered_list_of_setlists = Setlist.objects.filter(id=setlist_id)  # changed model class name
    filtered_setlist = filtered_list_of_setlists[0]
    setlist_items = SetlistItem.objects.filter(setlist=filtered_setlist)  # changed model class name

    if setlist_items:
        for song in songs:
            # look at the songs in the selected list and make comparison
            for setlist_item in setlist_items:
                # if the song does not match any in the list of songs, add info to dictionary
                if setlist_item.song == song:
                    output_songs.remove(song)
        for song in output_songs:
            song_data = {"id": song.id,
                         "song_title": song.song_title} # changed name to song_title
            data_list.append(song_data)
    else:
        for song in songs:
            song_data = {"id": song.id,
                         "song_title": song.song_title}  # changed name to song_title
            data_list.append(song_data)

    return HttpResponse(json.dumps(data_list, indent=4))


@csrf_exempt
def api_song_details(request, song_id):
    if request.POST:
        print(request.POST)
        id = request.POST['id']
        if id == "0":
            song = Song()
        else:
            song = Song.objects.filter(id=id)[0]
        if request.POST["action"] == "DELETE":
            song.delete()
            return HttpResponse(json.dumps({'id':id}))
        else:
            song.song_title = request.POST["song_title"]
            song.artist = request.POST["artist"]
            song.key = request.POST["key"]
            song.chords = request.POST["chords"]
            song.lyrics = request.POST["lyrics"]
            song.song_notes = request.POST["notes"]  # changed notes to song_notes
            song.user = request.user
            song.save()
    else:
        song = get_object_or_404(Song, pk=song_id)

    song_data = {"id": song.id,
                 "song_title": song.song_title, # changed name to song_title
                 "key": song.key,
                 "lyrics": song.lyrics,
                 "chords": song.chords,
                 "artist": song.artist,
                 "notes": song.song_notes}  # changed notes to song_notes
    return HttpResponse(json.dumps(song_data))


# changed model class name from List to Setlist in api_setlist after refactoring database
@csrf_exempt
def api_setlist(request, setlist_id):  # changed list_id to setlist_id

    if setlist_id == "0":
        print("The list ID is 0. There are no songs associated with this setlist.")

    songs = Song.objects.filter(user=request.user)
    filtered_list_of_setlists = Setlist.objects.filter(id=setlist_id)  # changed list_id to setlist_id

    if request.POST:
        print(request.POST)

        if request.POST["id"] == "0":
            setlist = Setlist()  # renamed model class
        else:
            setlist = Setlist.objects.filter(id=request.POST["id"])[0]  # renamed model class

        if request.POST["action"] == "DELETE":
            setlist.delete()
        else:
            setlist.setlist_title = request.POST["setlist_title"]  # changed list_name to setlist_title
            setlist.user = request.user
            setlist.save()
    else:
        setlist = filtered_list_of_setlists[0]

    setlist_items = SetlistItem.objects.filter(setlist=setlist).order_by('position')  # changed list_name to setlist
    print (setlist_items)
    data_list = []
    data_object = {"setlist_title": setlist.setlist_title,  # changed list_name to setlist_title
                   "id": setlist.id}
    print(data_object)

    for setlist_item in setlist_items:
        for song in songs:
            if setlist_item.song == song:
                song_data = {"id": song.id,
                             "setlist_item_id": setlist_item.id,
                             "song_title": song.song_title,
                             "setlist_title": setlist.setlist_title,
                             "setlist_item_position": setlist_item.position, }
                data_list.append(song_data)
                song.selected = True

    data_object["songs"] = data_list

    return HttpResponse(json.dumps(data_object))


@csrf_exempt
def api_association(request, setlist_item_id):
    if request.POST:
        print(request.POST)

        if setlist_item_id == "0":
            setlist_item = SetlistItem()

        else:
            setlist_item = SetlistItem.objects.filter(id=request.POST["setlist_item_id"])[0]
        if request.POST["action"] == "DELETE":
            print ("about to delete")
            print (setlist_item)

            setlist_item.delete()
        else:
            filtered_song = Song.objects.filter(id=request.POST["song_id"])[0]
            filtered_setlist = Setlist.objects.filter(id=request.POST["setlist_id"])[0]
            setlist_item.song = filtered_song
            setlist_item.setlist = filtered_setlist
            setlist_item.user = request.user
            setlist_item.save()
    # data_object = {"setlist_item_id": setlist_item.id,
    #                "setlist_id": setlist_item.setlist.id,
    #                "song_id": setlist_item.song.id}
    return HttpResponse(json.dumps({"stuff": "yay"}))


@csrf_exempt
def api_setlist_item_position(request, setlist_item_id):
    setlist_items = SetlistItem.objects.all()
    data_list = []
    data_object = {}

    if request.POST:
        print(request.POST)
        setlist_item = SetlistItem.objects.filter(id=request.POST["setlist_item_id"])[0]
        print(setlist_item.position)
        setlist_item.position = request.POST["setlist_item_position"]
        print(setlist_item.position)
        setlist_item.save()
    else:
        for item in setlist_items:
            setlist_item_data = {
                "setlist_item_setlist": item.setlist.setlist_title,
                "setlist_item_id": item.id,
                "setlist_item_position": item.position,
                "setlist_item_song": item.song.song_title,
            }
            data_list.append(setlist_item_data)
    data_object["setlist_items_all"] = data_list
    return HttpResponse(json.dumps(data_object))












# OLD VIEW FUNCTIONS NOT BEING USED IN THE ONE-PAGE VERSION
# SAVED FOR REFERENCE FOR NOW
#
# def details(request, song_id):
#     song = get_object_or_404(Song, pk=song_id)
#     lists = List.objects.all().order_by('list_name')
#     list_items = ListItem.objects.all()
#     return render(request, 'makeperfect_app/details.html', {'song': song,
#                                                             'lists': lists,
#                                                             'list_items': list_items, })
#
#
# def edit(request, song_id):
#     filtered_song_list = Song.objects.filter(id=song_id)
#
#     if len(filtered_song_list) > 0:
#         print("FOUND")
#         song = filtered_song_list[0]
#     else:
#         print("NEW")
#         song = Song()
#
#     if request.POST:
#         print(request.POST)
#         song.song_title = request.POST["song_title"]
#         song.artist = request.POST["artist"]
#         song.key = request.POST["key"]
#         song.chords = request.POST["chords"]
#         song.lyrics = request.POST["lyrics"]
#         song.notes = request.POST["notes"]
#         song.save()
#         return HttpResponseRedirect("/song/" + str(song.id) + "/")
#     return render(request, 'makeperfect_app/edit.html', {'song': song})
#
#
# def editlist(request, list_id):
#     songs = Song.objects.all().order_by('song_title')
#     filtered_list_of_lists = List.objects.filter(id=list_id)
#
#     if len(filtered_list_of_lists) > 0:
#         print("FOUND")
#         list = filtered_list_of_lists[0]
#     else:
#         print("NEW")
#         list = List()
#
#     list_items = ListItem.objects.filter(list_name=list)
#
#     for song in songs:
#         for list_item in list_items:
#             if list_item.song == song:
#                 song.selected = True;
#
#     if request.POST:
#         print(request.POST)
#         list.list_name = request.POST["list_name"]
#         list.save()
#         for song in songs:
#             if "cb_" + str(song.id) in request.POST:
#                 print ("create relationship if no relationship exists")
#             else:
#                 print ("remove relationship if it exists")
#
#         return HttpResponseRedirect("/editlist/" + str(list.id) + "/")
#
#
#     return render(request, 'makeperfect_app/editlist.html', {'list': list, 'songs': songs, 'list_items': list_items})



# def index(request):
#     song_list = Song.objects.all().order_by('song_title')
#     lists = List.objects.all().order_by('list_name')
#     list_items = ListItem.objects.all()
#     template = loader.get_template('makeperfect_app/main.html')
#     context = RequestContext(request, {
#         'song_list': song_list,
#         'lists': lists,
#         'list_items': list_items,
#         'song': 'song',
#     })
#     return HttpResponse(template.render(context))

