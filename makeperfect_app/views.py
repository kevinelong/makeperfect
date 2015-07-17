from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse
from .models import Song

import json

# Create your views here.

def index(request):
    song_list = Song.objects.all()
    template = loader.get_template('makeperfect_app/index.html')
    context = RequestContext(request, {
        'song_list': song_list,
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
