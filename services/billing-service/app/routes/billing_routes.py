from flask import Blueprint, request, jsonify
from app.controllers.billing_controller import BillingController

billing_bp = Blueprint('billing', __name__)
controller = BillingController()

@billing_bp.route('/calculate', methods=['POST'])
def calculate_bill():
    return controller.calculate(request)

@billing_bp.route('/<int:bill_id>', methods=['GET'])
def get_bill(bill_id):
    return controller.get_by_id(bill_id)

@billing_bp.route('/appointment/<int:appointment_id>', methods=['GET'])
def get_bill_by_appointment(appointment_id):
    return controller.get_by_appointment(appointment_id)

@billing_bp.route('', methods=['GET'])
def get_all_bills():
    return controller.get_all()

@billing_bp.route('/<int:bill_id>/p', methods=['POST'])
def pay_bill(bill_id):
    return controller.mark_as_paid(bill_id, request)

@billing_bp.route('/pat/<int:patient_id>', methods=['GET'])
def get_bills_by_patient(patient_id):
    """Get all bills for a specific patient"""
    bills = [b for b in controller.model.get_all() if b['patient_id'] == patient_id]
    return jsonify({'bills': bills, 'count': len(bills)}), 200

@billing_bp.route('/patient/<int:patient_id>/archive', methods=['PUT'])
def archive_patient_bills(patient_id):
    """Archive all bills for a patient (used when deleting patient)"""
    bills = [b for b in controller.model.get_all() if b['patient_id'] == patient_id]
    for bill in bills:
        controller.model.update(bill['id'], {'status': 'archived'})
    return jsonify({'message': f'Archived {len(bills)} bills'}), 200

@billing_bp.route('/<int:bill_id>', methods=['PUT'])
def update_bill_status(bill_id):
    """Update bill status"""
    data = request.get_json()
    bill = controller.model.find_by_id(bill_id)
    if not bill:
        return jsonify({'error': 'Bill not found'}), 404
    updated_bill = controller.model.update(bill_id, data)
    return jsonify({'bill': updated_bill}), 200
