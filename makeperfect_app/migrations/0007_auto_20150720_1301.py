# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0006_auto_20150720_1153'),
    ]

    operations = [
        migrations.CreateModel(
            name='SongListItem',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('position', models.IntegerField(default=0)),
                ('song', models.ForeignKey(to='makeperfect_app.Song')),
                ('song_list', models.ForeignKey(to='makeperfect_app.SongListHeader')),
            ],
        ),
        migrations.RemoveField(
            model_name='songtlistitem',
            name='song',
        ),
        migrations.RemoveField(
            model_name='songtlistitem',
            name='song_list',
        ),
        migrations.DeleteModel(
            name='SongtListItem',
        ),
    ]
