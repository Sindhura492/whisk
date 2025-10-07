from django.urls import path
from . import views

urlpatterns = [
    path('specs/generate/', views.generate_spec, name='generate_spec'),
    path('specs/<uuid:spec_id>/', views.get_spec, name='get_spec'),
    path('specs/', views.list_specs, name='list_specs'),
    path('specs/refine/<uuid:spec_id>/', views.refine_spec, name='refine_spec'),
    path('code-stubs/', views.generate_code_stubs, name='generate_code_stubs'),
]
