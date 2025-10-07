# Quick Test - 5 Minute Verification

Fast smoke test to verify the system is working.

## ⚡ Quick Start (2 minutes)

### Terminal 1: Backend
```bash
cd /Users/sindhuras/Desktop/ERP/ERP_AI/backend
source venv/bin/activate
make dev
```
**Wait for:** `Starting development server at http://127.0.0.1:8000/`

### Terminal 2: Frontend
```bash
cd /Users/sindhuras/Desktop/ERP/ERP_AI/frontend
npm run dev
```
**Wait for:** `Local:   http://localhost:3000/`

---

## 🧪 Quick Smoke Test (3 minutes)

### Test 1: Basic Navigation (30 seconds)
1. Open: `http://localhost:3000`
2. ✅ See "Generate Technical Specification" page
3. Click "Specifications" in nav
4. ✅ See "All Specifications" page
5. Click "Generate Spec" in nav
6. ✅ Back to home page

### Test 2: Generate Spec (90 seconds)
1. On home page, enter in textarea:
   ```
   A simple task management app with todo lists and categories
   ```
2. Click "Generate Spec"
3. ✅ Button shows loading spinner
4. Wait 10-30 seconds
5. ✅ Redirects to spec page
6. ✅ See JSON specification
7. ✅ See metric cards (Modules, Entities, KPIs)

### Test 3: Quick Feature Check (60 seconds)
1. On spec page, click "Export JSON"
   - ✅ File downloads
   - ✅ Green success banner appears
   
2. Click "Preview UI"
   - ✅ Navigate to design preview
   - ✅ See tables/forms rendered
   
3. Go back, click "Generate Code"
   - ✅ Navigate to code stubs page
   - ✅ See module selector
   
4. Click "Generate Django/DRF Code Stubs"
   - ✅ Button shows loading
   - Wait 15-45 seconds
   - ✅ See 4 code files
   - ✅ Click tabs to switch files

### Test 4: localStorage (10 seconds)
1. Navigate to home page
2. ✅ See "Continue where you left off" banner
3. Click "Restore Last Spec"
4. ✅ Returns to last spec

---

## ✅ All Tests Pass?

**YES** → System is working! ✨
- You can proceed with full testing
- All features are operational

**NO** → Check:
1. Backend running? `http://localhost:8000/admin`
2. Frontend running? `http://localhost:3000`
3. OpenAI API key set in `backend/.env`?
4. Check browser console (F12) for errors
5. Check backend terminal for errors

---

## 🐛 Quick Fixes

### Backend not starting:
```bash
cd backend
python manage.py migrate
make dev
```

### Frontend not starting:
```bash
cd frontend
npm install
npm run dev
```

### OpenAI errors:
```bash
cd backend
cat .env | grep OPENAI
# Should show: OPENAI_API_KEY=sk-...
```

### Clear everything and restart:
```bash
# Clear localStorage
# In browser console (F12):
localStorage.clear()
location.reload()

# Restart servers
# Ctrl+C in both terminals, then restart
```

---

## 📊 Expected Behavior

### What Should Work:
✅ Navigation between pages
✅ Generate specification from idea
✅ View generated JSON
✅ Export JSON file
✅ Preview UI components
✅ Generate Django/DRF code
✅ localStorage persistence
✅ All buttons and interactions

### Performance:
- Page loads: <2 seconds
- Navigation: Instant
- Spec generation: 10-30 seconds
- Code generation: 15-45 seconds

### Visual:
- Clean, modern UI
- Blue/indigo color scheme
- Smooth animations
- Responsive layout
- No broken styles

---

## 🎯 Next Steps

**If smoke test passes:**
→ Proceed to full testing guide: `TESTING_GUIDE.md`

**If smoke test fails:**
→ Check troubleshooting in `TESTING_GUIDE.md`
→ Verify environment variables
→ Check server logs

---

**This 5-minute test verifies all core features are operational! 🚀**

