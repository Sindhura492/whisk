"""
AI Service for generating and refining technical blueprints and code implementations.

This module provides two main system prompts:
- SYSTEM_SPEC_PROMPT: For generating JSON specifications from business ideas
- SYSTEM_CODE_PROMPT: For generating Django/DRF implementation code from specifications
"""
import json
import openai
from typing import Dict, List, Tuple
from django.conf import settings


# System prompt for specification generation
SYSTEM_SPEC_PROMPT = """You are an expert product/solution architect. Given an app idea, produce a STRICT JSON spec with keys:
title, description, modules[], kpis[].
Each module: name, purpose, entities[], apis[], ui[].
Entity fields use types: string|text|integer|number|boolean|date|datetime|email.
apis define method/path/entity; ui defines Table/Form components pointing to entities/fields.
No prose. Return VALID JSON only."""


# System prompt for Django/DRF code generation
SYSTEM_CODE_PROMPT = """You are a senior Django/DRF engineer. Given a JSON app spec and a module name, generate PYTHON code strings for:
- models.py (Django models),
- serializers.py (DRF ModelSerializers),
- views.py (DRF ViewSets),
- urls.py (router.register per viewset).
Follow:
- DecimalField for prices with max_digits=10, decimal_places=2.
- CharField with max_length.
- Unique=True where indicated.
- Auto timestamps created_at/updated_at on base model or per model.
- Clean imports, PEP8, no comments except section headers."""


class AIService:
    """Service class for OpenAI operations with technical blueprint generation."""
    
    def __init__(self):
        try:
            self.api_key = getattr(settings, 'OPENAI_API_KEY', None)
        except Exception:
            # Django settings not configured yet
            self.api_key = None
        
        self.client = None
        if self.api_key:
            self.client = openai.OpenAI(api_key=self.api_key)
        self.model = "gpt-4o-mini"  # Use gpt-4-turbo for production
        self.temperature = 0.2
        self.max_tokens = 4000
    
    def generate_blueprint(self, concept: str) -> Dict:
        """
        Generate a comprehensive technical specification from a business concept.
        
        Args:
            concept: The business idea or requirement description
            
        Returns:
            Dict: Technical specification with structured schema
        """
        user_prompt = f"Generate a technical specification for: {concept}"
        
        if not self.client:
            raise Exception("OpenAI client not initialized - API key not configured")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_SPEC_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            
            blueprint_json = response.choices[0].message.content
            return json.loads(blueprint_json)
            
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON response from AI service")
        except Exception as e:
            raise Exception(f"AI service error: {str(e)}")
    
    def refine_blueprint(self, current_blueprint: Dict, instruction: str) -> Dict:
        """
        Refine an existing technical specification based on feedback or new requirements.
        
        Args:
            current_blueprint: The existing specification to modify
            instruction: Specific feedback or modification request
            
        Returns:
            Dict: Refined technical specification maintaining schema integrity
        """
        user_prompt = f"""
        Current Specification:
        {json.dumps(current_blueprint, indent=2)}
        
        Refinement Instruction:
        {instruction}
        
        Return the refined specification maintaining the exact same JSON schema with keys: title, description, modules[], kpis[].
        """
        
        if not self.client:
            raise Exception("OpenAI client not initialized - API key not configured")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_SPEC_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            
            refined_json = response.choices[0].message.content
            return json.loads(refined_json)
            
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON response from AI service")
        except Exception as e:
            raise Exception(f"AI service error: {str(e)}")
    
    def generate_implementation(self, blueprint: Dict, module_name: str) -> Dict[str, str]:
        """
        Generate Django REST Framework implementation code from a technical specification.
        
        Args:
            blueprint: The technical specification containing modules, entities, and APIs
            module_name: Name for the Django module (e.g., 'products', 'orders')
            
        Returns:
            Dict: Code files as strings - models_py, serializers_py, views_py, urls_py
        """
        user_prompt = f"""
        Generate Django REST Framework implementation for module '{module_name}' from this specification:
        
        Specification:
        {json.dumps(blueprint, indent=2)}
        
        Map entity field types to Django fields:
        - string -> CharField(max_length=255)
        - text -> TextField()
        - integer -> IntegerField()
        - number -> DecimalField(max_digits=10, decimal_places=2)
        - boolean -> BooleanField()
        - date -> DateField()
        - datetime -> DateTimeField()
        - email -> EmailField()
        
        Return JSON with four keys: models_py, serializers_py, views_py, urls_py
        Each value should contain the complete Python code as a string.
        """
        
        if not self.client:
            raise Exception("OpenAI client not initialized - API key not configured")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_CODE_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            
            implementation_json = response.choices[0].message.content
            return json.loads(implementation_json)
            
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON response from AI service")
        except Exception as e:
            raise Exception(f"AI service error: {str(e)}")
    
    def validate_api_key(self) -> bool:
        """Check if OpenAI API key is properly configured."""
        return bool(self.api_key)


# Global instance for easy access
ai_service = AIService()


# Export constants and service for external use
__all__ = ['SYSTEM_SPEC_PROMPT', 'SYSTEM_CODE_PROMPT', 'AIService', 'ai_service']
