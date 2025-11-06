# Healthcare System API Testing Guide

## Overview

This guide provides examples for testing all microservices REST APIs using curl or any HTTP client.

---

## 1. Auth Service (Port 3001)

### Register a New User

**Doctor:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@hospital.com",
    "password": "password123",
    "name": "Dr. John Smith",
    "role": "doctor"
  }'
```

**Patient:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@email.com",
    "password": "password123",
    "name": "Jane Doe",
    "role": "patient"
  }'
```

**Admin:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "password123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@hospital.com",
    "password": "password123"
  }'
```

Response will include a JWT token. Save it for authenticated requests.

### Verify Token

```bash
curl -X GET http://localhost:3001/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 2. Patient Service (Port 5001)

### Create Patient

```bash
curl -X POST http://localhost:5001/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@email.com",
    "phone": "+1234567890",
    "date_of_birth": "1990-05-15",
    "gender": "Female",
    "address": "123 Main St, City, State 12345",
    "blood_type": "O+",
    "allergies": ["Penicillin"],
    "medical_history": ["Diabetes"],
    "emergency_contact": {
      "name": "John Doe",
      "phone": "+1234567891",
      "relationship": "Spouse"
    }
  }'
```

### Get All Patients

```bash
curl -X GET http://localhost:5001/api/patients
```

### Get Patient by ID

```bash
curl -X GET http://localhost:5001/api/patients/1
```

### Update Patient

```bash
curl -X PUT http://localhost:5001/api/patients/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1987654320",
    "address": "456 Oak Ave, City, State 12345"
  }'
```

### Delete Patient

```bash
curl -X DELETE http://localhost:5001/api/patients/1
```

---

## 3. Doctor Service (Port 3002)

### Create Doctor

```bash
curl -X POST http://localhost:3002/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "dr.smith@hospital.com",
    "phone": "+1234567892",
    "specialization": "Cardiology",
    "license_number": "MD12345",
    "years_of_experience": 15,
    "qualification": "MD, MBBS",
    "consultation_fee": 150,
    "rating": 4.8
  }'
```

### Get All Doctors

```bash
curl -X GET http://localhost:3002/api/doctors
```

### Get Doctor by ID

```bash
curl -X GET http://localhost:3002/api/doctors/1
```

### Update Doctor

```bash
curl -X PUT http://localhost:3002/api/doctors/1 \
  -H "Content-Type: application/json" \
  -d '{
    "consultation_fee": 175,
    "rating": 4.9
  }'
```

### Set Doctor Availability

```bash
curl -X POST http://localhost:3002/api/doctors/1/availability \
  -H "Content-Type: application/json" \
  -d '{
    "availability": [
      {
        "day": "Monday",
        "start_time": "09:00",
        "end_time": "17:00",
        "is_available": true
      },
      {
        "day": "Tuesday",
        "start_time": "09:00",
        "end_time": "17:00",
        "is_available": true
      },
      {
        "day": "Wednesday",
        "start_time": "09:00",
        "end_time": "13:00",
        "is_available": true
      }
    ]
  }'
```

### Get Doctor Availability

```bash
curl -X GET http://localhost:3002/api/doctors/1/availability
```

### Delete Doctor

```bash
curl -X DELETE http://localhost:3002/api/doctors/1
```

---

## 4. Appointment Service (Port 3003)

### Create Appointment

```bash
curl -X POST http://localhost:3003/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2025-11-15",
    "appointment_time": "10:00",
    "reason": "Regular checkup"
  }'
```

### Get All Appointments

```bash
curl -X GET http://localhost:3003/api/appointments
```

### Get Appointment by ID

```bash
curl -X GET http://localhost:3003/api/appointments/1
```

### Get Appointments by Patient

```bash
curl -X GET http://localhost:3003/api/appointments/patient/1
```

### Get Appointments by Doctor

```bash
curl -X GET http://localhost:3003/api/appointments/doctor/1
```

### Update Appointment

```bash
curl -X PUT http://localhost:3003/api/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_date": "2025-11-16",
    "appointment_time": "11:00",
    "status": "rescheduled"
  }'
```

### Cancel Appointment

```bash
curl -X DELETE http://localhost:3003/api/appointments/1
```

---

## 5. Billing Service (Port 5002)

### Calculate Bill

```bash
curl -X POST http://localhost:5002/api/billing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "service_type": "consultation",
    "additional_charges": 25.00,
    "description": "Regular consultation with lab tests"
  }'
```

**Available Service Types:**

- `consultation` - $100
- `follow_up` - $75
- `emergency` - $200
- `surgery` - $1500
- `lab_test` - $50
- `x_ray` - $150
- `mri` - $800

### Get All Bills

```bash
curl -X GET http://localhost:5002/api/billing
```

### Get Bill by ID

```bash
curl -X GET http://localhost:5002/api/billing/1
```

### Get Bill by Appointment ID

```bash
curl -X GET http://localhost:5002/api/billing/appointment/1
```

### Mark Bill as Paid

```bash
curl -X POST http://localhost:5002/api/billing/1/pay \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "credit_card",
    "transaction_id": "TXN123456789"
  }'
```

---

## Testing Workflow Example

### Complete Patient Journey

1. **Register Patient User**

   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "patient@test.com", "password": "pass123", "name": "Test Patient", "role": "patient"}'
   ```

2. **Create Patient Record**

   ```bash
   curl -X POST http://localhost:5001/api/patients \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Patient", "email": "patient@test.com", "phone": "1234567890", "date_of_birth": "1995-01-01", "gender": "Male", "address": "123 Test St"}'
   ```

3. **Create Doctor**

   ```bash
   curl -X POST http://localhost:3002/api/doctors \
     -H "Content-Type: application/json" \
     -d '{"name": "Dr. Test", "email": "doctor@test.com", "phone": "9876543210", "specialization": "General", "license_number": "LIC001"}'
   ```

4. **Book Appointment**

   ```bash
   curl -X POST http://localhost:3003/api/appointments \
     -H "Content-Type: application/json" \
     -d '{"patient_id": 1, "doctor_id": 1, "appointment_date": "2025-11-20", "appointment_time": "10:00", "reason": "Checkup"}'
   ```

5. **Check Generated Bill**

   ```bash
   curl -X GET http://localhost:5002/api/billing/appointment/1
   ```

6. **Pay Bill**

   ```bash
   curl -X POST http://localhost:5002/api/billing/1/pay \
     -H "Content-Type: application/json" \
     -d '{"payment_method": "cash", "transaction_id": "CASH001"}'
   ```

---

## Health Checks

Check if all services are running:

```bash
# Auth Service
curl http://localhost:3001/health

# Patient Service
curl http://localhost:5001/health

# Doctor Service
curl http://localhost:3002/health

# Appointment Service
curl http://localhost:3003/health

# Billing Service
curl http://localhost:5002/health
```

---

## Notes

- All services run independently
- Services communicate via REST API calls
- No database persistence (in-memory storage)
- JWT tokens are required for protected routes in auth service
- Appointment service orchestrates calls to patient, doctor, and billing services
- All dates should be in ISO format (YYYY-MM-DD)
- Times should be in HH:MM format
