from django.views.decorators.csrf import csrf_exempt
# from django.template import RequestContext, loader
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from .models import Song, List, ListItem
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

import json


@login_required(login_url='/login/')
def index(request):
    # template = loader.get_template('/makeperfect_app/static/html/index.html')
    # context = RequestContext(request)
    # return HttpResponse(template.render(context))
    return render(request, 'index.html', {})


@csrf_exempt
def login_view(request):
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect("/")
    return render(request, 'login.html', {})
    # template = loader.get_template('/makeperfect_app/static/html/login.html')
    # context = RequestContext(request)
    # return HttpResponse(template.render(context))

@csrf_exempt
def register_view(request):
    if request.POST:
        user = User()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.save()
        return HttpResponseRedirect("/login.html")

    return render(request, 'register.html', {})


def api_all(request):
    songs = Song.objects.filter(user=request.user).order_by('song_title')
    data_list = []
    for song in songs:
        song_data = {"id": song.id, "name": song.song_title}
        data_list.append(song_data)
        song.selected = True
    return HttpResponse(json.dumps(data_list))


def api_all_lists(request):
    lists = List.objects.filter(user=request.user).order_by('list_name')
    data_list = []
    for list in lists:
        list_data = {"id": list.id, "name": list.list_name, }
        data_list.append(list_data)
        list.selected = True
    return HttpResponse(json.dumps(data_list))


def api_all_not_in_list(request, list_id):
    songs = Song.objects.filter(user=request.user).order_by('song_title')
    output_songs = list(songs)
    data_list = []
    song_data = {}

    if list_id == "0":
        for song in songs:
            song_data = {"id": song.id,
                         "name": song.song_title}
            data_list.append(song_data)
        return HttpResponse(json.dumps(data_list, indent=4))

    filtered_list_of_lists = List.objects.filter(id=list_id)
    filtered_list = filtered_list_of_lists[0]
    list_items = ListItem.objects.filter(list_name=filtered_list)

    if list_items:
        # iterate through each song in the list of all songs
        for song in songs:
            # look at the songs in the selected list and make comparison
            for list_item in list_items:
                # if the song does not match any in the list of songs, add info to dictionary
                if list_item.song == song:
                    output_songs.remove(song)
        for song in output_songs:
            song_data = {"id": song.id,
                         "name": song.song_title}
            data_list.append(song_data)
    else:
        for song in songs:
            song_data = {"id": song.id,
                         "name": song.song_title}
            data_list.append(song_data)

    return HttpResponse(json.dumps(data_list, indent=4))


@csrf_exempt
def api_details(request, song_id):
    if request.POST:
        print(request.POST)

        if request.POST["id"] == "0":
            song = Song()
        else:
            song = Song.objects.filter(id=request.POST["id"])[0]
        if request.POST["action"] == "DELETE":
            song.delete()
        else:
            song.song_title = request.POST["song_title"]
            song.artist = request.POST["artist"]
            song.key = request.POST["key"]
            song.chords = request.POST["chords"]
            song.lyrics = request.POST["lyrics"]
            song.notes = request.POST["notes"]
            song.user=request.user
            song.save()
    else:
        song = get_object_or_404(Song, pk=song_id)

    song_data = {"id": song.id,
                 "name": song.song_title,
                 "key": song.key,
                 "lyrics": song.lyrics,
                 "chords": song.chords,
                 "artist": song.artist,
                 "notes": song.notes}
    return HttpResponse(json.dumps(song_data))

@csrf_exempt
def api_list(request, list_id):

    if list_id == "0":
        print("The list ID is 0. There are no songs associated with this list.")

    songs = Song.objects.filter(user=request.user).order_by('song_title')
    filtered_list_of_lists = List.objects.filter(id=list_id)

    if request.POST:
        print(request.POST)

        if request.POST["id"] == "0":
            song_list = List()
        else:
            song_list = List.objects.filter(id=request.POST["id"])[0]
        if request.POST["action"] == "DELETE":
            song_list.delete()
        else:
            song_list.list_name = request.POST["list_name"]
            song_list.user=request.user
            song_list.save()
    else:
        song_list = filtered_list_of_lists[0]

    list_items = ListItem.objects.filter(list_name=song_list)
    data_list = []
    data_object = {"name": song_list.list_name,
                   "id": song_list.id}
    print(data_object)
    for song in songs:
        for list_item in list_items:
            if list_item.song == song:
                song_data = {"id": song.id,
                             "name": song.song_title,
                             "list": song_list.list_name}
                data_list.append(song_data)
                song.selected = True

    data_object["songs"] = data_list

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
#     template = loader.get_template('makeperfect_app/index.html')
#     context = RequestContext(request, {
#         'song_list': song_list,
#         'lists': lists,
#         'list_items': list_items,
#         'song': 'song',
#     })
#     return HttpResponse(template.render(context))