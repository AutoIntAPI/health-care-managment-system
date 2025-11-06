# 🏥 Healthcare Management System

A complete microservices-based healthcare management system built with Python, JavaScript, and TypeScript.

> **Status**: ✅ Fully implemented and ready to run!

## 🎯 Overview

This project demonstrates a modern microservices architecture with 5 independent services communicating exclusively via REST APIs. No message queues, no shared databases - pure REST communication.

## Architecture

This system consists of 5 independent microservices that communicate via REST API:

- **auth-service** (Node.js/JavaScript) - Port 3001: JWT-based authentication and user roles
- **patient-service** (Python/Flask) - Port 5001: Patient records management
- **doctor-service** (Node.js/TypeScript) - Port 3002: Doctor profiles and availability
- **appointment-service** (Node.js/JavaScript) - Port 3003: Appointment booking orchestration
- **billing-service** (Python/Flask) - Port 5002: Billing calculations

## Prerequisites

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose (for containerized deployment)

## Getting Started

### Local Development

1. Install dependencies for all services:

```bash
npm run install:all
```

2. Run individual services:

```bash
# Terminal 1 - Auth Service
npm run dev:auth

# Terminal 2 - Patient Service
npm run dev:patient

# Terminal 3 - Doctor Service
npm run dev:doctor

# Terminal 4 - Appointment Service
npm run dev:appointment

# Terminal 5 - Billing Service
npm run dev:billing
```

### Docker Deployment

1. Build all containers:

```bash
npm run docker:build
```

2. Start all services:

```bash
npm run docker:up
```

3. Stop all services:

```bash
npm run docker:down
```

## API Endpoints

### Auth Service (3001)

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/verify` - Verify JWT token

### Patient Service (5001)

- POST `/api/patients` - Create patient
- GET `/api/patients/:id` - Get patient by ID
- GET `/api/patients` - Get all patients
- PUT `/api/patients/:id` - Update patient
- DELETE `/api/patients/:id` - Delete patient

### Doctor Service (3002)

- POST `/api/doctors` - Create doctor profile
- GET `/api/doctors/:id` - Get doctor by ID
- GET `/api/doctors` - Get all doctors
- PUT `/api/doctors/:id` - Update doctor
- DELETE `/api/doctors/:id` - Delete doctor
- GET `/api/doctors/:id/availability` - Get doctor availability

### Appointment Service (3003)

- POST `/api/appointments` - Book appointment
- GET `/api/appointments/:id` - Get appointment by ID
- GET `/api/appointments` - Get all appointments
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment

### Billing Service (5002)

- POST `/api/billing/calculate` - Calculate bill
- GET `/api/billing/:appointment_id` - Get bill by appointment ID
- GET `/api/billing` - Get all bills

## Technology Stack

- **Languages**: JavaScript, TypeScript, Python
- **Frameworks**: Express.js, Flask
- **Authentication**: JWT (jsonwebtoken)
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Project Structure

```
healthcare-system/
├── services/
│   ├── auth-service/       (Node.js/JavaScript)
│   ├── patient-service/    (Python/Flask)
│   ├── doctor-service/     (Node.js/TypeScript)
│   ├── appointment-service/ (Node.js/JavaScript)
│   └── billing-service/    (Python/Flask)
├── docker-compose.yml
├── package.json
└── README.md
```

## License

ISC
