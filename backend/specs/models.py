import uuid
from django.db import models
from django.contrib.auth.models import User


class Spec(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='specs',
        help_text="The user who created this specification",
        null=True,  # Temporarily allow null for migration
        blank=True
    )
    idea = models.TextField(help_text="The initial idea or requirement")
    spec_json = models.JSONField(help_text="Generated specification in JSON format")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"Blueprint {self.id}: {self.idea[:50]}..."