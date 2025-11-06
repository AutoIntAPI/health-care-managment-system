# Quick Start Guide

## Prerequisites

- **Docker & Docker Compose** (Recommended) OR
- **Node.js 18+** and **Python 3.9+** for local development

## Option 1: Docker (Recommended)

### Start All Services

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up
```

All services will be available at:

- Auth Service: <http://localhost:3001>
- Patient Service: <http://localhost:5001>
- Doctor Service: <http://localhost:3002>
- Appointment Service: <http://localhost:3003>
- Billing Service: <http://localhost:5002>

### Stop All Services

```bash
docker-compose down
```

## Option 2: Local Development

### 1. Install Dependencies

```bash
# Install auth-service dependencies
cd services/auth-service
npm install
cd ../..

# Install appointment-service dependencies
cd services/appointment-service
npm install
cd ../..

# Install doctor-service dependencies
cd services/doctor-service
npm install
cd ../..

# Install patient-service dependencies
cd services/patient-service
pip install -r requirements.txt
cd ../..

# Install billing-service dependencies
cd services/billing-service
pip install -r requirements.txt
cd ../..
```

### 2. Start Services (in separate terminals)

**Terminal 1 - Auth Service:**

```bash
cd services/auth-service
npm start
```

**Terminal 2 - Patient Service:**

```bash
cd services/patient-service
python app.py
```

**Terminal 3 - Doctor Service:**

```bash
cd services/doctor-service
npm run build
npm start
```

**Terminal 4 - Appointment Service:**

```bash
cd services/appointment-service
npm start
```

**Terminal 5 - Billing Service:**

```bash
cd services/billing-service
python app.py
```

## Verify Services are Running

```bash
# Check all health endpoints
curl http://localhost:3001/health
curl http://localhost:5001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:5002/health
```

All should return `{"status": "OK", "service": "service-name"}`

## Quick Test

### 1. Create a Patient

```bash
curl -X POST http://localhost:5001/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "phone": "1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "Male",
    "address": "123 Test St"
  }'
```

### 2. Create a Doctor

```bash
curl -X POST http://localhost:3002/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "dr.smith@test.com",
    "phone": "0987654321",
    "specialization": "Cardiology",
    "license_number": "LIC001"
  }'
```

### 3. Book an Appointment

```bash
curl -X POST http://localhost:3003/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2025-11-20",
    "appointment_time": "10:00",
    "reason": "Checkup"
  }'
```

### 4. Check the Bill

```bash
curl http://localhost:5002/api/billing/appointment/1
```

## Next Steps

- See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for complete API documentation
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system architecture details
- See [README.md](README.md) for project overview

## Troubleshooting

### Port Already in Use

If you get a port conflict error, you can change the ports in:

- `docker-compose.yml` for Docker deployment
- `.env` files in each service for local deployment

### Docker Issues

```bash
# Clean up Docker containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

### Python Dependencies Issues

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Node.js Dependencies Issues

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```
