# Generated by Django 4.2.4 on 2023-08-10 04:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("teams", "0001_initial"),
        ("nicknames", "0002_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="members",
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name="team",
            name="nicknames",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="nicknames.nickname"
            ),
        ),
    ]
