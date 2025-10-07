from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Spec
from .serializers import (
    SpecSerializer,
    SpecGenerateSerializer,
    SpecRefineSerializer,
    CodeStubSerializer,
)
from .ai_service import ai_service


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_spec(request):
    """Generate a technical blueprint from a business concept using AI"""
    serializer = SpecGenerateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    concept = serializer.validated_data['idea']
    
    try:
        if not ai_service.validate_api_key():
            return Response(
                {"error": "OpenAI API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Generate technical blueprint using AI service
        blueprint = ai_service.generate_blueprint(concept)
        
        # Create and save the blueprint for the authenticated user
        spec = Spec.objects.create(
            user=request.user,
            idea=concept,
            spec_json=blueprint
        )
        
        return Response(SpecSerializer(spec).data, status=status.HTTP_201_CREATED)
        
    except ValueError as e:
        return Response(
            {"error": f"Invalid response from AI service: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_spec(request, spec_id):
    """Get a specific specification by ID (only user's own specs)"""
    try:
        spec = Spec.objects.get(id=spec_id, user=request.user)
        return Response(SpecSerializer(spec).data)
    except Spec.DoesNotExist:
        return Response(
            {"error": "Specification not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_specs(request):
    """Get the latest 10 specifications for the authenticated user"""
    specs = Spec.objects.filter(user=request.user)[:10]
    serializer = SpecSerializer(specs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refine_spec(request, spec_id):
    """Refine a technical blueprint based on feedback (only user's own specs)"""
    try:
        spec = Spec.objects.get(id=spec_id, user=request.user)
    except Spec.DoesNotExist:
        return Response(
            {"error": "Blueprint not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = SpecRefineSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    instruction = serializer.validated_data['feedback']
    
    try:
        if not ai_service.validate_api_key():
            return Response(
                {"error": "OpenAI API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Refine blueprint using AI service
        refined_blueprint = ai_service.refine_blueprint(spec.spec_json, instruction)
        
        # Update the spec
        spec.spec_json = refined_blueprint
        spec.save()
        
        return Response(SpecSerializer(spec).data)
        
    except ValueError as e:
        return Response(
            {"error": f"Invalid response from AI service: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_code_stubs(request):
    """Generate Django REST Framework implementation code from a technical blueprint (only user's own specs)"""
    serializer = CodeStubSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    spec_id = serializer.validated_data['spec_id']
    language = serializer.validated_data['language']
    framework = serializer.validated_data.get('framework', '')
    
    try:
        spec = Spec.objects.get(id=spec_id, user=request.user)
    except Spec.DoesNotExist:
        return Response(
            {"error": "Blueprint not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        if not ai_service.validate_api_key():
            return Response(
                {"error": "OpenAI API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Generate module name from the first module or use a default
        module_name = "api_module"
        if spec.spec_json.get('modules') and len(spec.spec_json['modules']) > 0:
            module_name = spec.spec_json['modules'][0]['name'].lower().replace(' ', '_')
        
        # Generate implementation code using AI service
        implementation = ai_service.generate_implementation(spec.spec_json, module_name)
        
        return Response({
            "blueprint_id": str(spec_id),
            "module_name": module_name,
            "language": language,
            "framework": framework,
            "implementation": implementation
        })
        
    except ValueError as e:
        return Response(
            {"error": f"Invalid response from AI service: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )