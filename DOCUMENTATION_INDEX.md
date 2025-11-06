# 📚 Healthcare System - Documentation Index

Welcome to the Healthcare Management System documentation. This index will help you find the information you need.

## 🚀 Getting Started

If you're new to this project, start here:

1. **[README.md](README.md)** - Project overview and introduction
2. **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step setup guide
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project accomplishments

## 📖 Core Documentation

### Architecture & Design

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture, service details, and communication flow
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Detailed file structure and folder organization

### API Documentation

- **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** - Complete API endpoints with curl examples
- **[postman_collection.json](postman_collection.json)** - Importable Postman collection for API testing

### Inter-Service Communication

- **[api_calls_mapping.csv](api_calls_mapping.csv)** - ⭐ CSV file with all API calls (YOUR REQUESTED FILE)
- **[API_CALLS_DOCUMENTATION.md](API_CALLS_DOCUMENTATION.md)** - Detailed inter-service API call documentation
- **[API_CALLS_SUMMARY.md](API_CALLS_SUMMARY.md)** - Summary of API calls extraction

## 🗂️ Quick Reference

### By Use Case

#### I want to run the project

→ [QUICKSTART.md](QUICKSTART.md)

#### I want to test the APIs

→ [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)
→ [postman_collection.json](postman_collection.json)

#### I want to understand the architecture

→ [ARCHITECTURE.md](ARCHITECTURE.md)
→ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

#### I want to analyze inter-service calls

→ [api_calls_mapping.csv](api_calls_mapping.csv) ⭐ **CSV FILE**
→ [API_CALLS_DOCUMENTATION.md](API_CALLS_DOCUMENTATION.md)
→ [API_CALLS_SUMMARY.md](API_CALLS_SUMMARY.md)

#### I want to see what was built

→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 📊 API Calls Analysis Files (NEW)

These files contain the inter-service communication mapping:

### 1. api_calls_mapping.csv ⭐

**The main deliverable you requested**

**Format**: CSV (comma-separated values)

**Columns**:

- File Path
- Source Service
- Source Port
- Destination Service
- Destination Port
- Line Number
- Endpoint Pattern
- Full URL Pattern
- HTTP Method
- Controller Method
- Purpose
- Request Body/Params
- Response Data Used
- Error Handling

**Total Calls**: 4 inter-service API calls

**Can be opened in**: Excel, Google Sheets, any CSV reader

### 2. API_CALLS_DOCUMENTATION.md

**Comprehensive documentation**

Contains:

- Service communication architecture diagram
- Detailed explanation of each API call
- Call sequence diagrams
- Error handling strategies
- Environment variables
- Testing instructions

### 3. API_CALLS_SUMMARY.md

**Quick overview**

Contains:

- Summary statistics
- API calls breakdown by service
- Key findings
- Architecture insights
- Use cases for the mapping data

## 📁 File Organization

```
healthcare-system/
├── Documentation Files
│   ├── README.md                      (Start here)
│   ├── QUICKSTART.md                  (Setup guide)
│   ├── PROJECT_SUMMARY.md             (What was built)
│   ├── ARCHITECTURE.md                (System design)
│   ├── PROJECT_STRUCTURE.md           (File structure)
│   ├── API_TESTING_GUIDE.md           (API reference)
│   ├── api_calls_mapping.csv          (API calls CSV) ⭐
│   ├── API_CALLS_DOCUMENTATION.md     (API calls docs)
│   ├── API_CALLS_SUMMARY.md           (API calls summary)
│   └── DOCUMENTATION_INDEX.md         (This file)
│
├── Configuration Files
│   ├── package.json                   (Root dependencies)
│   ├── docker-compose.yml             (Docker orchestration)
│   ├── postman_collection.json        (API collection)
│   └── .gitignore                     (Git ignore rules)
│
└── services/                          (Microservices code)
    ├── auth-service/                  (Node.js/JavaScript)
    ├── patient-service/               (Python/Flask)
    ├── doctor-service/                (Node.js/TypeScript)
    ├── appointment-service/           (Node.js/JavaScript)
    └── billing-service/               (Python/Flask)
```

## 🎯 Service Overview

| Service | Port | Technology | Documentation |
|---------|------|------------|---------------|
| auth-service | 3001 | Node.js/JavaScript | [ARCHITECTURE.md](ARCHITECTURE.md#1-auth-service-javascriptnodejs) |
| patient-service | 5001 | Python/Flask | [ARCHITECTURE.md](ARCHITECTURE.md#2-patient-service-pythonflask) |
| doctor-service | 3002 | Node.js/TypeScript | [ARCHITECTURE.md](ARCHITECTURE.md#3-doctor-service-typescriptnodejs) |
| appointment-service | 3003 | Node.js/JavaScript | [ARCHITECTURE.md](ARCHITECTURE.md#4-appointment-service-javascriptnodejs) |
| billing-service | 5002 | Python/Flask | [ARCHITECTURE.md](ARCHITECTURE.md#5-billing-service-pythonflask) |

## 🔗 Inter-Service Communication

The **appointment-service** is the only service that makes calls to other services:

```
appointment-service (Port 3003)
    ├─→ patient-service (Port 5001)  - Verify patient exists
    ├─→ doctor-service (Port 3002)   - Verify doctor exists (2 calls)
    └─→ billing-service (Port 5002)  - Create billing record
```

**Details**: See [api_calls_mapping.csv](api_calls_mapping.csv)

## 📋 Cheat Sheet

### Run the Project

```bash
docker-compose up --build
```

### Test an API

```bash
curl http://localhost:3001/health
curl http://localhost:5001/api/patients
```

### View API Calls Data

```bash
# Open CSV in Excel or:
cat api_calls_mapping.csv
```

### Import Postman Collection

1. Open Postman
2. Import → Upload Files
3. Select `postman_collection.json`

## 🎓 Learning Path

**Beginner**:

1. Read [README.md](README.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Test APIs with [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

**Intermediate**:

1. Study [ARCHITECTURE.md](ARCHITECTURE.md)
2. Explore [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
3. Review [api_calls_mapping.csv](api_calls_mapping.csv)

**Advanced**:

1. Analyze [API_CALLS_DOCUMENTATION.md](API_CALLS_DOCUMENTATION.md)
2. Understand service orchestration patterns
3. Modify and extend services

## 📞 Support

For detailed information on specific topics:

- **Setup Issues**: [QUICKSTART.md](QUICKSTART.md) → Troubleshooting section
- **API Errors**: [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) → Examples section
- **Architecture Questions**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Service Dependencies**: [api_calls_mapping.csv](api_calls_mapping.csv)

## ✨ Highlights

### ⭐ NEW: API Calls Extraction

Three new files document all inter-service communication:

- **CSV format** for data analysis
- **Detailed documentation** for understanding
- **Summary** for quick reference

### 🎯 Key Features

- 5 independent microservices
- REST-only communication
- Multiple programming languages
- Docker containerization
- Comprehensive documentation

### 📊 By The Numbers

- **Total Services**: 5
- **Total API Endpoints**: 27+
- **Total Documentation Files**: 10+
- **Total Source Files**: 50+
- **Inter-Service API Calls**: 4
- **Programming Languages**: 3 (JavaScript, TypeScript, Python)

---

**Last Updated**: November 6, 2025
**Project Status**: ✅ Complete and Ready to Use

For the latest updates, check the [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
