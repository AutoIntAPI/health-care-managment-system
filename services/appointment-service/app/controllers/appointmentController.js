const axios = require("axios");
const appointmentModel = require("../models/appointmentModel");

const PATIENT_SERVICE_URL =
	process.env.PATIENT_SERVICE_URL || "http://localhost:5001";
const DOCTOR_SERVICE_URL =
	process.env.DOCTOR_SERVICE_URL || "http://localhost:3002";
const BILLING_SERVICE_URL =
	process.env.BILLING_SERVICE_URL || "http://localhost:5002";
const AUTH_SERVICE_URL =
	process.env.AUTH_SERVICE_URL || "http://localhost:3001";

class AppointmentController {
	async create(req, res) {
		try {
			const {
				patient_id,
				doctor_id,
				appointment_date,
				appointment_time,
				reason,
			} = req.body;

			// Validate required fields
			if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
				return res.status(400).json({ error: "All fields are required" });
			}

			// Verify patient exists via REST API call
			try {
				const patientResponse = await axios.get(
					`${PATIENT_SERVICE_URL}/api/patients/${patient_id}`,
				);
				if (!patientResponse.data.patient) {
					return res.status(404).json({ error: "Patient not found" });
				}
			} catch (error) {
				console.error("Patient service error:", error.message);
				return res
					.status(404)
					.json({ error: "Patient not found or patient service unavailable" });
			}

			// Verify doctor exists via REST API call
			try {
				const doctorResponse = await axios.get(
					`${DOCTOR_SERVICE_URL}/api/doctors/${doctor_id}`,
				);
				if (!doctorResponse.data.doctor) {
					return res.status(404).json({ error: "Doctor not found" });
				}
			} catch (error) {
				console.error("Doctor service error:", error.message);
				return res
					.status(404)
					.json({ error: "Doctor not found or doctor service unavailable" });
			}

			// Create appointment
			const appointment = appointmentModel.create({
				patient_id,
				doctor_id,
				appointment_date,
				appointment_time,
				reason: reason || "",
				status: "scheduled",
			});

			// Create billing record via REST API call
			try {
				const billingResponse = await axios.post(
					`${BILLING_SERVICE_URL}/api/billing/calculate`,
					{
						appointment_id: appointment.id,
						patient_id,
						doctor_id,
						service_type: "consultation",
					},
				);

				appointment.billing_id = billingResponse.data.bill.id;
			} catch (error) {
				console.error("Billing service error:", error.message);
				// Continue without billing - can be added later
			}

			res.status(201).json({
				message: "Appointment created successfully",
				appointment,
			});
		} catch (error) {
			console.error("Create appointment error:", error);
			res.status(500).json({ error: "Failed to create appointment" });
		}
	}

	async getById(req, res) {
		try {
			const id = parseInt(req.params.id);
			const appointment = appointmentModel.findById(id);

			if (!appointment) {
				return res.status(404).json({ error: "Appointment not found" });
			}

			// Enrich appointment with patient details via REST API call
			try {
				const patientResponse = await axios.get(
					`${PATIENT_SERVICE_URL}/api/patients/${appointment.patient_id}`,
				);
				appointment.patient_details = patientResponse.data.patient;
			} catch (error) {
				console.error("Failed to fetch patient details:", error.message);
			}

			// Enrich appointment with doctor details via REST API call
			try {
				const doctorResponse = await axios.get(
					`${DOCTOR_SERVICE_URL}/api/doctors/${appointment.doctor_id}`,
				);
				appointment.doctor_details = doctorResponse.data.doctor;
			} catch (error) {
				console.error("Failed to fetch doctor details:", error.message);
			}

			// Fetch billing information if available via REST API call
			if (appointment.billing_id) {
				try {
					const billingResponse = await axios.get(
						`${BILLING_SERVICE_URL}/api/billing/${appointment.billing_id}`,
					);
					appointment.billing_details = billingResponse.data.bill;
				} catch (error) {
					console.error("Failed to fetch billing details:", error.message);
				}
			}

			res.status(200).json({ appointment });
		} catch (error) {
			console.error("Get appointment error:", error);
			res.status(500).json({ error: "Failed to get appointment" });
		}
	}

	async getAll(req, res) {
		try {
			const appointments = appointmentModel.getAll();
			res.status(200).json({ appointments, count: appointments.length });
		} catch (error) {
			console.error("Get all appointments error:", error);
			res.status(500).json({ error: "Failed to get appointments" });
		}
	}

	async update(req, res) {
		try {
			const id = parseInt(req.params.id);
			const data = req.body;

			const existingAppointment = appointmentModel.findById(id);
			if (!existingAppointment) {
				return res.status(404).json({ error: "Appointment not found" });
			}

			// If patient is being changed, verify new patient exists via REST API call
			if (
				data.patient_id &&
				data.patient_id !== existingAppointment.patient_id
			) {
				try {
					const patientResponse = await axios.get(
						`${PATIENT_SERVICE_URL}/api/patients/${data.patient_id}`,
					);
					if (!patientResponse.data.patient) {
						return res.status(404).json({ error: "New patient not found" });
					}
				} catch (error) {
					console.error("Patient service error:", error.message);
					return res
						.status(404)
						.json({
							error: "Patient not found or patient service unavailable",
						});
				}
			}

			// If doctor is being changed, verify new doctor exists
			if (data.doctor_id) {
				try {
					const doctorResponse = await axios.get(
						`${DOCTOR_SERVICE_URL}/api/doctors/${data.doctor_id}`,
					);
					if (!doctorResponse.data.doctor) {
						return res.status(404).json({ error: "Doctor not found" });
					}
					// Check doctor availability via REST API call
					const availabilityResponse = await axios.get(
						`${DOCTOR_SERVICE_URL}/api/doctors/${data.doctor_id}/availability`,
					);
					data.doctor_availability = availabilityResponse.data.availability;
				} catch (error) {
					console.error("Doctor service error:", error.message);
					return res
						.status(404)
						.json({ error: "Doctor not found or doctor service unavailable" });
				}
			}

			const appointment = appointmentModel.update(id, data);
			res.status(200).json({
				message: "Appointment updated successfully",
				appointment,
			});
		} catch (error) {
			console.error("Update appointment error:", error);
			res.status(500).json({ error: "Failed to update appointment" });
		}
	}

	async cancel(req, res) {
		try {
			const id = parseInt(req.params.id);
			const appointment = appointmentModel.findById(id);

			if (!appointment) {
				return res.status(404).json({ error: "Appointment not found" });
			}

			// Notify patient about cancellation via REST API call (if notification endpoint exists)
			// Update billing status to cancelled via REST API call
			if (appointment.billing_id) {
				try {
					await axios.put(
						`${BILLING_SERVICE_URL}/api/billing/${appointment.billing_id}`,
						{ status: "cancelled" },
					);
				} catch (error) {
					console.error("Failed to update billing status:", error.message);
				}
			}

			// Update appointment status to cancelled
			appointmentModel.update(id, { status: "cancelled" });

			res.status(200).json({ message: "Appointment cancelled successfully" });
		} catch (error) {
			console.error("Cancel appointment error:", error);
			res.status(500).json({ error: "Failed to cancel appointment" });
		}
	}

	async getByPatient(req, res) {
		try {
			const patientId = parseInt(req.params.patientId);
			const appointments = appointmentModel.findByPatient(patientId);

			res.status(200).json({ appointments, count: appointments.length });
		} catch (error) {
			console.error("Get patient appointments error:", error);
			res.status(500).json({ error: "Failed to get patient appointments" });
		}
	}

	async getByDoctor(req, res) {
		try {
			const doctorId = parseInt(req.params.doctorId);
			const appointments = appointmentModel.findByDoctor(doctorId);

			res.status(200).json({ appointments, count: appointments.length });
		} catch (error) {
			console.error("Get doctor appointments error:", error);
			res.status(500).json({ error: "Failed to get doctor appointments" });
		}
	}
}

module.exports = new AppointmentController();
