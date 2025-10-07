# Complete Testing Guide

Step-by-step instructions to test every feature of the ERP AI system.

## 🚀 Pre-Testing Setup

### 1. Start the Backend Server

```bash
cd /Users/sindhuras/Desktop/ERP/ERP_AI/backend

# Activate virtual environment
source venv/bin/activate

# Start Django server
make dev
# OR: python manage.py runserver 8000
```

**Expected Output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

**✅ Verify:** Backend is running at `http://localhost:8000`

---

### 2. Start the Frontend Server

Open a **new terminal** window:

```bash
cd /Users/sindhuras/Desktop/ERP/ERP_AI/frontend

# Start Vite dev server
npm run dev
```

**Expected Output:**
```
VITE v4.5.0  ready in 179 ms
➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**✅ Verify:** Frontend is running at `http://localhost:3000`

---

### 3. Check Environment Variables

**Backend (.env):**
```bash
cd backend
cat .env
```

**Should contain:**
- `OPENAI_API_KEY=sk-your-key-here`
- `DATABASE_URL=your-railway-url` (or SQLite settings)

**Frontend (.env):**
```bash
cd frontend
cat .env
```

**Should contain:**
- `VITE_API_URL=http://localhost:8000/api`

---

## 📋 Feature Testing Checklist

### ✅ Test 1: Navigation & UI Components

#### Step 1: Open the Application
1. Open browser: `http://localhost:3000`
2. **Expected:** IdeaPage loads with "Generate Technical Specification"

#### Step 2: Check Navigation
1. Click on "Specifications" in the top nav
2. **Expected:** Navigate to `/specs` (SpecsListPage)
3. Click on "Generate Spec" in the top nav
4. **Expected:** Navigate back to `/` (IdeaPage)

#### Step 3: Verify UI Components
**Check these elements exist:**
- [ ] Top navigation bar with logo "ERP AI"
- [ ] Navigation links: "Generate Spec" and "Specifications"
- [ ] Clean, modern Tailwind styling
- [ ] Responsive layout (try resizing window)

**✅ Pass Criteria:**
- Navigation works smoothly
- UI is clean and professional
- No console errors in browser DevTools (F12)

---

### ✅ Test 2: Generate Specification (Core Feature)

#### Step 1: Enter an Idea
1. Go to home page: `http://localhost:3000`
2. In the textarea, enter:
   ```
   Build an inventory management system for retail stores with:
   - Product tracking with SKU, name, price, quantity
   - Stock alerts when quantity is low
   - Sales reporting and analytics
   - Supplier management
   ```

#### Step 2: Generate Specification
1. Click the **"Generate Spec"** button
2. **Expected:** 
   - Button shows loading spinner
   - Text changes to "Generating Specification..."
   - Button is disabled during generation

#### Step 3: Wait for AI Response
**Expected (10-30 seconds):**
- Loading spinner continues
- No errors in console
- Redirects to `/spec/:id` when complete

#### Step 4: Verify Generated Spec
**On SpecPage, verify:**
- [ ] Page title: "📋 Technical Specification"
- [ ] Original idea displayed in gradient box
- [ ] Three metric cards showing:
  - Number of Modules
  - Number of Entities
  - Number of KPIs
- [ ] JSON specification displayed at bottom
- [ ] Action buttons visible:
  - ✏️ Refine
  - 📥 Export JSON
  - 🎨 Preview UI
  - 💻 Generate Code

#### Step 5: Inspect the JSON
1. Scroll down to "Specification JSON"
2. **Expected structure:**
   ```json
   {
     "title": "...",
     "description": "...",
     "modules": [
       {
         "name": "...",
         "purpose": "...",
         "entities": [...],
         "apis": [...],
         "ui": [...]
       }
     ],
     "kpis": [...]
   }
   ```

**✅ Pass Criteria:**
- Specification generated successfully
- JSON contains modules with entities, APIs, and UI
- No errors in browser console
- Page displays all information correctly

**❌ If Failed:**
- Check OpenAI API key is valid
- Check backend logs for errors
- Verify OpenAI account has credits

---

### ✅ Test 3: localStorage Persistence

#### Step 1: Verify Auto-Save
1. After generating a spec (from Test 2)
2. Open browser DevTools → Application → Local Storage → `http://localhost:3000`
3. **Expected:** Key `erp_ai_last_spec_id` with UUID value

#### Step 2: Test Browser Restart Simulation
1. Copy the spec ID from the URL (the UUID part)
2. Navigate to home page: `http://localhost:3000`
3. **Expected:** Blue banner appears:
   ```
   📋 Continue where you left off
   You have a saved specification from your last session
   [Restore Last Spec →]
   ```

#### Step 3: Test Restore Functionality
1. Click **"Restore Last Spec →"** button
2. **Expected:** 
   - Navigate to `/spec/{saved-id}`
   - Spec loads from backend
   - All data displays correctly

#### Step 4: Test Auto-Restore Without ID
1. Navigate to: `http://localhost:3000/spec` (no ID in URL)
2. **Expected:**
   - Automatically redirects to `/spec/{saved-id}`
   - Spec loads correctly

#### Step 5: Test Clear History
1. On the SpecPage, scroll to JSON viewer section
2. Click **"🗑️ Clear History"** button (top right)
3. **Expected:**
   - Navigate to home page
   - localStorage cleared
   - No restore banner on next visit

**✅ Pass Criteria:**
- Spec ID saved automatically
- Restore banner appears correctly
- Restore functionality works
- Clear history removes saved ID

---

### ✅ Test 4: Export JSON

#### Step 1: Navigate to a Spec
1. Go to any specification page (use restore or generate new)

#### Step 2: Export the Specification
1. Click **"📥 Export JSON"** button
2. **Expected:**
   - File download triggers
   - Green success banner appears: "✓ Specification exported successfully!"
   - Banner auto-dismisses after 3 seconds

#### Step 3: Verify Downloaded File
1. Open the downloaded file (e.g., `inventory_management_2025-01-07.json`)
2. **Expected structure:**
   ```json
   {
     "id": "uuid",
     "idea": "original idea",
     "specification": {
       "title": "...",
       "description": "...",
       "modules": [...],
       "kpis": [...]
     },
     "metadata": {
       "created_at": "timestamp",
       "updated_at": "timestamp",
       "exported_at": "timestamp",
       "version": "1.0.0"
     }
   }
   ```

#### Step 4: Verify Filename
**Expected format:** `{title_snake_case}_{date}.json`
- Example: `inventory_management_system_2025-01-07.json`
- Special characters converted to underscores
- Date in ISO format

**✅ Pass Criteria:**
- File downloads successfully
- Success banner displays
- File contains all data with metadata
- Filename is properly formatted

---

### ✅ Test 5: Refine Specification

#### Step 1: Open Refine Panel
1. On a SpecPage, click **"✏️ Refine"** button
2. **Expected:**
   - Yellow refine panel expands below
   - Textarea appears
   - "Apply Refinement" and "Cancel" buttons visible

#### Step 2: Enter Refinement Instructions
1. In the textarea, enter:
   ```
   Add a user authentication module with:
   - User registration and login
   - Role-based access control (Admin, Manager, Staff)
   - Password reset functionality
   - JWT token authentication
   ```

#### Step 3: Apply Refinement
1. Click **"Apply Refinement"** button
2. **Expected:**
   - Button shows loading spinner: "Refining..."
   - API call to `/api/specs/refine/:id/`
   - Wait 10-30 seconds

#### Step 4: Verify Updated Spec
**Expected:**
- Refine panel closes
- Spec JSON updates with new module
- Metric cards update (module count increases)
- "Updated" timestamp refreshes
- localStorage updates with new spec ID

#### Step 5: Check the Changes
1. Scroll to JSON viewer
2. Look for new authentication module in `modules` array
3. **Expected:** New module with:
   - Name: "User Authentication" (or similar)
   - Entities for User, Role, etc.
   - APIs for login, register, etc.

#### Step 6: Test Cancel
1. Click "Refine" again
2. Enter some text
3. Click "Cancel"
4. **Expected:** Panel closes, no changes made

**✅ Pass Criteria:**
- Refine panel opens/closes correctly
- Refinement applies successfully
- Spec updates with AI modifications
- localStorage updates
- Cancel works without changes

---

### ✅ Test 6: Design Preview (UI Components)

#### Step 1: Navigate to Design Preview
1. From a SpecPage, click **"🎨 Preview UI"** button
2. **Expected:** Navigate to `/design-preview/:id`

#### Step 2: View Module Selector
1. **Expected:**
   - Page title: "🎨 Design Preview"
   - Dropdown selector with all modules
   - First module auto-selected

#### Step 3: Verify Module Header
**Expected display:**
- Module name in large heading
- Module purpose description
- Gradient background

#### Step 4: Test Table Components
**For each Table UI component, verify:**
- [ ] Component header with "📊" icon
- [ ] Component name and entity
- [ ] "Table" badge
- [ ] Table with:
  - Column headers from spec
  - 3 sample rows with realistic data
  - Required fields marked with *
  - Edit/Delete action buttons
  - Pagination controls (Previous/Next)
- [ ] Hover effect on rows

#### Step 5: Test Form Components
**For each Form UI component, verify:**
- [ ] Component header with "📝" icon
- [ ] Component name and entity
- [ ] "Form" badge
- [ ] Form fields with:
  - Proper input types (text, email, number, date, checkbox, textarea)
  - Labels with required indicators (*)
  - Unique badges where applicable
  - Help text with 💡 emoji
  - Max length info
  - Cancel and Submit buttons
  - 2-column responsive grid
- [ ] All fields disabled (preview only)

#### Step 6: Test Module Switching
1. Select different modules from dropdown
2. **Expected:**
   - UI updates instantly
   - New module's components display
   - No loading delay

#### Step 7: Test Empty States
1. If a module has no UI components:
2. **Expected:** Message: "No UI components defined for this module"

**✅ Pass Criteria:**
- Tables render with sample data
- Forms render with correct input types
- Module switching works smoothly
- All UI elements styled correctly
- Hover effects work

---

### ✅ Test 7: Code Generation

#### Step 1: Navigate to Code Stubs
1. From a SpecPage, click **"💻 Generate Code"** button
2. **Expected:** Navigate to `/code-stubs/:id`

#### Step 2: View Module Selector
**Expected:**
- Page title: "💻 Generated Code Stubs"
- Dropdown showing all modules with entity count
- First module pre-selected
- Generate button visible

#### Step 3: Generate Code
1. Click **"⚡ Generate Django/DRF Code Stubs"** button
2. **Expected:**
   - Button shows loading: "Generating Django/DRF Code..."
   - Spinner animates
   - Wait 15-45 seconds for OpenAI

#### Step 4: Verify Code Display
**Expected after generation:**
- [ ] Code viewer appears
- [ ] Module name displayed in header
- [ ] Language and framework shown: "DJANGO · PYTHON"
- [ ] Four file tabs on left sidebar:
  - 🗄️ models.py (blue when active)
  - 🔄 serializers.py (green when active)
  - 👁️ views.py (purple when active)
  - 🔗 urls.py (orange when active)
- [ ] First file (models.py) displayed by default
- [ ] Syntax highlighting applied
- [ ] Line numbers visible
- [ ] Code is scrollable

#### Step 5: Test File Switching
1. Click each file tab
2. **Expected:**
   - Tab highlights in its color
   - Code switches instantly
   - Syntax highlighting updates
   - Toolbar shows correct filename

#### Step 6: Verify Generated Code Quality

**models.py should contain:**
```python
- Django imports (from django.db import models)
- UUID imports
- Model classes with:
  - UUIDField for id
  - Proper field types (CharField, DecimalField, etc.)
  - max_length on CharFields
  - unique=True where needed
  - created_at/updated_at timestamps
  - __str__ method
  - Meta class with ordering
```

**serializers.py should contain:**
```python
- DRF imports (from rest_framework import serializers)
- Model imports
- ModelSerializer classes
- Meta classes with fields
- read_only_fields defined
```

**views.py should contain:**
```python
- ViewSet imports (from rest_framework import viewsets)
- Model and serializer imports
- ViewSet classes
- queryset defined
- serializer_class defined
```

**urls.py should contain:**
```python
- Router imports (from rest_framework.routers import DefaultRouter)
- ViewSet imports
- Router instance
- router.register() calls
- urlpatterns with include
```

#### Step 7: Test Copy Functionality
1. Click **"📋 Copy"** button
2. **Expected:**
   - Button changes to green
   - Text changes to "✓ Copied!"
   - Reverts after 2 seconds
3. Paste in a text editor
4. **Expected:** Full file content pasted

#### Step 8: Test Download Individual File
1. Click **"💾 Download"** button
2. **Expected:**
   - File downloads
   - Correct filename (models.py, serializers.py, etc.)
   - Content matches displayed code

#### Step 9: Test Download All Files
1. Click **"📥 Download All Files"** in header
2. **Expected:**
   - All 4 files download
   - Each with correct filename
   - All contain proper code

#### Step 10: Test Generate New
1. Click **"← Generate New"** button
2. **Expected:**
   - Returns to module selection
   - Can select different module
   - Can generate again

**✅ Pass Criteria:**
- Code generates successfully
- All 4 files contain valid Python code
- Syntax highlighting works
- Copy functionality works
- Download functionality works
- Tab switching is smooth
- Code follows Django/DRF best practices

---

### ✅ Test 8: View All Specifications

#### Step 1: Navigate to Specs List
1. Click **"Specifications"** in top nav
2. **Expected:** Navigate to `/specs`

#### Step 2: Verify List Display
**Expected:**
- Page title: "All Specifications"
- "Create New" button in header
- List of specifications (if any exist)

#### Step 3: Check Specification Cards
**For each spec card, verify:**
- [ ] Idea text preview (truncated)
- [ ] Created date
- [ ] Updated date
- [ ] Three action buttons:
  - "View Spec" (blue)
  - "Preview UI" (purple)
  - "Generate Code" (green)
- [ ] Hover effect on card

#### Step 4: Test Empty State
1. If no specs exist (or clear database)
2. **Expected:**
   - 📋 icon
   - "No specifications yet" message
   - "Create Your First Specification" button

#### Step 5: Test Action Buttons
1. Click "View Spec" on any card
2. **Expected:** Navigate to `/spec/:id`
3. Go back, click "Preview UI"
4. **Expected:** Navigate to `/design-preview/:id`
5. Go back, click "Generate Code"
6. **Expected:** Navigate to `/code-stubs/:id`

**✅ Pass Criteria:**
- List displays all specifications
- Cards show correct information
- Action buttons navigate correctly
- Empty state displays when no specs
- Responsive layout works

---

### ✅ Test 9: UI Component System

#### Step 1: Test Card Component
**Look for cards throughout the app:**
- [ ] Rounded corners (rounded-2xl)
- [ ] Shadow effect (shadow-md)
- [ ] Padding (p-6)
- [ ] Hover effects where applicable
- [ ] Different variants (default, gradient, bordered)

#### Step 2: Test Button Component
**Find and test different button variants:**
- [ ] Primary (blue gradient) - Generate, Submit actions
- [ ] Secondary (outline) - Cancel, Back actions
- [ ] Success (green) - Export, Download
- [ ] Warning (yellow) - Refine, Edit
- [ ] Danger (red) - Delete, Clear
- [ ] Different sizes (sm, md, lg)
- [ ] Loading states (spinner + text)
- [ ] Icons display correctly
- [ ] Hover effects (shadow lift)
- [ ] Active effects (scale down on click)

#### Step 3: Test Loading Spinners
**Verify spinners appear during:**
- [ ] Generating specification (IdeaPage)
- [ ] Refining specification (SpecPage)
- [ ] Generating code (CodeStubsPage)
- [ ] Loading pages (initial load)
- [ ] Button loading states

#### Step 4: Test Responsive Layout
**Resize browser window or use DevTools device mode:**
- [ ] Mobile (320px-640px): Single column layouts
- [ ] Tablet (640px-1024px): 2 columns where applicable
- [ ] Desktop (1024px+): Full grid layouts
- [ ] Navigation adapts to screen size
- [ ] Cards stack properly
- [ ] Buttons go full-width on mobile

#### Step 5: Test Container Widths
**Different pages use different container sizes:**
- [ ] IdeaPage: Medium (max-w-5xl)
- [ ] SpecPage: Large (max-w-6xl)
- [ ] SpecsListPage: Large (max-w-6xl)
- [ ] DesignPreviewPage: Extra Large (max-w-7xl)
- [ ] CodeStubsPage: Extra Large (max-w-7xl)

**✅ Pass Criteria:**
- All components styled consistently
- Hover and active states work
- Responsive behavior is smooth
- Loading states are clear
- No style glitches or broken layouts

---

### ✅ Test 10: Error Handling

#### Step 1: Test Invalid Input
1. On IdeaPage, leave textarea empty
2. Click "Generate Spec"
3. **Expected:**
   - Error message: "Please enter an idea"
   - Button remains disabled

#### Step 2: Test Network Errors (Backend Off)
1. Stop the backend server (Ctrl+C)
2. Try to generate a spec
3. **Expected:**
   - Error message appears
   - User-friendly error display
   - No app crash

#### Step 3: Test API Errors (Invalid Key)
1. Set invalid OpenAI API key in backend .env
2. Restart backend
3. Try to generate spec
4. **Expected:**
   - Error message from backend
   - Graceful error display

#### Step 4: Test 404 Errors
1. Navigate to non-existent spec: `http://localhost:3000/spec/invalid-uuid`
2. **Expected:**
   - Error message displayed
   - Options to go home or view all specs
   - localStorage cleared if invalid

#### Step 5: Test Validation
**Try various invalid inputs:**
- Empty refinement feedback
- Invalid characters in textarea
- Very long inputs (>10,000 characters)

**✅ Pass Criteria:**
- Errors display clearly
- App doesn't crash
- User can recover from errors
- Error messages are helpful

---

### ✅ Test 11: End-to-End Workflow

Complete workflow from idea to code:

#### Step 1: Generate Specification (5 minutes)
1. Start at home page
2. Enter a comprehensive idea
3. Generate specification
4. Verify JSON structure

#### Step 2: Refine Specification (3 minutes)
1. Add refinement instructions
2. Apply refinement
3. Verify updates

#### Step 3: Preview UI Design (2 minutes)
1. View design preview
2. Check all modules
3. Verify tables and forms

#### Step 4: Generate Code (3 minutes)
1. Generate Django/DRF code
2. Review all 4 files
3. Download code

#### Step 5: Export and Save (1 minute)
1. Export JSON
2. Verify localStorage
3. Test restore

**Total Time: ~15 minutes**

**✅ Pass Criteria:**
- Complete workflow works end-to-end
- No errors at any step
- All features work together
- Data persists correctly

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Not Starting
**Symptoms:** `Connection refused` errors
**Solutions:**
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill existing process if needed
kill -9 <PID>

# Restart backend
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

### Issue 2: Frontend Not Connecting
**Symptoms:** API errors, CORS issues
**Solutions:**
```bash
# Check .env file
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:8000/api

# Restart frontend
cd frontend
npm run dev
```

### Issue 3: OpenAI Errors
**Symptoms:** "API key not configured" or "Quota exceeded"
**Solutions:**
1. Verify API key in `backend/.env`
2. Check OpenAI account has credits
3. Verify key starts with `sk-`

### Issue 4: Database Errors
**Symptoms:** Migration errors, connection refused
**Solutions:**
```bash
cd backend
source venv/bin/activate

# Run migrations
python manage.py migrate

# Check database
python manage.py shell
>>> from specs.models import Spec
>>> Spec.objects.all()
```

### Issue 5: localStorage Not Working
**Symptoms:** Restore banner doesn't appear
**Solutions:**
1. Open DevTools → Application → Local Storage
2. Verify `erp_ai_last_spec_id` exists
3. Clear and try again: `localStorage.clear()`

---

## ✅ Final Verification Checklist

### Backend Tests
- [ ] Server starts without errors
- [ ] Admin panel accessible: `http://localhost:8000/admin`
- [ ] API endpoints respond correctly
- [ ] OpenAI integration works
- [ ] Database operations work

### Frontend Tests
- [ ] Dev server starts without errors
- [ ] All pages load correctly
- [ ] Navigation works smoothly
- [ ] No console errors
- [ ] Responsive design works

### Feature Tests
- [ ] Specification generation works
- [ ] Refinement works
- [ ] Design preview renders correctly
- [ ] Code generation works
- [ ] Export JSON works
- [ ] localStorage persistence works
- [ ] All UI components styled correctly

### Integration Tests
- [ ] Frontend connects to backend
- [ ] API calls complete successfully
- [ ] Data flows correctly
- [ ] Error handling works
- [ ] Loading states display

---

## 📊 Performance Expectations

**Generation Times:**
- Spec Generation: 10-30 seconds
- Refinement: 10-30 seconds
- Code Generation: 15-45 seconds

**Page Load Times:**
- Initial load: <2 seconds
- Navigation: <500ms
- API responses: Depends on OpenAI

---

## 🎯 Success Criteria Summary

**All features working:** ✅
- Specification generation
- Refinement
- Design preview
- Code generation
- Export JSON
- localStorage persistence
- UI components
- Responsive design
- Error handling
- End-to-end workflow

**No critical bugs:** ✅
- No app crashes
- No data loss
- No broken UI
- No navigation issues

**User experience:** ✅
- Clear feedback
- Loading states
- Error messages
- Smooth transitions
- Intuitive interface

---

## 📝 Testing Log Template

Use this to track your testing:

```
Date: _____________
Tester: _____________

Feature Testing Results:
[ ] Navigation & UI - Pass/Fail - Notes: _______________
[ ] Generate Spec - Pass/Fail - Notes: _______________
[ ] localStorage - Pass/Fail - Notes: _______________
[ ] Export JSON - Pass/Fail - Notes: _______________
[ ] Refine Spec - Pass/Fail - Notes: _______________
[ ] Design Preview - Pass/Fail - Notes: _______________
[ ] Code Generation - Pass/Fail - Notes: _______________
[ ] View All Specs - Pass/Fail - Notes: _______________
[ ] UI Components - Pass/Fail - Notes: _______________
[ ] Error Handling - Pass/Fail - Notes: _______________
[ ] E2E Workflow - Pass/Fail - Notes: _______________

Overall Result: Pass/Fail
Issues Found: _______________
```

---

**Happy Testing! 🎉 Follow this guide step-by-step to thoroughly test every feature!**

