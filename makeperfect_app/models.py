from django.db import models
from django.contrib.auth.models import User

class Song(models.Model):
    user = models.ForeignKey(User)
    song_title = models.CharField(max_length=200)
    lyrics = models.TextField(default='ADD LYRICS')
    chords = models.TextField(blank=True)
    artist = models.CharField(max_length=100, blank=True)
    key = models.CharField(max_length=10, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self): # __unicode__ on Python 2
        return self.song_title

    def __unicode__(self): # __
        return self.song_title

class List(models.Model):
    user = models.ForeignKey(User)
    list_name = models.CharField(max_length=200)

    def __str__(self):  # __unicode__ on Python 2
        return self.list_name

    def __unicode__(self): # __
        return self.list_name

class ListItem(models.Model):
    list_name = models.ForeignKey(List)
    song = models.ForeignKey(Song)
    position = models.IntegerField(default=0)

    def __str__(self):  # __unicode__ on Python 2
        return "LIST: " + str(self.list_name) + "; SONG: " + str(self.song)

    def __unicode__(self):  # __
        return "LIST: " + str(self.list_name) + "; SONG: " + str(self.song)

    user = models.ForeignKey(User)
