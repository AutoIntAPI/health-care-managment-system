# Healthcare System - Complete Project Structure

```
healthcare-system/
├── services/
│   ├── auth-service/                    # JWT Authentication Service (Node.js/JavaScript)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── authController.js    # Login, Register, Verify logic
│   │   │   ├── middleware/
│   │   │   │   └── authMiddleware.js    # JWT verification middleware
│   │   │   ├── models/
│   │   │   │   └── userModel.js         # User data model (in-memory)
│   │   │   └── routes/
│   │   │       └── authRoutes.js        # Auth API routes
│   │   ├── .env.example                 # Environment variables template
│   │   ├── Dockerfile                   # Container configuration
│   │   ├── package.json                 # Node.js dependencies
│   │   └── server.js                    # Express server entry point
│   │
│   ├── patient-service/                 # Patient Management Service (Python/Flask)
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   │   └── patient_controller.py # CRUD operations logic
│   │   │   ├── models/
│   │   │   │   └── patient_model.py      # Patient data model (in-memory)
│   │   │   ├── routes/
│   │   │   │   └── patient_routes.py     # Patient API routes
│   │   │   └── __init__.py
│   │   ├── .env.example                  # Environment variables template
│   │   ├── app.py                        # Flask app entry point
│   │   ├── Dockerfile                    # Container configuration
│   │   └── requirements.txt              # Python dependencies
│   │
│   ├── doctor-service/                   # Doctor Management Service (Node.js/TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── doctorController.ts   # CRUD & availability logic
│   │   │   ├── models/
│   │   │   │   └── doctorModel.ts        # Doctor data model (in-memory)
│   │   │   ├── routes/
│   │   │   │   └── doctorRoutes.ts       # Doctor API routes
│   │   │   ├── types/
│   │   │   │   └── doctor.ts             # TypeScript interfaces
│   │   │   └── server.ts                 # Express server entry point
│   │   ├── dist/                         # Compiled JavaScript (generated)
│   │   ├── .env.example                  # Environment variables template
│   │   ├── Dockerfile                    # Container configuration
│   │   ├── package.json                  # Node.js dependencies
│   │   └── tsconfig.json                 # TypeScript configuration
│   │
│   ├── appointment-service/              # Appointment Orchestration Service (Node.js/JavaScript)
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   │   └── appointmentController.js # Booking logic + REST calls
│   │   │   ├── models/
│   │   │   │   └── appointmentModel.js   # Appointment data model (in-memory)
│   │   │   └── routes/
│   │   │       └── appointmentRoutes.js  # Appointment API routes
│   │   ├── .env.example                  # Environment variables template
│   │   ├── Dockerfile                    # Container configuration
│   │   ├── package.json                  # Node.js dependencies (includes axios)
│   │   └── server.js                     # Express server entry point
│   │
│   └── billing-service/                  # Billing Calculation Service (Python/Flask)
│       ├── app/
│       │   ├── controllers/
│       │   │   └── billing_controller.py # Bill calculation & payment logic
│       │   ├── models/
│       │   │   └── billing_model.py      # Bill data model (in-memory)
│       │   ├── routes/
│       │   │   └── billing_routes.py     # Billing API routes
│       │   └── __init__.py
│       ├── .env.example                  # Environment variables template
│       ├── app.py                        # Flask app entry point
│       ├── Dockerfile                    # Container configuration
│       └── requirements.txt              # Python dependencies
│
├── .gitignore                            # Git ignore rules
├── API_TESTING_GUIDE.md                  # Complete API documentation with examples
├── ARCHITECTURE.md                       # System architecture documentation
├── docker-compose.yml                    # Multi-container orchestration
├── package.json                          # Root package.json for scripts
├── postman_collection.json               # Postman API collection
├── QUICKSTART.md                         # Quick start guide
└── README.md                             # Project overview

```

## Service Ports

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| auth-service | 3001 | Node.js/Express | JWT authentication & user roles |
| patient-service | 5001 | Python/Flask | Patient records management |
| doctor-service | 3002 | Node.js/TypeScript | Doctor profiles & availability |
| appointment-service | 3003 | Node.js/Express | Appointment booking orchestration |
| billing-service | 5002 | Python/Flask | Billing calculation & payments |

## Key Files by Service

### Auth Service

- **server.js**: Express server setup with middleware
- **authController.js**: Handles register, login, verify operations
- **authMiddleware.js**: JWT token verification
- **userModel.js**: In-memory user storage with roles (doctor, patient, admin)

### Patient Service

- **app.py**: Flask application setup
- **patient_controller.py**: CRUD operations for patients
- **patient_model.py**: Patient data structure with medical history
- **patient_routes.py**: RESTful endpoints

### Doctor Service

- **server.ts**: TypeScript Express server
- **doctorController.ts**: CRUD + availability management
- **doctorModel.ts**: Doctor data with scheduling
- **doctor.ts**: TypeScript type definitions

### Appointment Service

- **server.js**: Express server with REST client
- **appointmentController.js**:
  - Calls Patient Service to verify patient exists
  - Calls Doctor Service to verify doctor exists
  - Calls Billing Service to create bill
  - Orchestrates appointment creation
- **appointmentModel.js**: Appointment data storage

### Billing Service

- **app.py**: Flask application
- **billing_controller.py**:
  - Dynamic bill calculation
  - Tax computation
  - Payment processing
  - Multiple service types with rates
- **billing_model.py**: Bill data structure

## REST API Communication Flow

```
Appointment Creation Request
        ↓
[Appointment Service]
        ↓
        ├→ GET /api/patients/{id} → [Patient Service]
        ├→ GET /api/doctors/{id} → [Doctor Service]
        └→ POST /api/billing/calculate → [Billing Service]
        ↓
Response with appointment + billing details
```

## Data Storage

All services use **in-memory storage** (no database):

- JavaScript services: Arrays with auto-incrementing IDs
- Python services: Lists with auto-incrementing IDs

**Note**: Data is lost when services restart. For production, integrate with databases (PostgreSQL, MongoDB, etc.)

## Dependencies by Service

### Node.js Services

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **axios**: HTTP client (appointment-service only)
- **jsonwebtoken**: JWT handling (auth-service only)
- **bcryptjs**: Password hashing (auth-service only)

### Python Services

- **Flask**: Web framework
- **flask-cors**: CORS support
- **python-dotenv**: Environment variables

### TypeScript Service

- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution
- **@types/express**: TypeScript types for Express

## Environment Variables

Each service has an `.env.example` file. Key variables:

### All Services

- `PORT`: Service port number
- `NODE_ENV` / `FLASK_ENV`: Environment (development/production)

### Appointment Service (Additional)

- `PATIENT_SERVICE_URL`: Patient service endpoint
- `DOCTOR_SERVICE_URL`: Doctor service endpoint
- `BILLING_SERVICE_URL`: Billing service endpoint
- `AUTH_SERVICE_URL`: Auth service endpoint

### Auth Service (Additional)

- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time

## Docker Configuration

### Individual Dockerfiles

Each service has its own Dockerfile:

- **Node.js services**: Based on `node:18-alpine`
- **Python services**: Based on `python:3.11-slim`

### docker-compose.yml

Orchestrates all 5 services with:

- Network configuration (healthcare-network)
- Port mapping
- Environment variables
- Service dependencies
- Health checks via `/health` endpoints

## Development vs Production

### Development

- Services run on localhost with different ports
- In-memory data storage
- Detailed error logging
- No authentication required for most endpoints
- CORS enabled for all origins

### Production Recommendations

- Add API Gateway (e.g., Kong, NGINX)
- Implement rate limiting
- Add database persistence (PostgreSQL, MongoDB)
- Enable HTTPS/TLS
- Implement proper authentication for all endpoints
- Add monitoring (Prometheus, Grafana)
- Add logging (ELK stack)
- Implement circuit breakers for service calls
- Add health checks and readiness probes
- Use environment-specific configurations

## API Endpoints Summary

### Auth Service (3001)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify
GET    /health
```

### Patient Service (5001)

```
POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
GET    /health
```

### Doctor Service (3002)

```
POST   /api/doctors
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id
GET    /api/doctors/:id/availability
POST   /api/doctors/:id/availability
GET    /health
```

### Appointment Service (3003)

```
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/:id
GET    /api/appointments/patient/:patientId
GET    /api/appointments/doctor/:doctorId
PUT    /api/appointments/:id
DELETE /api/appointments/:id
GET    /health
```

### Billing Service (5002)

```
POST   /api/billing/calculate
GET    /api/billing
GET    /api/billing/:id
GET    /api/billing/appointment/:appointmentId
POST   /api/billing/:id/pay
GET    /health
```

## Testing

### Manual Testing

- Use curl commands (see API_TESTING_GUIDE.md)
- Import postman_collection.json into Postman
- Use browser for GET requests

### Automated Testing

- Add unit tests using Jest (Node.js) and pytest (Python)
- Add integration tests for service-to-service communication
- Add end-to-end tests for complete workflows

## Contributing

When adding new features:

1. Follow the existing folder structure
2. Add appropriate error handling
3. Update API documentation
4. Add request validation
5. Maintain REST conventions
6. Update Postman collection
7. Test service-to-service communication
