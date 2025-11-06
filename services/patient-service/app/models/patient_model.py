from datetime import datetime

class PatientModel:
    def __init__(self):
        self.patients = []
        self.current_id = 1

    def create(self, data):
        patient = {
            'id': self.current_id,
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'date_of_birth': data['date_of_birth'],
            'gender': data['gender'],
            'address': data['address'],
            'medical_history': data.get('medical_history', []),
            'allergies': data.get('allergies', []),
            'blood_type': data.get('blood_type', ''),
            'emergency_contact': data.get('emergency_contact', {}),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        self.patients.append(patient)
        self.current_id += 1
        return patient

    def find_by_id(self, patient_id):
        for patient in self.patients:
            if patient['id'] == patient_id:
                return patient
        return None

    def find_by_email(self, email):
        for patient in self.patients:
            if patient['email'] == email:
                return patient
        return None

    def get_all(self):
        return self.patients

    def update(self, patient_id, data):
        patient = self.find_by_id(patient_id)
        if patient:
            # Update only provided fields
            for key, value in data.items():
                if key != 'id' and key != 'created_at':
                    patient[key] = value
            patient['updated_at'] = datetime.utcnow().isoformat()
            return patient
        return None

    def delete(self, patient_id):
        patient = self.find_by_id(patient_id)
        if patient:
            self.patients.remove(patient)
            return True
        return False
