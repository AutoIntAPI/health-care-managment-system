from datetime import datetime

class BillingModel:
    def __init__(self):
        self.bills = []
        self.current_id = 1

    def create(self, data):
        bill = {
            'id': self.current_id,
            'appointment_id': data['appointment_id'],
            'patient_id': data['patient_id'],
            'doctor_id': data['doctor_id'],
            'service_type': data['service_type'],
            'description': data.get('description', ''),
            'base_amount': data['base_amount'],
            'additional_charges': data.get('additional_charges', 0),
            'subtotal': data['subtotal'],
            'tax_amount': data['tax_amount'],
            'total_amount': data['total_amount'],
            'status': data.get('status', 'pending'),  # pending, paid, cancelled
            'payment_method': data.get('payment_method', ''),
            'transaction_id': data.get('transaction_id', ''),
            'paid_at': data.get('paid_at', None),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        self.bills.append(bill)
        self.current_id += 1
        return bill

    def find_by_id(self, bill_id):
        for bill in self.bills:
            if bill['id'] == bill_id:
                return bill
        return None

    def find_by_appointment(self, appointment_id):
        for bill in self.bills:
            if bill['appointment_id'] == appointment_id:
                return bill
        return None

    def get_all(self):
        return self.bills

    def update(self, bill_id, data):
        bill = self.find_by_id(bill_id)
        if bill:
            # Update only provided fields
            for key, value in data.items():
                if key != 'id' and key != 'created_at':
                    bill[key] = value
            bill['updated_at'] = datetime.utcnow().isoformat()
            return bill
        return None

    def delete(self, bill_id):
        bill = self.find_by_id(bill_id)
        if bill:
            self.bills.remove(bill)
            return True
        return False

    def get_current_timestamp(self):
        return datetime.utcnow().isoformat()
