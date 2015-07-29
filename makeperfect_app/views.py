from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.shortcuts import get_object_or_404, render
from .models import Song, List, ListItem

import json

def index(request):
    song_list = Song.objects.all().order_by('song_title')
    lists = List.objects.all().order_by('list_name')
    list_items = ListItem.objects.all()
    template = loader.get_template('makeperfect_app/index.html')
    context = RequestContext(request, {
        'song_list': song_list,
        'lists': lists,
        'list_items': list_items,
        'song' : 'song',
    })
    return HttpResponse(template.render(context))


def api_all (request):
    songs = Song.objects.all().order_by('song_title')
    data_list = []
    for song in songs:
        song_data = {"id": song.id, "name": song.song_title}
        data_list.append(song_data)
        song.selected = True
    return HttpResponse(json.dumps(data_list))

def api_all_not_in_list(request, list_id):
    songs = Song.objects.all().order_by('song_title')
    output_songs = list(songs)
    filtered_list_of_lists = List.objects.filter(id=list_id)
    filtered_list = filtered_list_of_lists[0]
    list_items = ListItem.objects.filter(list_name=filtered_list)
    data_list = []
    song_data = {}

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


def api_details(request, song_id):
    song = get_object_or_404(Song, pk=song_id)
    song_data = {"id": song.id,
                 "name": song.song_title,
                 "key": song.key,
                 "lyrics": song.lyrics,
                 "chords": song.chords,
                 "artist": song.artist,
                 "notes": song.notes}
    return HttpResponse(json.dumps(song_data))

def api_list(request, list_id):
    songs = Song.objects.all().order_by('song_title')
    filtered_list_of_lists = List.objects.filter(id=list_id)
    list = filtered_list_of_lists[0]
    list_items = ListItem.objects.filter(list_name=list)
    data_list = []
    data_object = {"name": list.list_name}
    for song in songs:
        for list_item in list_items:
            if list_item.song == song:
                song_data = {"id": song.id,
                             "name": song.song_title,
                             "list": list.list_name}
                data_list.append(song_data)
                song.selected = True
    data_object["songs"] = data_list

    return HttpResponse(json.dumps(data_object))

def details(request, song_id):
    song = get_object_or_404(Song, pk=song_id)
    lists = List.objects.all().order_by('list_name')
    list_items = ListItem.objects.all()
    return render(request, 'makeperfect_app/details.html', {'song': song,
                                                            'lists': lists,
                                                            'list_items': list_items, })


def edit(request, song_id):
    filtered_song_list = Song.objects.filter(id=song_id)

    if len(filtered_song_list) > 0:
        print("FOUND")
        song = filtered_song_list[0]
    else:
        print("NEW")
        song = Song()

    if request.POST:
        print(request.POST)
        song.song_title = request.POST["song_title"]
        song.artist = request.POST["artist"]
        song.key = request.POST["key"]
        song.chords = request.POST["chords"]
        song.lyrics = request.POST["lyrics"]
        song.notes = request.POST["notes"]
        song.save()
        return HttpResponseRedirect("/song/" + str(song.id) + "/")
    return render(request, 'makeperfect_app/edit.html', {'song': song})








# NOT USING THIS VIEW, SAVED FOR REFERENCE

def editlist(request, list_id):
    songs = Song.objects.all().order_by('song_title')
    filtered_list_of_lists = List.objects.filter(id=list_id)


    if len(filtered_list_of_lists) > 0:
        print("FOUND")
        list = filtered_list_of_lists[0]
    else:
        print("NEW")
        list = List()

    list_items = ListItem.objects.filter(list_name=list)

    for song in songs:
        for list_item in list_items:
            if list_item.song == song:
                song.selected = True;

    if request.POST:
        print(request.POST)
        list.list_name = request.POST["list_name"]
        list.save()
        for song in songs:
            if "cb_" + str(song.id) in request.POST:
                print ("create relationship if no relationship exists")
            else:
                print ("remove relationship if it exists")

        return HttpResponseRedirect("/editlist/" + str(list.id) + "/")


    return render(request, 'makeperfect_app/editlist.html', {'list': list, 'songs': songs, 'list_items': list_items})
