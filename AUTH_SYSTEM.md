# Authentication System Documentation

Complete JWT-based authentication system with user registration, login, and token management.

## 🔐 Overview

The authentication system uses **Django REST Framework Simple JWT** for token-based authentication with:
- User registration with email uniqueness
- Secure password hashing
- JWT access and refresh tokens
- Token blacklisting for logout
- Protected endpoints

---

## 📦 Components

### Files Created

```
backend/accounts/
├── __init__.py
├── serializers.py       # RegisterSerializer, UserSerializer
├── views.py             # RegisterView, MeView, LogoutView
├── urls.py              # Authentication routes
├── models.py            # (Using Django's built-in User model)
├── admin.py
├── apps.py
└── tests.py
```

---

## 🔌 API Endpoints

### Base URL: `/api/auth/`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register/` | Register new user | No |
| POST | `/login/` | Login and get tokens | No |
| POST | `/token/refresh/` | Refresh access token | No |
| GET | `/me/` | Get current user info | Yes |
| POST | `/logout/` | Logout (blacklist token) | Yes |

---

## 📝 API Documentation

### 1. Register User

**POST** `/api/auth/register/`

Create a new user account.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "date_joined": "2025-01-07T12:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**

**400 Bad Request** (Email exists):
```json
{
  "email": ["A user with this email already exists."]
}
```

**400 Bad Request** (Passwords don't match):
```json
{
  "password": ["Password fields didn't match."]
}
```

**400 Bad Request** (Weak password):
```json
{
  "password": ["This password is too common.", "This password is too short."]
}
```

---

### 2. Login

**POST** `/api/auth/login/`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "username": "john.doe",  
  "password": "SecurePassword123!"
}
```

**Note:** Username is auto-generated from email during registration (part before @).

**Success Response (200 OK):**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "No active account found with the given credentials"
}
```

---

### 3. Refresh Token

**POST** `/api/auth/token/refresh/`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Note:** New refresh token is provided due to `ROTATE_REFRESH_TOKENS` setting.

---

### 4. Get Current User

**GET** `/api/auth/me/`

Get authenticated user's information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "date_joined": "2025-01-07T12:00:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 5. Logout

**POST** `/api/auth/logout/`

Logout user by blacklisting refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (205 Reset Content):**
```json
{
  "message": "Successfully logged out"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Refresh token is required"
}
```

---

## 🔧 Implementation Details

### RegisterSerializer

**Features:**
- Validates email uniqueness (case-insensitive)
- Validates password strength using Django validators
- Confirms passwords match
- Hashes password using `set_password()`
- Auto-generates username from email
- Handles username conflicts with counter

**Code:**
```python
def create(self, validated_data):
    validated_data.pop('password_confirm')
    
    email = validated_data['email']
    username = email.split('@')[0]
    
    # Ensure username is unique
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    
    user = User.objects.create(
        username=username,
        email=validated_data['email'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name']
    )
    
    # Hash password
    user.set_password(validated_data['password'])
    user.save()
    
    return user
```

---

### UserSerializer

**Features:**
- Returns user ID, full name, email, join date
- Computes full name from first_name + last_name
- Read-only fields

**Code:**
```python
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'date_joined']
        read_only_fields = ['id', 'date_joined']
    
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
```

---

### JWT Configuration

**Token Lifetimes:**
- Access Token: 1 hour
- Refresh Token: 7 days

**Features:**
- Token rotation on refresh
- Blacklisting after rotation
- Last login update
- HS256 algorithm

**Settings:**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

---

## 🧪 Testing the API

### Using cURL

**1. Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "SecurePassword123!"
  }'
```

**3. Get Current User:**
```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer <access_token>"
```

**4. Logout:**
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "<refresh_token>"
  }'
```

---

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000/api/auth"

# Register
register_data = {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!"
}
response = requests.post(f"{BASE_URL}/register/", json=register_data)
print(response.json())

# Login
login_data = {
    "username": "john.doe",
    "password": "SecurePassword123!"
}
response = requests.post(f"{BASE_URL}/login/", json=login_data)
tokens = response.json()
access_token = tokens['access']
refresh_token = tokens['refresh']

# Get current user
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(f"{BASE_URL}/me/", headers=headers)
print(response.json())

# Logout
logout_data = {"refresh_token": refresh_token}
response = requests.post(f"{BASE_URL}/logout/", json=logout_data, headers=headers)
print(response.json())
```

---

## 🔒 Security Features

### Password Security
- ✅ Django's built-in password validators
- ✅ Password hashing using PBKDF2
- ✅ Passwords never stored in plain text
- ✅ Password confirmation required

### Email Security
- ✅ Email uniqueness enforced
- ✅ Case-insensitive email storage
- ✅ Email format validation

### Token Security
- ✅ Short-lived access tokens (1 hour)
- ✅ Refresh tokens with 7-day expiry
- ✅ Token blacklisting on logout
- ✅ Token rotation on refresh
- ✅ Secure JWT signing

---

## 🚀 Frontend Integration

### axios Example

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

// Create axios instance
const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
export const register = async (data) => {
  const response = await authAPI.post('/register/', data);
  localStorage.setItem('access_token', response.data.tokens.access);
  localStorage.setItem('refresh_token', response.data.tokens.refresh);
  return response.data;
};

// Login
export const login = async (username, password) => {
  const response = await authAPI.post('/login/', { username, password });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await authAPI.get('/me/');
  return response.data;
};

// Logout
export const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  await authAPI.post('/logout/', { refresh_token: refreshToken });
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
```

---

## 📋 Database Models

### User Model (Django Built-in)

```python
from django.contrib.auth.models import User

# Fields used:
# - id (auto)
# - username (generated from email)
# - email (unique)
# - first_name
# - last_name
# - password (hashed)
# - date_joined (auto)
# - last_login (auto-updated)
# - is_active
# - is_staff
# - is_superuser
```

### Token Blacklist Models

```python
# OutstandingToken - tracks all issued tokens
# BlacklistedToken - tracks blacklisted tokens
```

---

## ✅ Testing Checklist

### Registration Tests
- [ ] Register with valid data
- [ ] Register with duplicate email (should fail)
- [ ] Register with mismatched passwords (should fail)
- [ ] Register with weak password (should fail)
- [ ] Register with invalid email (should fail)
- [ ] Verify JWT tokens returned
- [ ] Verify user created in database

### Login Tests
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent user (should fail)
- [ ] Verify JWT tokens returned

### Token Tests
- [ ] Access protected endpoint with valid token
- [ ] Access protected endpoint without token (should fail)
- [ ] Access protected endpoint with expired token (should fail)
- [ ] Refresh token successfully
- [ ] Use refreshed access token

### Logout Tests
- [ ] Logout with valid refresh token
- [ ] Verify token is blacklisted
- [ ] Try to use blacklisted token (should fail)

### User Info Tests
- [ ] Get current user info
- [ ] Verify all fields returned correctly
- [ ] Verify full name computed correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Authentication credentials were not provided"
**Solution:** Include `Authorization: Bearer <token>` header

### Issue: "Token is blacklisted"
**Solution:** User has logged out, need to login again

### Issue: "Token is expired"
**Solution:** Use refresh token to get new access token

### Issue: "Email already exists"
**Solution:** User already registered, use login instead

### Issue: Username auto-generation conflict
**Solution:** System automatically handles by appending numbers

---

## 📊 Token Flow Diagram

```
Registration/Login
       ↓
  Get Tokens (Access + Refresh)
       ↓
Store Tokens in localStorage/cookies
       ↓
Include Access Token in API Requests
       ↓
Access Token Expires (1 hour)
       ↓
Use Refresh Token to Get New Access Token
       ↓
Continue Using New Access Token
       ↓
Refresh Token Expires (7 days) → Login Again
```

---

## 🔄 Migration Commands

```bash
# Create accounts app
python manage.py startapp accounts

# Run migrations for token blacklist
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser
```

---

## 📦 Dependencies

```txt
djangorestframework-simplejwt==5.5.1
PyJWT==2.10.1
```

Added to `requirements.txt` automatically.

---

**Authentication system is complete and ready to use! 🔐✨**

