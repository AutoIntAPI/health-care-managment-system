// In-memory appointment storage
class AppointmentModel {
	constructor() {
		this.appointments = [];
		this.currentId = 1;
	}

	create(data) {
		const appointment = {
			id: this.currentId++,
			patient_id: data.patient_id,
			doctor_id: data.doctor_id,
			appointment_date: data.appointment_date,
			appointment_time: data.appointment_time,
			reason: data.reason || "",
			status: data.status || "scheduled", // scheduled, completed, cancelled
			billing_id: data.billing_id || null,
			notes: data.notes || "",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		this.appointments.push(appointment);
		return appointment;
	}

	findById(id) {
		return this.appointments.find((apt) => apt.id === id);
	}

	getAll() {
		return this.appointments;
	}

	findByPatient(patientId) {
		return this.appointments.filter((apt) => apt.patient_id === patientId);
	}

	findByDoctor(doctorId) {
		return this.appointments.filter((apt) => apt.doctor_id === doctorId);
	}

	update(id, data) {
		const appointment = this.findById(id);
		if (appointment) {
			Object.assign(appointment, data, {
				id: appointment.id,
				created_at: appointment.created_at,
				updated_at: new Date().toISOString(),
			});
			return appointment;
		}
		return null;
	}

	delete(id) {
		const index = this.appointments.findIndex((apt) => apt.id === id);
		if (index !== -1) {
			return this.appointments.splice(index, 1)[0];
		}
		return null;
	}
}

module.exports = new AppointmentModel();
