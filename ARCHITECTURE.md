# Healthcare System - Service Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Healthcare System                            │
│                   (Microservices Architecture)                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Auth Service   │     │ Patient Service  │     │  Doctor Service  │
│   (Node.js/JS)   │     │  (Python/Flask)  │     │ (Node.js/TypeScript)│
│   Port: 3001     │     │   Port: 5001     │     │   Port: 3002     │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Appointment     │
                         │    Service       │
                         │  (Node.js/JS)    │
                         │  Port: 3003      │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Billing Service │
                         │  (Python/Flask)  │
                         │  Port: 5002      │
                         └──────────────────┘
```

## Service Details

### 1. Auth Service (JavaScript/Node.js)

- **Port:** 3001
- **Technology:** Express.js
- **Purpose:** JWT-based authentication and user role management
- **Folder Structure:**

  ```
  auth-service/
  ├── src/
  │   ├── controllers/
  │   │   └── authController.js
  │   ├── middleware/
  │   │   └── authMiddleware.js
  │   ├── models/
  │   │   └── userModel.js
  │   └── routes/
  │       └── authRoutes.js
  ├── server.js
  ├── package.json
  └── Dockerfile
  ```

### 2. Patient Service (Python/Flask)

- **Port:** 5001
- **Technology:** Flask
- **Purpose:** Patient records management
- **Folder Structure:**

  ```
  patient-service/
  ├── app/
  │   ├── controllers/
  │   │   └── patient_controller.py
  │   ├── models/
  │   │   └── patient_model.py
  │   └── routes/
  │       └── patient_routes.py
  ├── app.py
  ├── requirements.txt
  └── Dockerfile
  ```

### 3. Doctor Service (TypeScript/Node.js)

- **Port:** 3002
- **Technology:** Express.js with TypeScript
- **Purpose:** Doctor profiles and availability management
- **Folder Structure:**

  ```
  doctor-service/
  ├── src/
  │   ├── controllers/
  │   │   └── doctorController.ts
  │   ├── models/
  │   │   └── doctorModel.ts
  │   ├── routes/
  │   │   └── doctorRoutes.ts
  │   ├── types/
  │   │   └── doctor.ts
  │   └── server.ts
  ├── dist/ (compiled)
  ├── tsconfig.json
  ├── package.json
  └── Dockerfile
  ```

### 4. Appointment Service (JavaScript/Node.js)

- **Port:** 3003
- **Technology:** Express.js with Axios for REST calls
- **Purpose:** Appointment booking orchestration
- **Dependencies:** Calls Patient, Doctor, and Billing services
- **Folder Structure:**

  ```
  appointment-service/
  ├── app/
  │   ├── controllers/
  │   │   └── appointmentController.js
  │   ├── models/
  │   │   └── appointmentModel.js
  │   └── routes/
  │       └── appointmentRoutes.js
  ├── server.js
  ├── package.json
  └── Dockerfile
  ```

### 5. Billing Service (Python/Flask)

- **Port:** 5002
- **Technology:** Flask
- **Purpose:** Bill calculation and payment tracking
- **Folder Structure:**

  ```
  billing-service/
  ├── app/
  │   ├── controllers/
  │   │   └── billing_controller.py
  │   ├── models/
  │   │   └── billing_model.py
  │   └── routes/
  │       └── billing_routes.py
  ├── app.py
  ├── requirements.txt
  └── Dockerfile
  ```

## Communication Flow

### Appointment Creation Flow

```
Client Request
    │
    ▼
Appointment Service
    │
    ├──► Patient Service (Verify patient exists)
    │         │
    │         └──► Returns patient data
    │
    ├──► Doctor Service (Verify doctor exists)
    │         │
    │         └──► Returns doctor data
    │
    ├──► Billing Service (Create bill)
    │         │
    │         └──► Returns bill data
    │
    └──► Response to Client (Appointment created)
```

## Key Features

### Auth Service

- User registration with role assignment (doctor, patient, admin)
- JWT token generation
- Token verification
- Password hashing with bcrypt

### Patient Service

- CRUD operations for patient records
- Medical history tracking
- Allergy information
- Emergency contact management

### Doctor Service

- CRUD operations for doctor profiles
- Availability scheduling
- Specialization tracking
- Rating system

### Appointment Service

- Book appointments
- Verify patient and doctor via REST calls
- Automatic billing creation
- Status management (scheduled, completed, cancelled)

### Billing Service

- Dynamic bill calculation
- Multiple service types with different rates
- Tax calculation
- Payment tracking
- Support for additional charges

## Data Models

### User (Auth Service)

```javascript
{
  id: number,
  email: string,
  password: string (hashed),
  name: string,
  role: 'doctor' | 'patient' | 'admin',
  createdAt: string
}
```

### Patient

```json
{
  "id": number,
  "name": string,
  "email": string,
  "phone": string,
  "date_of_birth": string,
  "gender": string,
  "address": string,
  "blood_type": string,
  "allergies": array,
  "medical_history": array,
  "emergency_contact": object,
  "created_at": string,
  "updated_at": string
}
```

### Doctor

```typescript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  specialization: string,
  license_number: string,
  years_of_experience: number,
  qualification: string,
  consultation_fee: number,
  availability: Array<DoctorAvailability>,
  rating: number,
  created_at: string,
  updated_at: string
}
```

### Appointment

```javascript
{
  id: number,
  patient_id: number,
  doctor_id: number,
  appointment_date: string,
  appointment_time: string,
  reason: string,
  status: 'scheduled' | 'completed' | 'cancelled',
  billing_id: number,
  notes: string,
  created_at: string,
  updated_at: string
}
```

### Bill

```python
{
  'id': int,
  'appointment_id': int,
  'patient_id': int,
  'doctor_id': int,
  'service_type': str,
  'base_amount': float,
  'additional_charges': float,
  'subtotal': float,
  'tax_amount': float,
  'total_amount': float,
  'status': 'pending' | 'paid' | 'cancelled',
  'payment_method': str,
  'transaction_id': str,
  'paid_at': str,
  'created_at': str,
  'updated_at': str
}
```

## Technology Stack

### Languages

- **JavaScript** (ES6+) - Auth Service, Appointment Service
- **TypeScript** - Doctor Service
- **Python 3.11** - Patient Service, Billing Service

### Frameworks

- **Express.js** - Node.js web framework
- **Flask** - Python web framework

### Libraries

- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **axios** - HTTP client for REST calls
- **cors** - Cross-origin resource sharing
- **flask-cors** - CORS for Flask

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Design Principles

1. **Microservices Architecture** - Each service is independent
2. **REST API Communication** - Services communicate only via HTTP/REST
3. **Single Responsibility** - Each service has one clear purpose
4. **Language Diversity** - Demonstrates polyglot architecture
5. **Containerization** - All services are Dockerized
6. **No Shared Database** - Each service has its own data store (in-memory)
7. **API-First Design** - Well-defined REST endpoints
8. **Stateless Services** - Services don't maintain session state
