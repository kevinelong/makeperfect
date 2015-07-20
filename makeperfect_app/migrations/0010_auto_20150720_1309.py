# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0009_auto_20150720_1306'),
    ]

    operations = [
        migrations.RenameField(
            model_name='listitem',
            old_name='song_list',
            new_name='list_name',
        ),
    ]
