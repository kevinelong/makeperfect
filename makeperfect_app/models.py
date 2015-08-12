from django.db import models
from django.contrib.auth.models import User


class Song(models.Model):
    user = models.ForeignKey(User)
    song_title = models.CharField(max_length=200)
    lyrics = models.TextField(blank=True)  # changed default text to blank=True
    chords = models.TextField(blank=True)
    artist = models.CharField(max_length=100, blank=True)
    key = models.CharField(max_length=25, blank=True)  # increased max_length from 10 to 25, just in case
    song_notes = models.TextField(blank=True)  # changed notes to song_notes

    def __str__(self):  # __unicode__ on Python 2
        return self.song_title

    def __unicode__(self):  # __
        return self.song_title


class Setlist(models.Model):  # changed List to Setlist
    user = models.ForeignKey(User)
    setlist_title = models.CharField(max_length=200)  # changed list_name to setlist_title
    setlist_notes = models.TextField(blank=True)  # added setlist_notes

    def __str__(self):  # __unicode__ on Python 2
        return self.setlist_title   # changed list_name to setlist_title

    def __unicode__(self):  # __
        return self.setlist_title   # changed list_name to setlist_title


# TODO Do I need to add symmetrical = False??
# changed ListItem to SetlistItem
class SetlistItem(models.Model):
    setlist = models.ForeignKey(Setlist)  # changed list_name to setlist
    song = models.ForeignKey(Song)
    position = models.IntegerField(default=0)

    def __str__(self):  # __unicode__ on Python 2
        return "SETLIST: " + str(self.setlist) + "; SONG: " + str(self.song)  # changed list_name to setlist

    def __unicode__(self):  # __
        return "SETLIST: " + str(self.setlist) + "; SONG: " + str(self.song)  # changed list_name to setlist

    user = models.ForeignKey(User)
