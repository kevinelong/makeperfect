# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0004_auto_20150717_1612'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='SetHeader',
            new_name='SongListHeader',
        ),
        migrations.RenameField(
            model_name='setlistitem',
            old_name='ordinal',
            new_name='position',
        ),
        migrations.RenameField(
            model_name='setlistitem',
            old_name='set',
            new_name='song_list',
        ),
        migrations.RenameField(
            model_name='songlistheader',
            old_name='set_name',
            new_name='song_list_name',
        ),
    ]
