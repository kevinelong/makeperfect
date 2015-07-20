# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0008_auto_20150720_1305'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Lists',
            new_name='List',
        ),
    ]
