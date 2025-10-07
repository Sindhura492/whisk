# localStorage Persistence Guide

Complete documentation for specification persistence and restoration features.

## 🎯 Overview

The application now includes localStorage persistence to save and restore your last specification across browser sessions. This ensures you never lose your work and can easily continue where you left off.

## 🔑 Storage Key

```typescript
const STORAGE_KEY = "erp_ai_last_spec_id";
```

**Stored Value:** UUID of the most recently accessed/generated specification

## 📋 Features Implemented

### ✅ 1. Auto-Save on Generation (IdeaPage)

When a new specification is generated, its ID is automatically saved to localStorage.

**Flow:**
```
User enters idea
    ↓
Clicks "Generate Spec"
    ↓
API generates specification
    ↓
Spec ID saved to localStorage ✓
    ↓
Navigate to SpecPage
```

**Implementation:**
```typescript
const spec = await apiClient.generateSpec(requestData);

// Save spec ID to localStorage for persistence
localStorage.setItem(STORAGE_KEY, spec.id);

// Navigate to the spec page
navigate(`/spec/${spec.id}`);
```

### ✅ 2. Auto-Save on Refinement (SpecPage)

When a specification is refined, the updated spec ID is saved to localStorage.

**Flow:**
```
User refines specification
    ↓
API returns updated spec
    ↓
Spec ID updated in localStorage ✓
    ↓
UI updates with new spec
```

**Implementation:**
```typescript
const updated = await apiClient.refineSpec(id, requestData);
setSpec(updated);

// Update localStorage with latest spec
localStorage.setItem(STORAGE_KEY, updated.id);
```

### ✅ 3. Auto-Restore on Load (SpecPage)

When SpecPage loads without an ID in the URL, it checks localStorage and redirects to the saved spec.

**Flow:**
```
User visits /spec
    ↓
No ID in URL
    ↓
Check localStorage for saved ID
    ↓
If found: Redirect to /spec/:id
    ↓
Load specification
```

**Implementation:**
```typescript
const loadSpec = async () => {
  // Try to get ID from URL params first, then localStorage
  let specId = id;
  
  if (!specId) {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      specId = storedId;
      // Redirect to the proper URL with the ID
      navigate(`/spec/${storedId}`, { replace: true });
      return;
    }
  }
  
  // Continue loading...
};
```

### ✅ 4. Restore Banner (IdeaPage)

Shows a banner on the home page when a saved specification exists, allowing quick restoration.

**UI:**
```
┌────────────────────────────────────────────┐
│ 📋 Continue where you left off            │
│    You have a saved specification...      │
│                  [Restore Last Spec →]    │
└────────────────────────────────────────────┘
```

**Implementation:**
```typescript
useEffect(() => {
  const lastSpecId = localStorage.getItem(STORAGE_KEY);
  setHasLastSpec(!!lastSpecId);
}, []);

const handleRestoreLastSpec = () => {
  const lastSpecId = localStorage.getItem(STORAGE_KEY);
  if (lastSpecId) {
    navigate(`/spec/${lastSpecId}`);
  }
};
```

### ✅ 5. Enhanced Export JSON (SpecPage)

Export now includes comprehensive metadata and smart filename generation.

**Export Structure:**
```json
{
  "id": "uuid-here",
  "idea": "Original business idea",
  "specification": {
    "title": "App Title",
    "description": "...",
    "modules": [...],
    "kpis": [...]
  },
  "metadata": {
    "created_at": "2025-01-07T10:30:00Z",
    "updated_at": "2025-01-07T11:45:00Z",
    "exported_at": "2025-01-07T12:00:00Z",
    "version": "1.0.0"
  }
}
```

**Filename Format:**
```
{safe_title}_{date}.json

Examples:
- inventory_management_system_2025-01-07.json
- ecommerce_platform_2025-01-07.json
- crm_application_2025-01-07.json
```

**Implementation:**
```typescript
const handleExportJSON = () => {
  const exportData = {
    id: spec.id,
    idea: spec.idea,
    specification: spec.spec_json,
    metadata: {
      created_at: spec.created_at,
      updated_at: spec.updated_at,
      exported_at: new Date().toISOString(),
      version: "1.0.0",
    },
  };

  const timestamp = new Date().toISOString().split("T")[0];
  const safeName = spec.spec_json.title
    ?.replace(/[^a-z0-9]/gi, "_")
    .toLowerCase() || "spec";
  link.download = `${safeName}_${timestamp}.json`;
  
  // Show success feedback
  setExportSuccess(true);
  setTimeout(() => setExportSuccess(false), 3000);
};
```

### ✅ 6. Clear History (SpecPage)

Allows users to clear the saved specification from localStorage.

**Button Location:** In JSON viewer section (subtle button)

**Implementation:**
```typescript
const handleClearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
  navigate("/");
};
```

### ✅ 7. Error Handling

Automatically clears invalid IDs from localStorage if specification not found (404).

**Implementation:**
```typescript
} catch (err: any) {
  setError(err.response?.data?.error || "Failed to load specification");
  
  // Clear invalid ID from localStorage
  if (err.response?.status === 404) {
    localStorage.removeItem(STORAGE_KEY);
  }
}
```

## 🎨 Enhanced SpecPage UI

### New Features

**1. Export Success Banner**
- Shows green success banner for 3 seconds after export
- Animated fade-in effect
- Dismisses automatically

**2. Spec Overview Cards**
- Displays module count, entity count, KPI count
- Color-coded cards (blue, green, purple)
- Quick at-a-glance metrics

**3. Enhanced Header**
- Spec ID (shortened) and last updated timestamp
- Clean, organized layout

**4. Action Buttons**
- ✏️ Refine (Yellow)
- 📥 Export JSON (Green)
- 🎨 Preview UI (Purple)
- 💻 Generate Code (Blue)

**5. Info Card**
- "What's Next?" section with helpful tips
- Located at bottom of page
- Guides users on available actions

## 📊 User Flows

### Flow 1: First-Time User

```
1. Visit / (IdeaPage)
2. Enter app idea
3. Click "Generate Spec"
   → Spec ID saved to localStorage
4. Redirected to /spec/:id
   → Spec loaded and displayed
5. Close browser

Next session:
6. Visit / (IdeaPage)
   → "Restore Last Spec" banner shown
7. Click "Restore Last Spec"
   → Redirected to /spec/:id
   → Last spec restored
```

### Flow 2: Refining Specification

```
1. On /spec/:id
2. Click "Refine"
3. Enter refinement instructions
4. Click "Apply Refinement"
   → API updates spec
   → localStorage updated with new ID
   → UI updates with refined spec
5. Export JSON for backup
   → File downloaded with metadata
   → Success banner shown
```

### Flow 3: Export and Share

```
1. On /spec/:id
2. Click "Export JSON"
   → Comprehensive JSON exported
   → Filename: inventory_system_2025-01-07.json
   → Success banner displayed
3. Share file with team
4. Team member can import to their instance
```

### Flow 4: Clearing History

```
1. On /spec/:id
2. Want to start fresh
3. Click "🗑️ Clear History"
   → localStorage cleared
   → Redirected to home page
4. No restore banner shown
5. Can generate new spec
```

## 🔧 Technical Details

### Storage Size

localStorage has a limit of ~5-10MB per domain. Storing only UUIDs (36 characters) is extremely efficient:

```
UUID size: 36 bytes
Storage used: <1KB
Remaining: >5MB
```

### Browser Compatibility

localStorage is supported in all modern browsers:
- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge (all versions)
- ✅ Opera 10.5+

### Privacy & Security

**What's stored:**
- ✅ Specification UUID only
- ✅ No sensitive data
- ✅ No API keys
- ✅ No personal information

**Data lifetime:**
- Persists until explicitly cleared
- Survives browser restarts
- Removed on browser cache clear
- Not shared across domains

### Error Recovery

**Scenario 1: Spec deleted from backend**
```
User tries to restore
   ↓
API returns 404
   ↓
localStorage cleared automatically
   ↓
Error message shown
   ↓
Redirect options provided
```

**Scenario 2: Corrupted localStorage**
```
localStorage read fails
   ↓
Catch error silently
   ↓
Continue without restore
   ↓
No banner shown
```

**Scenario 3: Invalid UUID**
```
UUID format validation
   ↓
If invalid: Clear and continue
   ↓
If valid: Attempt API call
   ↓
Handle response accordingly
```

## 💡 Best Practices

### For Users

1. **Regular Exports**: Export important specs to JSON for backup
2. **Refinement History**: Each refinement creates a new version
3. **Browser Sync**: Use same browser to maintain history
4. **Clear Cache**: Use "Clear History" button, not browser settings

### For Developers

1. **Always validate IDs** before API calls
2. **Handle 404 gracefully** and clear localStorage
3. **Provide fallback options** when restoration fails
4. **Show clear feedback** for all persistence actions
5. **Use replace: true** for navigation to avoid back button issues

## 🚀 Future Enhancements

- [ ] Multiple spec history (not just last one)
- [ ] Spec versioning with rollback
- [ ] Cloud sync across devices
- [ ] Import JSON to restore specs
- [ ] Auto-save drafts while typing
- [ ] Conflict resolution for concurrent edits
- [ ] Export to other formats (PDF, Markdown)
- [ ] Share specs via URL with tokens

## 🎯 Code Locations

```
frontend/src/pages/
├── IdeaPage.tsx
│   ├── Save ID on generation
│   ├── Check for saved ID on load
│   └── Restore banner UI
│
└── SpecPage.tsx
    ├── Load from localStorage if no URL param
    ├── Save ID on refinement
    ├── Enhanced export with metadata
    ├── Clear history button
    └── Export success feedback
```

## ✅ Testing Checklist

- [x] Generate spec → ID saved to localStorage
- [x] Refine spec → ID updated in localStorage
- [x] Close & reopen browser → Restore banner appears
- [x] Click restore → Redirected to last spec
- [x] Export JSON → File downloaded with metadata
- [x] Export JSON → Success banner shown
- [x] Clear history → localStorage cleared
- [x] Visit /spec without ID → Redirects to saved spec
- [x] Delete spec on backend → localStorage cleared on 404
- [x] Generate new spec → Replaces saved ID

---

**localStorage persistence ensures your specifications are never lost and easily accessible! 💾✨**

