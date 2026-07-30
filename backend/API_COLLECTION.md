
Complete API endpoint collection with request/response examples.

## Base URL
```
http://localhost:8088/api/v1
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Authentication & User Management (5 endpoints)

### 1.1 Register User
**POST** `/auth/register`

**Request:**
```json
{
  \"name\": \"John Doe\",
  \"email\": \"john@example.com\",
  \"password\": \"password123\"
}
```

### 1.2 Login
**POST** `/auth/login`

### 1.3 Get Profile
**GET** `/auth/profile` (Requires auth)

### 1.4 Update Profile
**PUT** `/auth/profile` (Requires auth)

### 1.5 Logout
**POST** `/auth/logout` (Requires auth)

---

## 2. Pet Management (8 endpoints)

### 2.1 Create Pet
**POST** `/pets` (Admin only)

### 2.2 Get All Pets
**GET** `/pets?page=1&limit=10&species=dog`

### 2.3 Search Pets
**GET** `/pets/search?q=golden`

### 2.4 Get Categories
**GET** `/pets/categories`

### 2.5 Get Pet by ID
**GET** `/pets/:id`

### 2.6 Update Pet
**PUT** `/pets/:id` (Admin only)

### 2.7 Delete Pet
**DELETE** `/pets/:id` (Admin only)

---

## 3. Adoption Applications (7 endpoints)

### 3.1 Submit Application
**POST** `/adoptions` (Requires auth)

### 3.2 Get All Adoptions
**GET** `/adoptions` (Admin only)

### 3.3 Get Adoption by ID
**GET** `/adoptions/:id` (Requires auth)

### 3.4 Update Status
**PUT** `/adoptions/:id/status` (Admin only)

### 3.5 Get User Adoptions
**GET** `/adoptions/user/:userId` (Requires auth)

### 3.6 Get Pet Adoptions
**GET** `/adoptions/pet/:petId` (Admin only)

### 3.7 Cancel Adoption
**DELETE** `/adoptions/:id` (Requires auth)

---

## 4. AI Features (6 endpoints)

### 4.1 Generate Description
**POST** `/ai/generate-description` (Admin only)

### 4.2 AI Pet Matching
**POST** `/ai/match` (Requires auth)

### 4.3 Analyze Compatibility
**POST** `/ai/analyze-compatibility` (Requires auth)

### 4.4 AI Chatbot (Streaming)
**POST** `/ai/chat` (Requires auth)

### 4.5 Get Chat History
**GET** `/ai/chat-history?sessionId=xxx` (Requires auth)

### 4.6 Get Recommendations
**GET** `/ai/recommendations/:userId` (Requires auth)

---

## 5. Admin Dashboard (2 endpoints)

### 5.1 Get Statistics
**GET** `/admin/stats` (Admin only)

### 5.2 Get All Users
**GET** `/admin/users` (Admin only)

---

**Total Endpoints: 28**
"
Observation: Create successful: /app/backend_ts/API_COLLECTION.md