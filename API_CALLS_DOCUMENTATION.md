# API Calls Mapping - Healthcare System

## Overview

This document provides a comprehensive mapping of all inter-service REST API calls within the healthcare management system.

## Summary Statistics

- **Total Inter-Service API Calls**: 4
- **Source Services**: 1 (appointment-service)
- **Destination Services**: 3 (patient-service, doctor-service, billing-service)
- **HTTP Methods Used**: GET (3 calls), POST (1 call)

## Service Communication Architecture

```
┌─────────────────────────────────────────┐
│       Appointment Service (3003)        │
│     Orchestration/Aggregator Service    │
└────┬──────────────┬──────────────┬──────┘
     │              │              │
     │ GET          │ GET          │ POST
     │              │              │
     ▼              ▼              ▼
┌─────────┐    ┌─────────┐   ┌──────────┐
│ Patient │    │ Doctor  │   │ Billing  │
│ Service │    │ Service │   │ Service  │
│  (5001) │    │ (3002)  │   │  (5002)  │
└─────────┘    └─────────┘   └──────────┘
```

## API Call Details

### 1. Patient Verification (CREATE Appointment)

- **Source**: appointment-service (Port 3003)
- **Destination**: patient-service (Port 5001)
- **File**: `services/appointment-service/app/controllers/appointmentController.js`
- **Line**: 29-30
- **Endpoint**: `/api/patients/${patient_id}`
- **Method**: GET
- **Purpose**: Verify patient exists before creating appointment
- **Flow**:
  1. Receives `patient_id` from request body
  2. Makes GET request to patient service
  3. Checks if patient exists
  4. Returns 404 if patient not found
  5. Continues appointment creation if patient exists

### 2. Doctor Verification (CREATE Appointment)

- **Source**: appointment-service (Port 3003)
- **Destination**: doctor-service (Port 3002)
- **File**: `services/appointment-service/app/controllers/appointmentController.js`
- **Line**: 44-45
- **Endpoint**: `/api/doctors/${doctor_id}`
- **Method**: GET
- **Purpose**: Verify doctor exists before creating appointment
- **Flow**:
  1. Receives `doctor_id` from request body
  2. Makes GET request to doctor service
  3. Checks if doctor exists
  4. Returns 404 if doctor not found
  5. Continues appointment creation if doctor exists

### 3. Billing Record Creation (CREATE Appointment)

- **Source**: appointment-service (Port 3003)
- **Destination**: billing-service (Port 5002)
- **File**: `services/appointment-service/app/controllers/appointmentController.js`
- **Line**: 69-70
- **Endpoint**: `/api/billing/calculate`
- **Method**: POST
- **Purpose**: Create billing record for the appointment
- **Request Body**:

  ```json
  {
    "appointment_id": <created_appointment_id>,
    "patient_id": <patient_id>,
    "doctor_id": <doctor_id>,
    "service_type": "consultation"
  }
  ```

- **Response Used**: `billingResponse.data.bill.id`
- **Flow**:
  1. After successful appointment creation
  2. Makes POST request to billing service
  3. Receives bill ID from response
  4. Attaches billing_id to appointment
  5. **Note**: Fails gracefully - appointment still created even if billing fails

### 4. Doctor Verification (UPDATE Appointment)

- **Source**: appointment-service (Port 3003)
- **Destination**: doctor-service (Port 3002)
- **File**: `services/appointment-service/app/controllers/appointmentController.js`
- **Line**: 133-134
- **Endpoint**: `/api/doctors/${data.doctor_id}`
- **Method**: GET
- **Purpose**: Verify new doctor exists when updating appointment
- **Flow**:
  1. Only executed if `doctor_id` is being changed in update
  2. Makes GET request to doctor service
  3. Checks if new doctor exists
  4. Returns 404 if doctor not found
  5. Continues update if doctor exists

## Call Sequence During Appointment Creation

```
1. Client → POST /api/appointments → Appointment Service
                                            ↓
2. Appointment Service → GET /api/patients/{id} → Patient Service
                                            ↓
                                    (Verify Patient)
                                            ↓
3. Appointment Service → GET /api/doctors/{id} → Doctor Service
                                            ↓
                                    (Verify Doctor)
                                            ↓
4. Appointment Service creates appointment locally
                                            ↓
5. Appointment Service → POST /api/billing/calculate → Billing Service
                                            ↓
                                    (Create Bill)
                                            ↓
6. Appointment Service ← bill.id ← Billing Service
                                            ↓
7. Client ← Appointment Created ← Appointment Service
```

## Environment Variables for Service URLs

The appointment service uses these environment variables to locate other services:

```javascript
PATIENT_SERVICE_URL  = process.env.PATIENT_SERVICE_URL || "http://localhost:5001"
DOCTOR_SERVICE_URL   = process.env.DOCTOR_SERVICE_URL || "http://localhost:3002"
BILLING_SERVICE_URL  = process.env.BILLING_SERVICE_URL || "http://localhost:5002"
```

## Error Handling Strategy

### Critical Calls (Fail-Fast)

1. **Patient Verification**: Returns 404 immediately if patient service fails
2. **Doctor Verification**: Returns 404 immediately if doctor service fails
3. **Doctor Update Verification**: Returns 404 immediately if doctor service fails

### Non-Critical Calls (Fail-Safe)

1. **Billing Creation**: Logs error but continues appointment creation
   - Rationale: Billing can be added/corrected later
   - Allows appointment booking even if billing service is temporarily down

## HTTP Client Used

All API calls use **Axios** HTTP client:

- Installed via: `npm install axios`
- Imported: `const axios = require("axios");`
- Methods used: `axios.get()`, `axios.post()`

## No Circular Dependencies

The system has a clean dependency hierarchy:

```
appointment-service (calls ↓)
    ├─→ patient-service (no outgoing calls)
    ├─→ doctor-service (no outgoing calls)
    └─→ billing-service (no outgoing calls)

auth-service (no outgoing calls - standalone authentication)
```

**No service calls back to appointment-service**, preventing circular dependencies.

## Response Data Structure Expected

### Patient Service Response

```json
{
  "patient": {
    "id": number,
    "name": string,
    "email": string,
    ...
  }
}
```

### Doctor Service Response

```json
{
  "doctor": {
    "id": number,
    "name": string,
    "email": string,
    ...
  }
}
```

### Billing Service Response

```json
{
  "message": "Bill calculated successfully",
  "bill": {
    "id": number,
    "total_amount": number,
    ...
  }
}
```

## CSV File Location

Complete details available in: `api_calls_mapping.csv`

## Future Considerations

If expanding the system:

1. **Add Circuit Breaker**: Prevent cascading failures if services are down
2. **Add Retry Logic**: Retry failed calls with exponential backoff
3. **Add Timeout Configuration**: Set request timeouts per service
4. **Add Request/Response Logging**: Log all inter-service calls for debugging
5. **Add Service Discovery**: Use Consul/Eureka instead of hardcoded URLs
6. **Add API Gateway**: Centralize routing and authentication
7. **Add Correlation IDs**: Track requests across services

## Testing Inter-Service Calls

To test these API calls:

1. Ensure all services are running
2. Create test data in patient and doctor services
3. Use appointment service endpoints
4. Monitor logs in all services
5. Check billing service for automatic bill creation

Example test sequence:

```bash
# 1. Create patient
curl -X POST http://localhost:5001/api/patients -d '{"name":"Test","email":"test@test.com",...}'

# 2. Create doctor  
curl -X POST http://localhost:3002/api/doctors -d '{"name":"Dr. Test","email":"dr@test.com",...}'

# 3. Create appointment (triggers 3 API calls internally)
curl -X POST http://localhost:3003/api/appointments -d '{"patient_id":1,"doctor_id":1,...}'

# 4. Verify billing was created
curl http://localhost:5002/api/billing/appointment/1
```
