# Generated by Django 4.2 on 2023-06-18 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_text_language'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customusermodel',
            old_name='active',
            new_name='is_active',
        ),
        migrations.AlterField(
            model_name='text',
            name='text',
            field=models.TextField(blank=True, max_length=10000, null=True),
        ),
    ]
