# UI System Showcase

Visual examples and code snippets for all UI components.

## 📦 Component Library

### File Structure
```
frontend/src/components/ui/
├── Card.tsx              # Card, CardHeader, CardContent, CardFooter
├── Button.tsx            # Button, Spinner
├── Container.tsx         # Container, Grid
├── LoadingSpinner.tsx    # LoadingSpinner, InlineSpinner
└── index.ts              # Central export
```

---

## 🎴 Card Components

### Basic Card
```tsx
<Card>
  <p>Simple card with default styling</p>
</Card>
```
**Visual:**
```
┌──────────────────────────────┐
│                              │
│  Simple card with default    │
│  styling                     │
│                              │
└──────────────────────────────┘
```

### Card with Header
```tsx
<Card>
  <CardHeader
    title="Technical Specification"
    subtitle="AI-generated blueprint"
    icon="📋"
  />
  <CardContent>
    <p>Your specification details here...</p>
  </CardContent>
</Card>
```
**Visual:**
```
┌──────────────────────────────┐
│ 📋 Technical Specification   │
│    AI-generated blueprint    │
├──────────────────────────────┤
│                              │
│ Your specification details   │
│ here...                      │
│                              │
└──────────────────────────────┘
```

### Card with Header Action
```tsx
<Card>
  <CardHeader
    title="Specifications"
    subtitle="10 items"
    icon="📋"
    action={
      <Button variant="primary" size="sm">
        New
      </Button>
    }
  />
  <CardContent>
    <p>List of specifications...</p>
  </CardContent>
</Card>
```
**Visual:**
```
┌──────────────────────────────┐
│ 📋 Specifications    [New]   │
│    10 items                  │
├──────────────────────────────┤
│                              │
│ List of specifications...    │
│                              │
└──────────────────────────────┘
```

### Card with Footer
```tsx
<Card>
  <CardHeader title="Module Details" icon="🔧" />
  <CardContent>
    <p>Module configuration...</p>
  </CardContent>
  <CardFooter>
    <div className="flex gap-3">
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  </CardFooter>
</Card>
```
**Visual:**
```
┌──────────────────────────────┐
│ 🔧 Module Details            │
├──────────────────────────────┤
│                              │
│ Module configuration...      │
│                              │
├──────────────────────────────┤
│           [Save] [Cancel]    │
└──────────────────────────────┘
```

### Hoverable Card
```tsx
<Card hover>
  <div className="text-center">
    <h3 className="text-2xl font-bold text-blue-600">123</h3>
    <p className="text-gray-600">Total Modules</p>
  </div>
</Card>
```
**Effect:** Scales to 102% and shows larger shadow on hover

### Gradient Card
```tsx
<Card variant="gradient">
  <div className="flex items-center space-x-3">
    <span className="text-2xl">💡</span>
    <p className="text-blue-900">
      <strong>Tip:</strong> Be specific about requirements
    </p>
  </div>
</Card>
```
**Visual:** Subtle gradient from white to gray-50

---

## 🔘 Button Components

### All Variants
```tsx
<div className="space-y-3">
  <Button variant="primary">Primary Button</Button>
  <Button variant="secondary">Secondary Button</Button>
  <Button variant="success">Success Button</Button>
  <Button variant="warning">Warning Button</Button>
  <Button variant="danger">Danger Button</Button>
  <Button variant="ghost">Ghost Button</Button>
</div>
```
**Visual:**
```
[  Primary Button  ]  ← Blue gradient, white text
[  Secondary Button]  ← Gray outline, gray text
[  Success Button  ]  ← Green solid, white text
[  Warning Button  ]  ← Yellow solid, white text
[  Danger Button   ]  ← Red solid, white text
   Ghost Button       ← Transparent, gray text
```

### All Sizes
```tsx
<div className="flex items-center gap-3">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
```
**Visual:**
```
[Small]  [Medium]  [  Large  ]
```

### With Icons
```tsx
<div className="space-y-3">
  <Button variant="primary" icon="⚡">
    Generate
  </Button>
  <Button variant="success" icon="📥">
    Export
  </Button>
  <Button variant="warning" icon="✏️">
    Edit
  </Button>
  <Button variant="danger" icon="🗑️">
    Delete
  </Button>
</div>
```
**Visual:**
```
[ ⚡ Generate ]
[ 📥 Export   ]
[ ✏️ Edit     ]
[ 🗑️ Delete   ]
```

### Loading State
```tsx
<Button variant="primary" loading={true}>
  Submit
</Button>
```
**Visual:**
```
[ ◌ Loading... ]  ← Spinner animates
```

### Full Width
```tsx
<Button variant="primary" size="lg" fullWidth icon="✨">
  Generate Specification
</Button>
```
**Visual:**
```
╔══════════════════════════════════╗
║  ✨ Generate Specification       ║
╚══════════════════════════════════╝
```

---

## 📐 Layout Components

### Container Sizes
```tsx
// Small - max-w-3xl (768px)
<Container size="sm">
  <Card>Narrow content</Card>
</Container>

// Medium - max-w-5xl (1024px)
<Container size="md">
  <Card>Medium content</Card>
</Container>

// Large - max-w-6xl (1152px)
<Container size="lg">
  <Card>Large content</Card>
</Container>

// Extra Large - max-w-7xl (1280px) [default]
<Container size="xl">
  <Card>Extra large content</Card>
</Container>

// Full - max-w-full
<Container size="full">
  <Card>Full width content</Card>
</Container>
```

### Grid Layouts

**3 Column Grid:**
```tsx
<Grid cols={3} gap={6}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```
**Visual (Desktop):**
```
┌────────┐ ┌────────┐ ┌────────┐
│ Item 1 │ │ Item 2 │ │ Item 3 │
└────────┘ └────────┘ └────────┘
```
**Visual (Mobile):**
```
┌────────┐
│ Item 1 │
└────────┘
┌────────┐
│ Item 2 │
└────────┘
┌────────┐
│ Item 3 │
└────────┘
```

**Dashboard Grid:**
```tsx
<Grid cols={4} gap={6}>
  <Card hover>
    <h3>Modules</h3>
    <p className="text-3xl font-bold">12</p>
  </Card>
  <Card hover>
    <h3>Entities</h3>
    <p className="text-3xl font-bold">45</p>
  </Card>
  <Card hover>
    <h3>APIs</h3>
    <p className="text-3xl font-bold">78</p>
  </Card>
  <Card hover>
    <h3>KPIs</h3>
    <p className="text-3xl font-bold">15</p>
  </Card>
</Grid>
```
**Visual (Desktop):**
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│Modules│Entities│APIs  │KPIs  │
│  12  │  45   │  78  │  15  │
└─────┘ └─────┘ └─────┘ └─────┘
```

---

## ⏳ Loading Components

### LoadingSpinner (Centered)
```tsx
<LoadingSpinner size="md" text="Loading specification..." />
```
**Visual:**
```
        ◌
  Loading specification...
```

### LoadingSpinner (Full Screen)
```tsx
<LoadingSpinner
  size="xl"
  text="Processing..."
  fullScreen
/>
```
**Visual:** Covers entire screen with semi-transparent overlay

### InlineSpinner
```tsx
<div className="flex items-center space-x-2">
  <InlineSpinner size="sm" />
  <span>Saving...</span>
</div>
```
**Visual:**
```
◌ Saving...
```

### Button with Loading
```tsx
<Button variant="primary" loading={true}>
  Generate
</Button>
```
**Visual:**
```
[ ◌ Loading... ]
```

---

## 🎨 Complete Page Examples

### Example 1: Simple Form Page
```tsx
function CreatePage() {
  const [loading, setLoading] = useState(false);

  return (
    <Container size="md" className="py-8">
      <Card>
        <CardHeader
          title="Create Specification"
          subtitle="Generate from your idea"
          icon="✨"
        />
        <CardContent>
          <div className="space-y-4">
            <textarea
              rows={10}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
              placeholder="Enter your app idea..."
            />
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon="⚡"
            >
              Generate Specification
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
```

### Example 2: Dashboard with Metrics
```tsx
function Dashboard() {
  return (
    <Container size="xl" className="py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Metrics Grid */}
      <Grid cols={4} gap={6} className="mb-8">
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-gray-600 mt-2">Total Specs</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">45</p>
            <p className="text-gray-600 mt-2">Modules</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">123</p>
            <p className="text-gray-600 mt-2">Entities</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">89</p>
            <p className="text-gray-600 mt-2">APIs</p>
          </div>
        </Card>
      </Grid>
      
      {/* Content Card */}
      <Card>
        <CardHeader title="Recent Activity" icon="📊" />
        <CardContent>
          <p>Activity list...</p>
        </CardContent>
      </Card>
    </Container>
  );
}
```

### Example 3: Details Page with Actions
```tsx
function DetailsPage() {
  return (
    <Container size="lg" className="py-8">
      <Card>
        <CardHeader
          title="Specification Details"
          subtitle="ID: 123e4567"
          icon="📋"
          action={
            <div className="flex gap-2">
              <Button variant="warning" size="sm" icon="✏️">
                Edit
              </Button>
              <Button variant="success" size="sm" icon="📥">
                Export
              </Button>
            </div>
          }
        />
        <CardContent>
          {/* Overview Cards */}
          <Grid cols={3} gap={4} className="mb-6">
            <Card variant="bordered">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-600">Modules</p>
            </Card>
            <Card variant="bordered">
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-gray-600">Entities</p>
            </Card>
            <Card variant="bordered">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-600">KPIs</p>
            </Card>
          </Grid>
          
          {/* Content */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Title</h4>
              <p className="text-gray-700">Inventory Management System</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700">A comprehensive solution...</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3">
            <Button variant="primary" icon="🎨">
              Preview UI
            </Button>
            <Button variant="primary" icon="💻">
              Generate Code
            </Button>
            <Button variant="ghost">
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
}
```

---

## 🎯 Common Patterns

### Alert/Banner
```tsx
<Card variant="gradient" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
  <div className="flex items-center space-x-3">
    <span className="text-2xl">ℹ️</span>
    <div>
      <p className="font-semibold text-blue-900">Information</p>
      <p className="text-sm text-blue-800">Your specification has been saved.</p>
    </div>
  </div>
</Card>
```

### Success Message
```tsx
<Card variant="bordered" className="border-green-200 bg-green-50">
  <div className="flex items-center space-x-2 text-green-800">
    <span className="text-xl">✓</span>
    <p className="font-medium">Operation completed successfully!</p>
  </div>
</Card>
```

### Error Message
```tsx
<Card variant="bordered" className="border-red-200 bg-red-50">
  <div className="flex items-center space-x-2 text-red-800">
    <span className="text-xl">⚠️</span>
    <p className="font-medium">An error occurred. Please try again.</p>
  </div>
</Card>
```

### Action Bar
```tsx
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Specifications</h2>
  <div className="flex gap-2">
    <Button variant="secondary" icon="🔄">
      Refresh
    </Button>
    <Button variant="primary" icon="➕">
      Create New
    </Button>
  </div>
</div>
```

### Stat Card
```tsx
<Card hover>
  <div className="text-center">
    <div className="text-4xl mb-2">📊</div>
    <div className="text-3xl font-bold text-blue-600 mb-2">123</div>
    <div className="text-sm text-gray-600">Total Modules</div>
    <div className="text-xs text-green-600 mt-2">↑ 12% this month</div>
  </div>
</Card>
```

---

## ✨ Animation Classes

```css
/* Fade in */
animate-fade-in

/* Spin (for spinners) */
animate-spin

/* Scale on hover */
hover:scale-[1.02]

/* Scale on click */
active:scale-95

/* Smooth transitions */
transition-all duration-200
transition-all duration-300

/* Shadow transitions */
hover:shadow-xl
hover:shadow-lg
```

---

## 📱 Responsive Examples

### Mobile-First Grid
```tsx
<Grid cols={1} gap={4} className="md:grid-cols-2 lg:grid-cols-3">
  <Card>Mobile: 1 col</Card>
  <Card>Tablet: 2 cols</Card>
  <Card>Desktop: 3 cols</Card>
</Grid>
```

### Responsive Button Group
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button fullWidth variant="primary">Primary</Button>
  <Button fullWidth variant="secondary">Secondary</Button>
</div>
```

### Responsive Padding
```tsx
<Container className="py-4 sm:py-6 lg:py-8">
  <Card>Content</Card>
</Container>
```

---

**The UI system provides everything you need for a clean, modern dashboard! 🎨✨**

