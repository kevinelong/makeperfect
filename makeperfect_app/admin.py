from django.contrib import admin

from .models import Song
from .models import Setlist
from .models import SetlistItem

admin.site.register(Song)
admin.site.register(Setlist)
admin.site.register(SetlistItem)

