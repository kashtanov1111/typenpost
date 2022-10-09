# Generated by Django 4.1 on 2022-10-09 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_remove_follow_accounts_follow_unique_relationships_and_more'),
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
        migrations.RenameField(
            model_name='follow',
            old_name='too',
            new_name='from_user',
        ),
        migrations.RenameField(
            model_name='follow',
            old_name='fr',
            new_name='to_user',
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.UniqueConstraint(fields=('from_user', 'to_user'), name='accounts_follow_unique_relationships'),
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.CheckConstraint(check=models.Q(('from_user', models.F('to_user')), _negated=True), name='accounts_follow_prevent_self_follow'),
        ),
    ]
