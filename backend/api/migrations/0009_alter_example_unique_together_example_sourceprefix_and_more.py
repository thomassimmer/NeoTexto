# Generated by Django 4.2 on 2023-06-29 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_example_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='example',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='example',
            name='sourcePrefix',
            field=models.TextField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='example',
            name='sourceSuffix',
            field=models.TextField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='example',
            name='sourceTerm',
            field=models.TextField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='example',
            name='targetPrefix',
            field=models.TextField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='example',
            name='targetSuffix',
            field=models.TextField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='example',
            name='targetTerm',
            field=models.TextField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='example',
            name='example_source',
        ),
        migrations.RemoveField(
            model_name='example',
            name='example_target',
        ),
    ]
