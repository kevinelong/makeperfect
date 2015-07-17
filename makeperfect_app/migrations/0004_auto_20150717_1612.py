# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makeperfect_app', '0003_auto_20150716_1146'),
    ]

    operations = [
        migrations.CreateModel(
            name='SetHeader',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('set_name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='SetListItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('ordinal', models.IntegerField(default=0)),
                ('set', models.ForeignKey(to='makeperfect_app.SetHeader')),
            ],
        ),
        migrations.AlterField(
            model_name='song',
            name='artist',
            field=models.CharField(blank=True, default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='song',
            name='chords',
            field=models.TextField(blank=True, default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='song',
            name='key',
            field=models.CharField(blank=True, default='', max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='song',
            name='notes',
            field=models.TextField(blank=True, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='setlistitem',
            name='song',
            field=models.ForeignKey(to='makeperfect_app.Song'),
        ),
    ]
