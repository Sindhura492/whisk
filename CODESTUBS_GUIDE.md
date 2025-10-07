# Code Stubs Generation Guide

Complete documentation for the AI-powered code generation feature.

## 🎯 Overview

The Code Stubs feature generates complete Django REST Framework implementation code from your specifications. It creates production-ready models, serializers, ViewSets, and URL routing.

## 📍 Route

```
/code-stubs/:id
```

Where `:id` is the UUID of your specification.

## 🚀 Features

### ✅ Module Selection
- **Dropdown menu** to select from available modules
- Shows entity count per module
- Auto-selects first module on load
- Disabled state when no modules exist

### ✅ Code Generation
- **POST to `/api/code-stubs/`** with:
  - `spec_id`: Specification UUID
  - `language`: "python" (default)
  - `framework`: "django" (default)
- Generated files:
  - 🗄️ `models.py` - Django models
  - 🔄 `serializers.py` - DRF serializers
  - 👁️ `views.py` - DRF ViewSets
  - 🔗 `urls.py` - Router configuration

### ✅ Code Display
- **4 file tabs** with color-coded buttons
- **Syntax highlighting** with VSCode Dark Plus theme
- **Line numbers** for easy reference
- **Scrollable viewer** (max 70vh height)

### ✅ Copy Functionality
- **Copy button** per file with success feedback
- Copies to clipboard instantly
- Shows "✓ Copied!" confirmation for 2 seconds

### ✅ Download Options
- **Download individual file** via toolbar button
- **Download all files** via header button
- Files named correctly (models.py, serializers.py, etc.)

## 🎨 UI Components

### 1. Page Header
```
💻 Generated Code Stubs
Generate Django REST Framework implementation code
[📥 Download All Files] (when code exists)
```

### 2. Generation Controls (Before Generation)
```
┌─────────────────────────────────────────────┐
│ Select Module to Generate Code:            │
│ [Dropdown: Module Name (N entities)]       │
│                                             │
│ [⚡ Generate Django/DRF Code Stubs]        │
│                                             │
│ 💡 Tip: The code generator will create...  │
└─────────────────────────────────────────────┘
```

### 3. Code Viewer (After Generation)
```
┌─────────────────────────────────────────────┐
│ Module_Name Module                          │
│ DJANGO · PYTHON              [← Generate New]│
├──────────┬──────────────────────────────────┤
│ Files    │ Toolbar: models.py               │
│          │ [📋 Copy] [💾 Download]          │
│ 🗄️ models│──────────────────────────────────│
│ 🔄 serial│                                  │
│ 👁️ views │   CODE WITH SYNTAX               │
│ 🔗 urls  │   HIGHLIGHTING                   │
│          │                                  │
│ Module:  │                                  │
│ Language:│                                  │
│ Framework│                                  │
└──────────┴──────────────────────────────────┘
```

## 📝 Usage Flow

### Step 1: Navigate to Page
```typescript
// From SpecPage
navigate(`/code-stubs/${spec.id}`);

// From SpecsListPage
<Link to={`/code-stubs/${spec.id}`}>Generate Code</Link>

// Direct URL
http://localhost:3000/code-stubs/123e4567-e89b-12d3-a456-426614174000
```

### Step 2: Select Module
1. Page loads specification
2. Dropdown auto-populated with modules
3. First module auto-selected
4. User can change selection

### Step 3: Generate Code
1. Click "⚡ Generate Django/DRF Code Stubs"
2. Loading state shown with spinner
3. API call to `/api/code-stubs/`
4. Code viewer displays on success

### Step 4: View & Use Code
1. Click file tabs to switch between files
2. Scroll through code with syntax highlighting
3. Copy individual files to clipboard
4. Download individual or all files

## 🔧 API Integration

### Request
```typescript
POST /api/code-stubs/

Body:
{
  "spec_id": "uuid-here",
  "language": "python",
  "framework": "django"
}
```

### Response
```typescript
{
  "blueprint_id": "uuid-here",
  "module_name": "inventory_management",
  "language": "python",
  "framework": "django",
  "implementation": {
    "models_py": "from django.db import models...",
    "serializers_py": "from rest_framework import serializers...",
    "views_py": "from rest_framework import viewsets...",
    "urls_py": "from django.urls import path..."
  }
}
```

## 🎨 Styling Details

### Color Scheme
- **Blue (models.py)**: Primary, data layer
- **Green (serializers.py)**: Success, transformation
- **Purple (views.py)**: Premium, business logic
- **Orange (urls.py)**: Warning, routing

### Gradients
- **Header**: `from-gray-800 to-gray-900`
- **Controls**: `from-blue-50 to-indigo-50`
- **Button**: `from-blue-600 to-indigo-600`

### Interactive States
- **Hover**: Shadow lift, slight transform
- **Active Tab**: Colored background, shadow
- **Copy Success**: Green background, checkmark
- **Disabled**: Gray background, no pointer

## 💡 Features Breakdown

### Module Selector
```typescript
<select
  value={selectedModule}
  onChange={(e) => setSelectedModule(e.target.value)}
  disabled={generating || modules.length === 0}
>
  {modules.map((module) => (
    <option value={module.name}>
      {module.name} ({module.entities?.length || 0} entities)
    </option>
  ))}
</select>
```

### Generate Button
```typescript
<button
  onClick={handleGenerateCode}
  disabled={generating || !selectedModule}
>
  {generating ? (
    <span>
      <Spinner />
      Generating Django/DRF Code...
    </span>
  ) : (
    <span>⚡ Generate Django/DRF Code Stubs</span>
  )}
</button>
```

### File Tabs
```typescript
{files.map((file) => (
  <button
    onClick={() => setSelectedFile(file.key)}
    className={selectedFile === file.key ? 'active' : 'inactive'}
  >
    {file.icon} {file.label}
  </button>
))}
```

### Copy with Feedback
```typescript
const handleCopyCode = (fileKey: string) => {
  const code = codeStubs.implementation[fileKey];
  navigator.clipboard.writeText(code).then(() => {
    setCopySuccess(fileKey);
    setTimeout(() => setCopySuccess(null), 2000);
  });
};
```

### Download Individual File
```typescript
const handleDownloadCode = (fileKey: string) => {
  const code = codeStubs.implementation[fileKey];
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileKey.replace('_', '.');
  link.click();
  URL.revokeObjectURL(url);
};
```

### Download All Files
```typescript
const handleDownloadAll = () => {
  Object.entries(codeStubs.implementation).forEach(([key, code]) => {
    // Create and download each file
  });
};
```

## 🔍 Code Quality

Generated code follows these best practices:

### models.py
- Django ORM models
- Proper field types and constraints
- `unique=True` for unique fields
- `max_length` for CharFields
- `DecimalField` for prices
- Auto timestamps (`created_at`, `updated_at`)

### serializers.py
- DRF ModelSerializers
- All fields included
- Read-only fields marked
- Meta class configuration

### views.py
- DRF ViewSets
- Proper permissions
- Query optimization
- Standard CRUD operations

### urls.py
- Router-based URL configuration
- ViewSet registration
- Clean path structure
- Namespace support

## 📊 Example Generated Code

### models.py
```python
from django.db import models
import uuid

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
```

### serializers.py
```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
```

### views.py
```python
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

### urls.py
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

## 🎯 User Experience

### Loading States
- Initial load: Spinner with "Loading specification..."
- Generating: Spinner with "Generating Django/DRF Code..."
- Success: Immediate code display
- Error: Red alert with error message

### Empty States
- **No modules**: Yellow warning banner with instructions
- **Before generation**: Large icon with instructions
- **Module info**: Shows entity count in dropdown

### Feedback
- **Copy success**: Green button with checkmark (2s)
- **Generation success**: Immediate code display
- **Download**: Automatic file download

## 🚀 Best Practices

1. **Always select a module** before generating
2. **Review generated code** before using in production
3. **Customize as needed** for your specific requirements
4. **Test thoroughly** after integration
5. **Add validation** and business logic as needed

## 🔮 Future Enhancements

- [ ] Multiple language support (Node.js, Go, etc.)
- [ ] Framework selection (FastAPI, Express, etc.)
- [ ] Code customization options
- [ ] Direct deployment to GitHub
- [ ] Integration with CI/CD pipelines
- [ ] Code quality metrics
- [ ] Automated testing generation
- [ ] API documentation generation

---

**The Code Stubs feature provides instant, production-ready Django REST Framework code from your specifications! 💻⚡**

