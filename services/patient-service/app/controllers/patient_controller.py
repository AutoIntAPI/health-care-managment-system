from flask import jsonify
import requests
from requests.exceptions import RequestException
import os
from app.models.patient_model import PatientModel

# Service URLs for inter-service communication
APPOINTMENT_SERVICE_URL = os.getenv('APPOINTMENT_SERVICE_URL', 'http://localhost:3003')
BILLING_SERVICE_URL = os.getenv('BILLING_SERVICE_URL', 'http://localhost:5002')
AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://localhost:3001')

class PatientController:
    def __init__(self):
        self.model = PatientModel()

    def create(self, request):
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'email', 'phone', 'date_of_birth', 'gender', 'address']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            # Check if patient with email already exists
            if self.model.find_by_email(data['email']):
                return jsonify({'error': 'Patient with this email already exists'}), 409

            patient = self.model.create(data)
            return jsonify({
                'message': 'Patient created successfully',
                'patient': patient
            }), 201

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_by_id(self, patient_id):
        try:
            patient = self.model.find_by_id(patient_id)
            if not patient:
                return jsonify({'error': 'Patient not found'}), 404
            
            # Fetch patient's appointments via REST API call
            try:
                appointments_response = requests.get(
                    f"{APPOINTMENT_SERVICE_URL}/api/appointments/patient/{patient_id}",
                    timeout=5
                )
                if appointments_response.status_code == 200:
                    patient['appointments'] = appointments_response.json().get('appointments', [])
            except Exception as e:
                print(f"Failed to fetch appointments: {str(e)}")
                patient['appointments'] = []

            # Fetch patient's billing history via REST API call
            try:
                billing_response = requests.get(
                    f"{BILLING_SERVICE_URL}/api/billing/patient/{patient_id}",
                    timeout=5
                )
                if billing_response.status_code == 200:
                    patient['billing_history'] = billing_response.json().get('bills', [])
            except Exception as e:
                print(f"Failed to fetch billing history: {str(e)}")
                patient['billing_history'] = []
            
            return jsonify({'patient': patient}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_all(self):
        try:
            patients = self.model.get_all()
            return jsonify({'patients': patients, 'count': len(patients)}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def update(self, patient_id, request):
        try:
            data = request.get_json()
            
            if not self.model.find_by_id(patient_id):
                return jsonify({'error': 'Patient not found'}), 404

            # Check email uniqueness if email is being updated
            if 'email' in data:
                existing = self.model.find_by_email(data['email'])
                if existing and existing['id'] != patient_id:
                    return jsonify({'error': 'Email already in use'}), 409

            patient = self.model.update(patient_id, data)
            return jsonify({
                'message': 'Patient updated successfully',
                'patient': patient
            }), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def delete(self, patient_id):
        try:
            patient = self.model.find_by_id(patient_id)
            if not patient:
                return jsonify({'error': 'Patient not found'}), 404

            # Cancel all patient appointments via REST API call
            try:
                cancel_response = requests.delete(
                    f"{APPOINTMENT_SERVICE_URL}/api/appointments/patient/{patient_id}",
                    timeout=5
                )
                print(f"Cancelled appointments: {cancel_response.status_code}")
            except RequestException as e:
                print(f"Failed to cancel appointments: {str(e)}")

            # Archive patient billing records via REST API call
            try:
                archive_response = requests.put(
                    f"{BILLING_SERVICE_URL}/api/billing/patient/{patient_id}/archive",
                    timeout=5
                )
                print(f"Archived billing records: {archive_response.status_code}")
            except RequestException as e:
                print(f"Failed to archive billing: {str(e)}")

            self.model.delete(patient_id)
            return jsonify({'message': 'Patient deleted successfully'}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
