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