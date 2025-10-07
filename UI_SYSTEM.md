# UI System Documentation

Complete Tailwind-based design system for clean, dashboard-style interfaces.

## 🎨 Design Principles

### Core Values
- **Consistency**: Unified look and feel across all pages
- **Responsiveness**: Mobile-first, works on all devices
- **Accessibility**: Semantic HTML, keyboard navigation
- **Performance**: Lightweight, minimal re-renders
- **Modern**: Clean, contemporary design language

### Color Palette
```css
Primary:   Blue (600-700) / Indigo (600-700)
Secondary: Gray (300-700)
Success:   Green (600-700)
Warning:   Yellow (600-700)
Danger:    Red (600-700)
```

---

## 📦 Components

### 1. Card Component

Flexible card container with multiple variants.

#### Basic Usage
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui';

<Card>
  <p>Simple card content</p>
</Card>
```

#### With Variants
```tsx
// Default - white background, shadow
<Card variant="default">Content</Card>

// Gradient - white to gray gradient
<Card variant="gradient">Content</Card>

// Bordered - 2px border, no shadow
<Card variant="bordered">Content</Card>
```

#### With Hover Effect
```tsx
<Card hover>
  <p>Hovers with scale and shadow</p>
</Card>
```

#### Complete Example
```tsx
<Card variant="gradient" hover>
  <CardHeader
    title="Technical Specification"
    subtitle="AI-generated from your idea"
    icon="📋"
    action={<button>Edit</button>}
  />
  <CardContent>
    <p>Your specification content here</p>
  </CardContent>
  <CardFooter>
    <button>View Details</button>
  </CardFooter>
</Card>
```

#### Props

**Card:**
- `children` (ReactNode) - Card content
- `className?` (string) - Additional classes
- `variant?` ("default" | "gradient" | "bordered") - Card style
- `hover?` (boolean) - Enable hover effects

**CardHeader:**
- `title` (string) - Main heading
- `subtitle?` (string) - Subheading
- `icon?` (ReactNode) - Icon element
- `action?` (ReactNode) - Action button/element

**CardContent:**
- `children` (ReactNode) - Content
- `className?` (string) - Additional classes

**CardFooter:**
- `children` (ReactNode) - Footer content
- `className?` (string) - Additional classes

#### Styling
```css
Base: rounded-2xl p-6
Shadow: shadow-md (default) or shadow-lg (gradient)
Border: border border-gray-200
Hover: hover:shadow-xl hover:scale-[1.02]
```

---

### 2. Button Component

Versatile button with multiple variants, sizes, and loading states.

#### Variants
```tsx
// Primary - solid gradient blue/indigo
<Button variant="primary">Primary Action</Button>

// Secondary - outline style
<Button variant="secondary">Secondary Action</Button>

// Success - solid green
<Button variant="success">Success</Button>

// Warning - solid yellow
<Button variant="warning">Warning</Button>

// Danger - solid red
<Button variant="danger">Delete</Button>

// Ghost - transparent
<Button variant="ghost">Cancel</Button>
```

#### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

#### Loading State
```tsx
<Button loading={isLoading}>
  Submit
</Button>
// Shows spinner and "Loading..." text
```

#### With Icon
```tsx
<Button icon="⚡" variant="primary">
  Generate Code
</Button>
```

#### Full Width
```tsx
<Button fullWidth variant="primary">
  Continue
</Button>
```

#### Complete Example
```tsx
<Button
  variant="primary"
  size="lg"
  loading={loading}
  disabled={!isValid}
  fullWidth
  icon="✨"
  onClick={handleSubmit}
>
  Generate Specification
</Button>
```

#### Props
- `children` (ReactNode) - Button text
- `variant?` ("primary" | "secondary" | "success" | "warning" | "danger" | "ghost")
- `size?` ("sm" | "md" | "lg")
- `loading?` (boolean) - Show loading spinner
- `icon?` (ReactNode) - Icon element
- `fullWidth?` (boolean) - Take full width
- `disabled?` (boolean) - Disable button
- `className?` (string) - Additional classes
- All standard button HTML attributes

#### Styling
```css
Primary: bg-gradient-to-r from-blue-600 to-indigo-600
Secondary: border-2 border-gray-300 bg-white
Sizes: sm (px-3 py-1.5), md (px-5 py-2.5), lg (px-6 py-3)
Hover: hover:shadow-lg active:scale-95
```

---

### 3. Container & Grid

Responsive layout components.

#### Container
```tsx
import { Container } from '../components/ui';

// Extra large (default) - max-w-7xl
<Container>Content</Container>

// Large - max-w-6xl
<Container size="lg">Content</Container>

// Medium - max-w-5xl
<Container size="md">Content</Container>

// Small - max-w-3xl
<Container size="sm">Content</Container>

// Full width
<Container size="full">Content</Container>
```

#### Grid
```tsx
import { Grid } from '../components/ui';

// 3 columns (responsive)
<Grid cols={3}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// 4 columns with 8 gap
<Grid cols={4} gap={8}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>
```

#### Props

**Container:**
- `children` (ReactNode) - Content
- `className?` (string) - Additional classes
- `size?` ("sm" | "md" | "lg" | "xl" | "full")

**Grid:**
- `children` (ReactNode) - Grid items
- `cols?` (1 | 2 | 3 | 4 | 6 | 12) - Column count
- `gap?` (2 | 4 | 6 | 8) - Gap size
- `className?` (string) - Additional classes

#### Responsive Behavior
```css
cols=1: grid-cols-1
cols=2: grid-cols-1 md:grid-cols-2
cols=3: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
cols=4: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

---

### 4. Loading Spinners

Multiple loading spinner components for different use cases.

#### LoadingSpinner (Full Component)
```tsx
import { LoadingSpinner } from '../components/ui';

// Medium size with text
<LoadingSpinner size="md" text="Loading specification..." />

// Large size
<LoadingSpinner size="lg" text="Generating code..." />

// Full screen overlay
<LoadingSpinner
  size="xl"
  text="Processing..."
  fullScreen
/>
```

#### InlineSpinner
```tsx
import { InlineSpinner } from '../components/ui';

// Small inline spinner
<div className="flex items-center space-x-2">
  <InlineSpinner size="sm" />
  <span>Loading...</span>
</div>
```

#### Spinner (for Button)
```tsx
import { Spinner } from '../components/ui';

// Used internally by Button component
<Spinner size="md" />
```

#### Props

**LoadingSpinner:**
- `size?` ("sm" | "md" | "lg" | "xl")
- `text?` (string) - Loading text
- `fullScreen?` (boolean) - Show as overlay

**InlineSpinner:**
- `size?` ("sm" | "md" | "lg")
- `className?` (string) - Additional classes

**Spinner:**
- `size?` ("sm" | "md" | "lg")
- `className?` (string) - Additional classes

---

## 🎯 Usage Examples

### Example 1: Simple Page Layout
```tsx
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
} from '../components/ui';

function MyPage() {
  return (
    <Container size="lg" className="py-8">
      <Card>
        <CardHeader
          title="Page Title"
          subtitle="Page description"
          icon="🎯"
        />
        <CardContent>
          <p>Page content here</p>
        </CardContent>
      </Card>
    </Container>
  );
}
```

### Example 2: Dashboard Grid
```tsx
import { Container, Grid, Card } from '../components/ui';

function Dashboard() {
  return (
    <Container size="xl" className="py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Grid cols={3} gap={6}>
        <Card hover>
          <h3 className="text-lg font-bold">Metric 1</h3>
          <p className="text-3xl font-bold text-blue-600">123</p>
        </Card>
        
        <Card hover>
          <h3 className="text-lg font-bold">Metric 2</h3>
          <p className="text-3xl font-bold text-green-600">456</p>
        </Card>
        
        <Card hover>
          <h3 className="text-lg font-bold">Metric 3</h3>
          <p className="text-3xl font-bold text-purple-600">789</p>
        </Card>
      </Grid>
    </Container>
  );
}
```

### Example 3: Form with Loading
```tsx
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  LoadingSpinner,
} from '../components/ui';

function FormPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading form..." />;
  }

  return (
    <Container size="md" className="py-8">
      <Card>
        <CardHeader title="Create New Item" icon="➕" />
        <CardContent>
          <form className="space-y-4">
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
              placeholder="Name"
            />
            
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
```

### Example 4: Action Buttons
```tsx
function ActionBar() {
  return (
    <div className="flex gap-3">
      <Button variant="primary" icon="📝">
        Edit
      </Button>
      <Button variant="success" icon="📥">
        Export
      </Button>
      <Button variant="warning" icon="🔄">
        Refresh
      </Button>
      <Button variant="danger" icon="🗑️">
        Delete
      </Button>
      <Button variant="ghost">
        Cancel
      </Button>
    </div>
  );
}
```

---

## 🎨 Tailwind Classes Reference

### Common Patterns

**Rounded Corners:**
```css
rounded-lg      /* 8px */
rounded-xl      /* 12px */
rounded-2xl     /* 16px */
```

**Shadows:**
```css
shadow-sm       /* Subtle */
shadow-md       /* Medium (default) */
shadow-lg       /* Large */
shadow-xl       /* Extra large */
```

**Spacing:**
```css
p-6            /* Padding 24px */
py-8           /* Padding Y 32px */
space-x-3      /* Horizontal gap 12px */
space-y-6      /* Vertical gap 24px */
gap-6          /* Grid gap 24px */
```

**Typography:**
```css
text-sm        /* 14px */
text-base      /* 16px */
text-lg        /* 18px */
text-xl        /* 20px */
text-3xl       /* 30px */
font-semibold  /* 600 */
font-bold      /* 700 */
```

**Colors:**
```css
text-gray-600      /* Text */
text-gray-900      /* Headings */
bg-blue-600        /* Backgrounds */
border-gray-300    /* Borders */
```

**Interactive States:**
```css
hover:shadow-xl           /* Hover shadow */
hover:scale-[1.02]        /* Hover scale */
active:scale-95           /* Click scale */
focus:ring-2              /* Focus ring */
focus:ring-blue-500       /* Focus color */
transition-all            /* Smooth transitions */
duration-200              /* 200ms duration */
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Usage:**
```tsx
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  /* 1 col mobile, 2 cols tablet, 3 cols desktop */
</div>
```

---

## ✅ Best Practices

### 1. Use Semantic Components
```tsx
// ✅ Good
<Card>
  <CardHeader title="..." />
  <CardContent>...</CardContent>
</Card>

// ❌ Avoid
<div className="rounded-2xl shadow-md p-6">...</div>
```

### 2. Consistent Spacing
```tsx
// ✅ Good - consistent gaps
<Container className="py-8">
  <div className="space-y-6">
    <Card />
    <Card />
  </div>
</Container>

// ❌ Avoid - random spacing
<div className="pt-5 pb-7">
  <div className="mb-4">
    <Card />
  </div>
  <div className="mt-3">
    <Card />
  </div>
</div>
```

### 3. Loading States
```tsx
// ✅ Good - clear loading UI
if (loading) {
  return <LoadingSpinner size="lg" text="Loading..." />;
}

// ❌ Avoid - no loading feedback
if (loading) {
  return null;
}
```

### 4. Button States
```tsx
// ✅ Good - disabled when invalid
<Button
  disabled={!isValid}
  loading={isSubmitting}
>
  Submit
</Button>

// ❌ Avoid - no validation
<Button onClick={handleSubmit}>
  Submit
</Button>
```

### 5. Responsive Layout
```tsx
// ✅ Good - responsive container and grid
<Container size="xl">
  <Grid cols={3} gap={6}>
    ...
  </Grid>
</Container>

// ❌ Avoid - fixed widths
<div style={{ width: '1200px' }}>
  <div style={{ display: 'flex' }}>
    ...
  </div>
</div>
```

---

## 🎨 Color Usage Guide

### Primary Actions
- **Blue/Indigo gradient**: Main CTAs, primary actions
- Use for: Generate, Submit, Create, Continue

### Secondary Actions
- **Gray outline**: Secondary actions, cancel
- Use for: Cancel, Back, View Details

### Success
- **Green**: Positive actions, confirmations
- Use for: Save, Export, Download, Confirm

### Warning
- **Yellow**: Caution, modifications
- Use for: Refine, Edit, Modify

### Danger
- **Red**: Destructive actions
- Use for: Delete, Remove, Clear

### Ghost
- **Transparent**: Tertiary actions
- Use for: Dismiss, Close, Optional actions

---

## 🚀 Quick Start Checklist

- [ ] Import UI components from `../components/ui`
- [ ] Wrap pages in `<Container>`
- [ ] Use `<Card>` for content sections
- [ ] Use `<Button>` with appropriate variants
- [ ] Add `<LoadingSpinner>` for loading states
- [ ] Use `<Grid>` for responsive layouts
- [ ] Apply consistent spacing (py-8, gap-6, space-y-6)
- [ ] Test on mobile, tablet, desktop
- [ ] Verify hover states and transitions
- [ ] Check accessibility (keyboard navigation)

---

**The UI system provides consistent, beautiful, and responsive components out of the box! 🎨✨**

