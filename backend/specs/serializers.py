from rest_framework import serializers
from .models import Spec


class SpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spec
        fields = ['id', 'idea', 'spec_json', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SpecGenerateSerializer(serializers.Serializer):
    idea = serializers.CharField(
        max_length=10000,
        help_text="Business concept or requirement description"
    )


class SpecRefineSerializer(serializers.Serializer):
    feedback = serializers.CharField(
        max_length=10000,
        help_text="Feedback or modification instructions for the blueprint"
    )


class CodeStubSerializer(serializers.Serializer):
    spec_id = serializers.UUIDField(help_text="ID of the blueprint to generate code from")
    language = serializers.CharField(
        max_length=50, 
        default='python',
        help_text="Programming language for code generation"
    )
    framework = serializers.CharField(
        max_length=50, 
        required=False,
        help_text="Framework preference (e.g., 'django', 'fastapi')"
    )
