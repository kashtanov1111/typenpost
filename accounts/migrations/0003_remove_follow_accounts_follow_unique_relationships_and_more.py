# Generated by Django 4.1 on 2022-10-09 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_userprofile_about'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='follow',
            name='accounts_follow_unique_relationships',
        ),
        migrations.RemoveConstraint(
            model_name='follow',
            name='accounts_follow_prevent_self_follow',
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.UniqueConstraint(fields=('to_user', 'from_user'), name='accounts_follow_unique_relationships'),
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.CheckConstraint(check=models.Q(('to_user', models.F('from_user')), _negated=True), name='accounts_follow_prevent_self_follow'),
        ),
    ]