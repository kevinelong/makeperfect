# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0002_song_lyrics'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='artist',
            field=models.CharField(null=True, max_length=100),
        ),
        migrations.AddField(
            model_name='song',
            name='chords',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='song',
            name='key',
            field=models.CharField(null=True, max_length=10),
        ),
        migrations.AddField(
            model_name='song',
            name='notes',
            field=models.TextField(null=True),
        ),
    ]
