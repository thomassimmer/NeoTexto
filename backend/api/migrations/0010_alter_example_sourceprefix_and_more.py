# Generated by Django 4.2 on 2023-06-29 05:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_example_unique_together_example_sourceprefix_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='example',
            name='sourcePrefix',
            field=models.TextField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='example',
            name='sourceSuffix',
            field=models.TextField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='example',
            name='sourceTerm',
            field=models.TextField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='example',
            name='targetPrefix',
            field=models.TextField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='example',
            name='targetSuffix',
            field=models.TextField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='example',
            name='targetTerm',
            field=models.TextField(default='', max_length=100),
        ),
    ]
