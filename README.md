# ERP AI System

A modern Enterprise Resource Planning (ERP) system built with Django REST Framework backend and React TypeScript frontend, featuring AI-powered automation and analytics.

## 🏗️ Architecture

This project follows a monorepo structure with separate backend and frontend applications:

```
ERP_AI/
├── backend/          # Django + DRF API
├── frontend/         # React + TypeScript + Tailwind CSS
└── README.md         # This file
```

## 🚀 Tech Stack

### Backend
- **Django 5.2.7** - Web framework
- **Django REST Framework** - API framework
- **django-cors-headers** - CORS handling
- **python-decouple** - Environment variables
- **SQLite** - Database (development)

### Frontend
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **Vite 4.5.0** - Build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios** - HTTP client (ready for integration)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+** (recommended: Python 3.11+)
- **Node.js 18+** (recommended: Node.js 20+)
- **npm** or **yarn**
- **Git**

## ⚡ Quick Start

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
make install
cp env.example .env
# Edit .env with your credentials
make migrate
make dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ERP_AI
```

### 2. Backend Setup

Navigate to the backend directory and set up the Django environment:

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
make install
# or: pip install -r requirements.txt

# Copy and configure environment variables
cp env.example .env
# Edit .env with your OpenAI API key and Railway DATABASE_URL

# Run database migrations
make migrate
# or: python manage.py migrate

# Create a superuser (optional)
make superuser
# or: python manage.py createsuperuser

# Start the development server
make dev
# or: python manage.py runserver 8000
```

The backend will be available at: `http://localhost:8000`

### 📝 Makefile Commands

The backend includes a Makefile for common tasks:

```bash
make help       # Show all available commands
make dev        # Start development server on port 8000
make migrate    # Run database migrations
make superuser  # Create Django superuser
make shell      # Start Django shell
make test       # Run tests
make check      # Run system checks
make install    # Install dependencies
make clean      # Clean Python cache files
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and set up the React application:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🌐 API Endpoints

The backend provides the following AI-powered specification endpoints:

- `POST /api/specs/generate/` - Generate specification from idea
- `GET /api/specs/` - Get all specifications (latest 10)
- `GET /api/specs/<uuid:id>/` - Get single specification
- `POST /api/specs/refine/<uuid:id>/` - Refine existing specification
- `POST /api/code-stubs/` - Generate Django/DRF code stubs
- `GET /admin/` - Django admin interface

### API Examples

**Generate Specification:**
```bash
curl -X POST http://localhost:8000/api/specs/generate/ \
  -H "Content-Type: application/json" \
  -d '{"idea": "Inventory management system with stock tracking"}'
```

**Refine Specification:**
```bash
curl -X POST http://localhost:8000/api/specs/refine/<uuid>/ \
  -H "Content-Type: application/json" \
  -d '{"feedback": "Add user authentication module"}'
```

**Generate Code:**
```bash
curl -X POST http://localhost:8000/api/code-stubs/ \
  -H "Content-Type: application/json" \
  -d '{"spec_id": "<uuid>", "language": "python", "framework": "django"}'
```

## 📘 TypeScript Type System

The frontend uses a comprehensive type system aligned with the JSON schema. All types are defined in `frontend/src/types/spec.ts`.

### Core Types

```typescript
type FieldType = "string"|"text"|"integer"|"number"|"boolean"|"date"|"datetime"|"email";

interface SpecField {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
}

interface SpecEntity {
  name: string;
  fields: SpecField[];
}

interface SpecApi {
  method: "GET"|"POST"|"PATCH"|"DELETE"|"PUT";
  path: string;
  entity?: string;
}

interface SpecUI {
  type: "Table"|"Form";
  entity: string;
  columns?: string[];
  fields?: string[];
}

interface SpecModule {
  name: string;
  purpose: string;
  entities: SpecEntity[];
  apis: SpecApi[];
  ui: SpecUI[];
}

interface AppSpec {
  title: string;
  description: string;
  modules: SpecModule[];
  kpis: string[];
}

interface SpecRecord {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}
```

### API Client Usage

```typescript
import { apiClient } from '../services/api';

// Generate specification
const spec = await apiClient.generateSpec({ idea: "Your idea" });

// Get all specs
const specs = await apiClient.getSpecs();

// Get single spec
const spec = await apiClient.getSpec(id);

// Refine spec
const refined = await apiClient.refineSpec(id, { feedback: "Changes..." });

// Generate code
const code = await apiClient.generateCodeStubs({
  spec_id: id,
  language: "python",
  framework: "django"
});
```

For detailed API documentation, see `frontend/src/services/README.md`.

## 🎨 Frontend Features

The React frontend includes:

- **Modern UI** - Clean, responsive design with Tailwind CSS
- **TypeScript** - Full type safety with comprehensive type definitions
- **React Router** - Multi-page application with 5 routes
- **API Integration** - Axios-based client with full type coverage
- **Syntax Highlighting** - Code preview with react-syntax-highlighter
- **Error Handling** - Graceful error states and loading indicators

### Pages & Routes

1. **IdeaPage** (`/`) - Generate new specifications from business ideas
   - Textarea input for app idea
   - AI-powered specification generation
   - Real-time loading states

2. **SpecsListPage** (`/specs`) - View all specifications
   - List of latest 10 specifications
   - Quick actions (View, Preview UI, Generate Code)
   - Date sorting

3. **SpecPage** (`/spec/:id`) - View and refine specifications
   - View full specification JSON
   - Refine with AI feedback
   - Export JSON to file
   - Navigate to code generation

4. **DesignPreviewPage** (`/design-preview/:id`) - UI preview
   - Render Table components from spec
   - Render Form components from spec
   - Module selector
   - Live preview of UI definitions

5. **CodeStubsPage** (`/code-stubs/:id`) - Generate implementation code
   - Select module to generate code
   - View Django/DRF implementation
   - Syntax-highlighted code display
   - Copy and download individual files
   - Shows: models.py, serializers.py, views.py, urls.py

### Key Components

- `Navigation` - Top navigation with active route highlighting
- `ApiClient` - Typed HTTP client for backend communication

## 🔧 Development Scripts

### Backend Commands

**Using Makefile (Recommended):**
```bash
make dev        # Run development server
make migrate    # Run migrations
make superuser  # Create superuser
make shell      # Start Django shell
make test       # Run tests
make check      # Run system checks
make install    # Install dependencies
make clean      # Clean cache files
```

**Direct Django Commands:**
```bash
python manage.py runserver      # Run development server
python manage.py migrate         # Run migrations
python manage.py makemigrations  # Create migrations
python manage.py collectstatic   # Collect static files
python manage.py test            # Run tests
python manage.py shell           # Start Django shell
python manage.py createsuperuser # Create superuser
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🗄️ Database

The project uses SQLite by default for development. The database file (`db.sqlite3`) is automatically created when you run migrations.

For production, consider using PostgreSQL or MySQL by updating the database configuration in `backend/erp_ai/settings.py`.

### Railway Postgres Connection

To connect to Railway Postgres:

1. **Create a Postgres database on Railway:**
   - Go to [Railway.app](https://railway.app/)
   - Create a new project
   - Add a PostgreSQL database service

2. **Get connection details from Railway dashboard:**
   - Click on your Postgres service
   - Go to the "Variables" tab
   - Copy the connection variables

3. **Configure environment variables:**

   **Option A: Using DATABASE_URL (Recommended)**
   ```bash
   # In your .env file
   DATABASE_URL=postgresql://user:password@host:port/dbname
   USE_SQLITE=False
   ```

   **Option B: Using discrete variables**
   ```bash
   # In your .env file
   DB_NAME=railway
   DB_USER=postgres
   DB_PASS=your_railway_password
   DB_HOST=containers-us-west-123.railway.app
   DB_PORT=5432
   USE_SQLITE=False
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

**Note:** Railway automatically provides the `DATABASE_URL` environment variable when you add a Postgres service to your project.

## 🔐 Environment Variables

Create a `.env` file in the backend directory for environment-specific settings:

```bash
# Copy the example file
cp env.example .env
```

Then edit `.env` with your values:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Database Configuration (for Railway Postgres)
DB_NAME=railway
DB_USER=postgres
DB_PASS=your_railway_password
DB_HOST=containers-us-west-123.railway.app
DB_PORT=5432

# Or use DATABASE_URL (Railway provides this automatically)
# DATABASE_URL=postgresql://postgres:password@host:port/railway

# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Use SQLite for local development, Postgres for production
USE_SQLITE=False
```

## 🚀 Deployment

### Backend Deployment on Railway

Railway makes it easy to deploy Django applications with Postgres:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Railway project:**
   ```bash
   cd backend
   railway init
   ```

4. **Add Postgres database:**
   ```bash
   railway add
   # Select PostgreSQL
   ```

5. **Set environment variables:**
   ```bash
   railway variables set OPENAI_API_KEY=your-api-key
   railway variables set SECRET_KEY=your-secret-key
   railway variables set DEBUG=False
   railway variables set ALLOWED_HOSTS=*.railway.app
   railway variables set USE_SQLITE=False
   ```

6. **Deploy:**
   ```bash
   railway up
   ```

7. **Run migrations:**
   ```bash
   railway run python manage.py migrate
   railway run python manage.py createsuperuser
   ```

**Important:** Railway automatically sets the `DATABASE_URL` environment variable when you add a Postgres service, so you don't need to set individual DB_* variables.

### General Backend Deployment

1. Set `DEBUG=False` in production
2. Update `ALLOWED_HOSTS` with your domain
3. Use a production database (PostgreSQL recommended)
4. Set up static file serving
5. Configure environment variables
6. Run migrations: `python manage.py migrate`
7. Collect static files: `python manage.py collectstatic`

### Frontend Deployment

1. Build the application: `npm run build`
2. Serve the `dist` folder with a web server
3. Configure API endpoints for production backend
4. Deploy to Vercel, Netlify, or Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Python virtual environment is activated
- Check that all dependencies are installed
- Verify database migrations are up to date

**Frontend won't start:**
- Ensure Node.js version is 18+ (20+ recommended)
- Delete `node_modules` and run `npm install` again
- Check for port conflicts (default: 3000)

**API connection issues:**
- Ensure backend is running on port 8000
- Check CORS configuration in Django settings
- Verify API endpoints are accessible

### Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure both backend and frontend servers are running
4. Check network connectivity between frontend and backend

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced AI features integration
- [ ] Real-time notifications
- [ ] Mobile responsive improvements
- [ ] Comprehensive testing suite
- [ ] CI/CD pipeline setup
- [ ] Docker containerization
- [ ] API documentation with Swagger
- [ ] Database models for core ERP modules
- [ ] Advanced analytics dashboard

---

**Happy coding! 🎉**
