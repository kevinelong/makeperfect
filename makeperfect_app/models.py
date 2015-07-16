from django.db import models

# Create your models here.
class Song(models.Model):
    song_title = models.CharField(max_length=200)
    # lyrics
    lyrics = models.TextField(default='ADD LYRICS')
    # chord progression
    chords = models.TextField(null=True)
    # original artist
    artist = models.CharField(max_length=100, null=True)
    # key
    key = models.CharField(max_length=10, null=True)
    # memorized? in progress?  a way to track the state of learning of the piece

    # notes/comments
    notes = models.TextField(null=True)
    # primary instrument for solo performances and sorting in a set list

    # a place to store links to YouTube videos relate to the song

    # a way to store PDFs or .jpg files

    # checklist for practicing (what to focus on, i.e. memorize/transpose/arrange)

    def __str__(self): # __unicode__ on Python 2
        return self.song_title

    def __unicode__(self): # __
        return self.song_title

# class Repertoire(models.Model):
#
#
# class SetList(models.Model):
    # a set list is a subset of one's Repertoire