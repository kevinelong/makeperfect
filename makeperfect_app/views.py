from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.shortcuts import get_object_or_404, render
from .models import Song, List, ListItem

import json

def index(request):
    song_list = Song.objects.all().order_by('song_title')
    lists = List.objects.all()
    list_items = ListItem.objects.all()
    template = loader.get_template('makeperfect_app/index.html')
    context = RequestContext(request, {
        'song_list': song_list,
        'lists': lists,
        'list_items': list_items,
    })
    return HttpResponse(template.render(context))


def details(request, song_id):
    song = get_object_or_404(Song, pk=song_id)
    return render(request, 'makeperfect_app/details.html', {'song': song})


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

def editlist(request, list_id):
    filtered_list_of_lists = List.objects.filter(id=list_id)

    if len(filtered_list_of_lists) > 0:
        print("FOUND")
        list = filtered_list_of_lists[0]
    else:
        print("NEW")
        list = List()

    if request.POST:
        print(request.POST)
        list.list_name = request.POST["list_name"]
        list.save()
        return HttpResponseRedirect("/")
    return render(request, 'makeperfect_app/editlist.html', {'list': list})
