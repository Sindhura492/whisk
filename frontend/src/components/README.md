# Components Documentation

## DesignPreview Component

A generic, reusable component for rendering interactive UI previews from AppSpec definitions.

### Overview

The `DesignPreview` component takes an `AppSpec` and renders all UI components (Tables and Forms) with beautiful Tailwind styling, hover effects, and realistic sample data.

### Features

✅ **Generic & Reusable** - Works with any AppSpec
✅ **Table Rendering** - Dynamic columns, sample rows, action buttons
✅ **Form Rendering** - Smart input types based on field types
✅ **Field Type Support** - All FieldTypes (string, text, integer, number, boolean, date, datetime, email)
✅ **Rich UI** - Tailwind styling with hover effects, shadows, gradients
✅ **Validation Indicators** - Shows required fields, unique constraints
✅ **Sample Data** - Generates realistic sample data for preview
✅ **Responsive** - Mobile-friendly grid layouts

### Usage

```typescript
import { DesignPreview } from '../components/DesignPreview';
import type { AppSpec } from '../types/spec';

function MyPage() {
  const spec: AppSpec = {
    title: "Inventory System",
    description: "...",
    modules: [...],
    kpis: [...]
  };

  return (
    <DesignPreview 
      spec={spec} 
      selectedModuleIndex={0} 
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spec` | `AppSpec` | required | The application specification |
| `selectedModuleIndex` | `number` | `0` | Index of the module to display |

### Component Structure

```
DesignPreview
├── Module Header (with gradient background)
├── UIComponentPreview (for each UI item)
│   ├── Component Header (with icon and type badge)
│   └── Component Body
│       ├── TablePreview (if type === "Table")
│       └── FormPreview (if type === "Form")
```

### Table Preview Features

- **Dynamic Columns** - Renders columns from spec or entity fields
- **Sample Rows** - Generates 3 sample rows with realistic data
- **Action Buttons** - Edit and Delete buttons (disabled)
- **Field Indicators** - Shows required fields with asterisk
- **Hover Effects** - Row highlighting on hover
- **Pagination UI** - Previous/Next buttons (non-functional)
- **Type-Based Data** - Sample data matches field types

**Supported Field Types:**
- `string` → "Sample fieldname 1"
- `email` → "user1@example.com"
- `integer/number` → 100, 200, 300
- `boolean` → "Yes" / "No"
- `date` → Current date
- `datetime` → Current date and time
- `text` → "Sample text"

### Form Preview Features

- **Smart Input Types** - Automatically selects correct HTML input type
- **Two-Column Layout** - Responsive grid (1 col mobile, 2 cols desktop)
- **Text Area Support** - Full-width textarea for text fields
- **Checkbox Support** - Proper rendering for boolean fields
- **Field Labels** - Auto-formatted from field names
- **Required Indicators** - Red asterisk for required fields
- **Unique Badges** - Purple badge for unique constraints
- **Help Text** - Displays field help text with emoji
- **Max Length Info** - Shows character limits
- **Submit Buttons** - Cancel and Submit (disabled)

**Input Type Mapping:**
- `email` → `<input type="email">`
- `number/integer` → `<input type="number">`
- `date` → `<input type="date">`
- `datetime` → `<input type="datetime-local">`
- `boolean` → `<input type="checkbox">`
- `text` → `<textarea>`
- `string` → `<input type="text">`

### Styling

The component uses Tailwind CSS with:

- **Cards** - Rounded corners, shadows, borders
- **Gradients** - Subtle color gradients for headers
- **Hover Effects** - Scale, shadow, and color transitions
- **Spacing** - Consistent padding and margins
- **Typography** - Clear hierarchy with font weights
- **Colors** - Blue/indigo primary, gray neutrals
- **Shadows** - Layered shadow effects on hover

### Example: Table Component

```typescript
const tableUI: SpecUI = {
  type: "Table",
  name: "Product List",
  entity: "Product",
  columns: ["sku", "name", "price", "quantity"]
};
```

**Renders:**
- Header with "📊 Product List" and badge
- Table with 4 columns + Actions column
- 3 sample rows with realistic data
- Edit/Delete buttons
- Pagination controls

### Example: Form Component

```typescript
const formUI: SpecUI = {
  type: "Form",
  name: "Create Product",
  entity: "Product",
  fields: [
    { name: "name", required: true },
    { name: "email", type: "email" },
    { name: "price", type: "number" },
    { name: "active", type: "boolean" }
  ]
};
```

**Renders:**
- Header with "📝 Create Product" and badge
- 2-column responsive grid
- Text input for name (with required indicator)
- Email input for email
- Number input for price
- Checkbox for active
- Cancel and Submit buttons

### Customization

The component is designed to be easily customizable:

1. **Colors** - Modify Tailwind color classes
2. **Sample Data** - Adjust `getSampleValue()` function
3. **Layout** - Change grid columns or spacing
4. **Icons** - Replace emoji icons with custom icons
5. **Actions** - Add real functionality to buttons

### Best Practices

1. **Always provide entity data** - Forms and tables work best with entity field definitions
2. **Use descriptive names** - Component names help users understand the UI
3. **Include help text** - Helps users understand field purposes
4. **Mark required fields** - Improves UX clarity
5. **Use appropriate field types** - Ensures correct input rendering

### Integration

The component is integrated into `DesignPreviewPage`:

```typescript
<DesignPreview
  spec={spec.spec_json}
  selectedModuleIndex={selectedModule}
/>
```

### Future Enhancements

- [ ] Add real CRUD operations
- [ ] Implement functional pagination
- [ ] Add filtering and sorting
- [ ] Support for nested objects
- [ ] File upload field support
- [ ] Rich text editor for text fields
- [ ] Date range pickers
- [ ] Custom validators
- [ ] Real-time validation
- [ ] Form submission handling

---

**The DesignPreview component provides a beautiful, interactive way to visualize your application's UI before any code is written! 🎨**

