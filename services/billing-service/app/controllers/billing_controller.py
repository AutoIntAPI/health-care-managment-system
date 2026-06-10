from flask import jsonify
import requests
import os
from app.models.billing_model import BillingModel

# Service URLs for inter-service communication
PATIENT_SERVICE_URL = os.getenv('PATIENT_SERVICE_URL', 'http://localhost:5001')
DOCTOR_SERVICE_URL = os.getenv('DOCTOR_SERVICE_URL', 'http://localhost:3002')
APPOINTMENT_SERVICE_URL = os.getenv('APPOINTMENT_SERVICE_URL', 'http://localhost:3003')

class BillingController:
    def __init__(self):
        self.model = BillingModel()
        # Service pricing
        self.service_rates = {
            'consultation': 100.00,
            'follow_up': 75.00,
            'emergency': 200.00,
            'surgery': 1500.00,
            'lab_test': 50.00,
            'x_ray': 150.00,
            'mri': 800.00
        }
        self.tax_rate = 0.08  # 8% tax

    def calculate(self, request):
        data = request.get_json()

        # Validate required fields
        required_fields = ['appointment_id', 'patient_id', 'doctor_id', 'service_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Verify patient exists via REST API call
        try:
            patient_response = requests.get(
                f"{PATIENT_SERVICE_URL}/api/patients/{data['patient_id']}",
                timeout=5
            )
            if patient_response.status_code != 200:
                return jsonify({'error': 'Patient not found'}), 404
        except requests.exceptions.RequestException as e:
            print(f"Failed to verify patient: {str(e)}")
            return jsonify({'error': 'Patient service unavailable'}), 503

        # Verify doctor exists via REST API call
        try:
            doctor_response = requests.get(
                f"{DOCTOR_SERVICE_URL}/api/doctors/{data['doctor_id']}",
                timeout=5
            )
            if doctor_response.status_code != 200:
                return jsonify({'error': 'Doctor not found'}), 404
        except requests.exceptions.RequestException as e:
            print(f"Failed to verify doctor: {str(e)}")
            return jsonify({'error': 'Doctor service unavailable'}), 503

        service_type = data['service_type']
        if service_type not in self.service_rates:
            return jsonify({'error': f'Invalid service type. Valid types: {list(self.service_rates.keys())}'}), 400

        # Determine base amount
        if service_type == 'consultation':
            try:
                fee_response = requests.get(
                    f"{DOCTOR_SERVICE_URL}/api/doctors/{data['doctor_id']}/consultation-fee",
                    timeout=5
                )
                fee_response.raise_for_status()
                fee_data = fee_response.json()
                base_amount = fee_data.get('consultation_fee', self.service_rates['consultation'])
            except requests.exceptions.RequestException as e:
                print(f"Failed to fetch consultation fee: {str(e)}")
                return jsonify({'error': 'Unable to retrieve consultation fee'}), 502
        else:
            base_amount = self.service_rates[service_type]

        # Add additional charges if provided
        additional_charges = data.get('additional_charges', 0)
        subtotal = base_amount + additional_charges

        # Calculate tax
        tax_amount = subtotal * self.tax_rate

        # Total amount
        total_amount = subtotal + tax_amount

        bill = self.model.create({
            'appointment_id': data['appointment_id'],
            'patient_id': data['patient_id'],
            'doctor_id': data['doctor_id'],
            'service_type': service_type,
            'base_amount': base_amount,
            'additional_charges': additional_charges,
            'subtotal': subtotal,
            'tax_amount': tax_amount,
            'total_amount': total_amount,
            'status': 'pending',
            'description': data.get('description', f'{service_type} service')
        })

        return jsonify({
            'message': 'Bill calculated successfully',
            'bill': bill
        }), 201
                'description': data.get('description', f'{service_type} service')
            })
        bill = self.model.find_by_id(bill_id)
        if not bill:
            return jsonify({'error': 'Bill not found'}), 404
        return jsonify({'bill': bill}), 200
    def get_by_id(self, bill_id):
    def get_by_appointment(self, appointment_id):
        try:
        bills = self.model.get_all()
        return jsonify({'bills': bills, 'count': len(bills)}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        data = request.get_json()
        bill = self.model.find_by_id(bill_id)
        if not bill:
            return jsonify({'error': 'Bill not found'}), 404

        if bill['status'] == 'paid':
            return jsonify({'error': 'Bill already paid'}), 400

        payment_method = data.get('payment_method', 'cash')
        transaction_id = data.get('transaction_id', '')

        # Notify patient about payment confirmation via REST API call
        try:
            notify_response = requests.post(
                f"{PATIENT_SERVICE_URL}/api/patients/{bill['patient_id']}/notify",
                json={
                    'message': f'Payment received for bill #{bill_id}',
                    'bill_id': bill_id,
                    'amount': bill['total_amount']
                },
                timeout=5
            )
            print(f"Patient notified: {notify_response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to notify patient: {str(e)}")

        updated_bill = self.model.update(bill_id, {
            'status': 'paid',
            'payment_method': payment_method,
            'transaction_id': transaction_id,
            'paid_at': self.model.get_current_timestamp()
        })

        return jsonify({
            'message': 'Bill marked as paid successfully',
            'bill': updated_bill
        }), 200
                'paid_at': self.model.get_current_timestamp()
            })

            return jsonify({
                'message': 'Bill marked as paid successfully',
                'bill': updated_bill
            }), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
