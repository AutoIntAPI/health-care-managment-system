from flask import Blueprint, request, jsonify
from app.controllers.patient_controller import PatientController

patient_bp = Blueprint('patient', __name__)
controller = PatientController()

@patient_bp.route('', methods=['POST'])
def create_patient():
    return controller.create(request)

@patient_bp.route('/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    return controller.get_by_id(patient_id)

@patient_bp.route('', methods=['GET'])
def get_all_patients():
    return controller.get_all()

@patient_bp.route('/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    return controller.update(patient_id, request)

@patient_bp.route('/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    return controller.delete(patient_id)

@patient_bp.route('/<int:patient_id>/deliver', methods=['POST'])
def notify_patient(patient_id):
    """Endpoint to notify patient (used by other services)"""
    data = request.get_json()
    message = data.get('message', 'No message')
    print(f"Notification sent to patient {patient_id}: {message}")
    return jsonify({'message': 'Notification sent successfully'}), 200
