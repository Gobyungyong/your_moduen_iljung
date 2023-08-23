# Generated by Django 4.2.4 on 2023-08-23 18:20

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Schedule",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=25)),
                ("description", models.TextField()),
                (
                    "state",
                    models.CharField(
                        choices=[
                            ("To do", "to_do"),
                            ("Doing", "doing"),
                            ("Done", "done"),
                        ],
                        max_length=20,
                    ),
                ),
                ("start_date", models.DateTimeField()),
                ("end_date", models.DateTimeField()),
            ],
        ),
    ]
