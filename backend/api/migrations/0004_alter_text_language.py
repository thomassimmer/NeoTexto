# Generated by Django 4.2 on 2023-06-17 11:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_language_customusermodel_mother_tongue_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='language',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.language'),
        ),
    ]
