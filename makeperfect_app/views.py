from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
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