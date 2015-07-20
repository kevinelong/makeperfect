# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0007_auto_20150720_1301'),
    ]

    operations = [
        migrations.CreateModel(
            name='ListItem',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('position', models.IntegerField(default=0)),
                ('song', models.ForeignKey(to='makeperfect_app.Song')),
            ],
        ),
        migrations.RenameModel(
            old_name='SongListHeader',
            new_name='Lists',
        ),
        migrations.RemoveField(
            model_name='songlistitem',
            name='song',
        ),
        migrations.RemoveField(
            model_name='songlistitem',
            name='song_list',
        ),
        migrations.RenameField(
            model_name='lists',
            old_name='song_list_name',
            new_name='list_name',
        ),
        migrations.DeleteModel(
            name='SongListItem',
        ),
        migrations.AddField(
            model_name='listitem',
            name='song_list',
            field=models.ForeignKey(to='makeperfect_app.Lists'),
        ),
    ]
