# API Calls Extraction - Summary

## ✅ Extraction Complete

I've successfully extracted all inter-service REST API calls from the healthcare management system and documented them in CSV format.

## 📊 Files Created

1. **`api_calls_mapping.csv`** - Detailed CSV with all API call information
2. **`API_CALLS_DOCUMENTATION.md`** - Comprehensive documentation with flows and diagrams

## 📈 Summary Statistics

- **Total API Calls Identified**: 4
- **Source Services**: 1 (appointment-service only)
- **Destination Services**: 3 (patient-service, doctor-service, billing-service)
- **HTTP Methods**: GET (3), POST (1)
- **Files Analyzed**: All service controller files

## 🔍 API Calls Breakdown

### By Destination Service

| Destination Service | Number of Calls | HTTP Methods |
|---------------------|-----------------|--------------|
| patient-service     | 1               | GET          |
| doctor-service      | 2               | GET          |
| billing-service     | 1               | POST         |

### By Operation Context

| Context                  | Calls | Purpose                          |
|--------------------------|-------|----------------------------------|
| Appointment Creation     | 3     | Verify patient, doctor, create bill |
| Appointment Update       | 1     | Verify new doctor if changed     |

## 📋 CSV Structure

The CSV file includes these columns:

1. **File Path** - Exact location of the API call
2. **Source Service** - Service making the call
3. **Source Port** - Port of source service
4. **Destination Service** - Service receiving the call
5. **Destination Port** - Port of destination service
6. **Line Number** - Line range in source file
7. **Endpoint Pattern** - API endpoint template
8. **Full URL Pattern** - Complete URL with variables
9. **HTTP Method** - GET, POST, PUT, DELETE, etc.
10. **Controller Method** - Function name making the call
11. **Purpose** - Why this call is made
12. **Request Body/Params** - Data sent in the request
13. **Response Data Used** - What data is extracted from response
14. **Error Handling** - How errors are handled

## 🎯 Key Findings

### 1. Single Orchestrator Pattern

- **Only appointment-service** makes inter-service calls
- Acts as an orchestrator/aggregator service
- Other services are completely independent

### 2. No Circular Dependencies

- Clean unidirectional dependency flow
- No service calls back to appointment-service
- Auth service is completely isolated (no outgoing calls)

### 3. Error Handling Strategy

- **Critical calls (patient/doctor verification)**: Fail-fast with 404
- **Non-critical calls (billing)**: Fail-safe, logs error but continues

### 4. Service Communication Flow

```
Appointment Service (Port 3003)
    │
    ├─→ GET  → Patient Service (Port 5001)  [Verify patient]
    ├─→ GET  → Doctor Service (Port 3002)   [Verify doctor]
    ├─→ POST → Billing Service (Port 5002)  [Create bill]
    └─→ GET  → Doctor Service (Port 3002)   [Verify on update]
```

## 📂 Complete Call Details

### Call #1: Patient Verification

- **Line**: 29-30
- **Endpoint**: `/api/patients/${patient_id}`
- **Method**: GET
- **When**: During appointment creation
- **Critical**: Yes (fails if patient not found)

### Call #2: Doctor Verification (Create)

- **Line**: 44-45
- **Endpoint**: `/api/doctors/${doctor_id}`
- **Method**: GET
- **When**: During appointment creation
- **Critical**: Yes (fails if doctor not found)

### Call #3: Billing Creation

- **Line**: 69-70
- **Endpoint**: `/api/billing/calculate`
- **Method**: POST
- **When**: After appointment created
- **Critical**: No (continues even if billing fails)

### Call #4: Doctor Verification (Update)

- **Line**: 133-134
- **Endpoint**: `/api/doctors/${data.doctor_id}`
- **Method**: GET
- **When**: When updating appointment with new doctor
- **Critical**: Yes (fails if new doctor not found)

## 🛠️ Technical Details

### HTTP Client

- **Library**: Axios
- **Installation**: `npm install axios`
- **Import**: `const axios = require("axios");`

### Service URL Configuration

```javascript
PATIENT_SERVICE_URL  = process.env.PATIENT_SERVICE_URL  || "http://localhost:5001"
DOCTOR_SERVICE_URL   = process.env.DOCTOR_SERVICE_URL   || "http://localhost:3002"
BILLING_SERVICE_URL  = process.env.BILLING_SERVICE_URL  || "http://localhost:5002"
```

### Request/Response Patterns

**GET Requests** (verification):

- Request: URL with resource ID
- Response: `{ "patient": {...} }` or `{ "doctor": {...} }`
- Error: Try-catch with 404 response

**POST Requests** (billing):

- Request: JSON body with appointment data
- Response: `{ "bill": { "id": ..., ... } }`
- Error: Try-catch with logging (non-blocking)

## 📊 Sequence Diagram

```
Client → Appointment Service
              ↓
         1. GET Patient (verify)
              ↓
         Patient Service
              ↓
         2. GET Doctor (verify)
              ↓
         Doctor Service
              ↓
         3. Create Appointment (internal)
              ↓
         4. POST Billing (create bill)
              ↓
         Billing Service
              ↓
         Return appointment + bill ID
              ↓
Client ← Appointment Service
```

## 🎓 Architecture Insights

1. **Microservices Pattern**: Clear separation of concerns
2. **Orchestration**: appointment-service coordinates multiple services
3. **REST Communication**: All calls use HTTP/REST (no message queues)
4. **Fail-Safe Design**: Non-critical operations continue on failure
5. **Data Validation**: External services validate data integrity

## 📦 Files Location

- **CSV Data**: `api_calls_mapping.csv` (machine-readable)
- **Documentation**: `API_CALLS_DOCUMENTATION.md` (human-readable)
- **This Summary**: `API_CALLS_SUMMARY.md` (overview)

## ✨ Use Cases

This mapping is useful for:

1. **Understanding Service Dependencies**
2. **Performance Optimization** (identify bottlenecks)
3. **Error Tracking** (trace failed inter-service calls)
4. **Security Auditing** (review all external calls)
5. **Documentation** (service integration guide)
6. **Testing** (integration test planning)
7. **Monitoring** (set up alerts for critical calls)

## 🔄 Import into Tools

The CSV file can be imported into:

- Excel/Google Sheets (data analysis)
- Lucidchart (visual diagrams)
- Draw.io (architecture diagrams)
- Postman (API testing)
- Monitoring tools (Datadog, New Relic)

---

**Generated**: November 6, 2025
**System**: Healthcare Management System
**Total Services**: 5
**Services with Outgoing Calls**: 1 (appointment-service)
