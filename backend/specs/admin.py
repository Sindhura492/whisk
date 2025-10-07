from django.contrib import admin
from .models import Spec


@admin.register(Spec)
class SpecAdmin(admin.ModelAdmin):
    list_display = ['id', 'concept_preview', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['idea', 'spec_json']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def concept_preview(self, obj):
        return obj.idea[:50] + '...' if len(obj.idea) > 50 else obj.idea
    concept_preview.short_description = 'Concept Preview'
