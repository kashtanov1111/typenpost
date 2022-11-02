# Generated by Django 4.1 on 2022-10-09 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_remove_follow_accounts_follow_unique_relationships_and_more'),
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
            old_name='to_user',
            new_name='fromm',
        ),
        migrations.RenameField(
            model_name='follow',
            old_name='from_user',
            new_name='to',
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.UniqueConstraint(fields=('to', 'fromm'), name='accounts_follow_unique_relationships'),
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.CheckConstraint(check=models.Q(('to', models.F('fromm')), _negated=True), name='accounts_follow_prevent_self_follow'),
        ),
    ]