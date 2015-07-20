from django.contrib import admin

from .models import Song
from .models import List
from .models import ListItem

admin.site.register(Song)
admin.site.register(List)
admin.site.register(ListItem)

