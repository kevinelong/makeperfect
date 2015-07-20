# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0005_auto_20150720_1150'),
    ]

    operations = [
        migrations.CreateModel(
            name='SongtListItem',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('position', models.IntegerField(default=0)),
                ('song', models.ForeignKey(to='makeperfect_app.Song')),
                ('song_list', models.ForeignKey(to='makeperfect_app.SongListHeader')),
            ],
        ),
        migrations.RemoveField(
            model_name='setlistitem',
            name='song',
        ),
        migrations.RemoveField(
            model_name='setlistitem',
            name='song_list',
        ),
        migrations.DeleteModel(
            name='SetListItem',
        ),
    ]
