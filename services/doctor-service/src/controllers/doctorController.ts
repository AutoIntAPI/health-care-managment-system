import { Request, Response } from "express";
import axios from "axios";
import { DoctorModel } from "../models/doctorModel";
import { Doctor, DoctorAvailability } from "../types/doctor";

// Service URLs for inter-service communication
const APPOINTMENT_SERVICE_URL =
	process.env.APPOINTMENT_SERVICE_URL || "http://localhost:3003";
const BILLING_SERVICE_URL =
	process.env.BILLING_SERVICE_URL || "http://localhost:5002";

export class DoctorController {
	private model: DoctorModel;

	constructor() {
		this.model = new DoctorModel();
	}

	async create(req: Request, res: Response): Promise<void> {
		try {
			const data: Partial<Doctor> = req.body;

			// Validate required fields
			const requiredFields = [
				"name",
				"email",
				"phone",
				"specialization",
				"license_number",
			];
			for (const field of requiredFields) {
				if (!(field in data)) {
					res.status(400).json({ error: `${field} is required` });
					return;
				}
			}

			// Check if doctor with email already exists
			if (this.model.findByEmail(data.email!)) {
				res
					.status(409)
					.json({ error: "Doctor with this email already exists" });
				return;
			}

			const doctor = this.model.create(data);
			res.status(201).json({
				message: "Doctor created successfully",
				doctor,
			});
		} catch (error) {
			console.error("Create doctor error:", error);
			res.status(500).json({ error: "Failed to create doctor" });
		}
	}

	async getById(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const doctor = this.model.findById(id);

			if (!doctor) {
				res.status(404).json({ error: "Doctor not found" });
				return;
			}

			// Fetch doctor's appointments via REST API call
			try {
				const appointmentsResponse = await axios.get(
					`${APPOINTMENT_SERVICE_URL}/api/appointments/doctor/${id}`,
				);
				(doctor as any).appointments = appointmentsResponse.data.appointments;
			} catch (error: any) {
				console.error("Failed to fetch appointments:", error.message);
				(doctor as any).appointments = [];
			}

			res.status(200).json({ doctor });
		} catch (error) {
			console.error("Get doctor error:", error);
			res.status(500).json({ error: "Failed to get doctor" });
		}
	}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const doctors = this.model.getAll();
			res.status(200).json({ doctors, count: doctors.length });
		} catch (error) {
			console.error("Get all doctors error:", error);
			res.status(500).json({ error: "Failed to get doctors" });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const data: Partial<Doctor> = req.body;

			if (!this.model.findById(id)) {
				res.status(404).json({ error: "Doctor not found" });
				return;
			}

			// Check email uniqueness if email is being updated
			if (data.email) {
				const existing = this.model.findByEmail(data.email);
				if (existing && existing.id !== id) {
					res.status(409).json({ error: "Email already in use" });
					return;
				}
			}

			const doctor = this.model.update(id, data);
			res.status(200).json({
				message: "Doctor updated successfully",
				doctor,
			});
		} catch (error) {
			console.error("Update doctor error:", error);
			res.status(500).json({ error: "Failed to update doctor" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);

			if (!this.model.findById(id)) {
				res.status(404).json({ error: "Doctor not found" });
				return;
			}

			// Cancel all doctor's appointments via REST API call
			try {
				await axios.delete(
					`${APPOINTMENT_SERVICE_URL}/api/appointments/doctor/${id}`,
				);
				console.log("Doctor's appointments cancelled");
			} catch (error: any) {
				console.error("Failed to cancel appointments:", error.message);
			}

			this.model.delete(id);
			res.status(200).json({ message: "Doctor deleted successfully" });
		} catch (error) {
			console.error("Delete doctor error:", error);
			res.status(500).json({ error: "Failed to delete doctor" });
		}
	}

	async getAvailability(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const doctor = this.model.findById(id);

			if (!doctor) {
				res.status(404).json({ error: "Doctor not found" });
				return;
			}

			res.status(200).json({ availability: doctor.availability });
		} catch (error) {
			console.error("Get availability error:", error);
			res.status(500).json({ error: "Failed to get availability" });
		}
	}

	async getConsultationFee(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const doctor = this.model.findById(id);

			if (!doctor) {
				res.status(404).json({ error: "Doctor not found" });
				return;
			}

			res.status(200).json({
				doctor_id: doctor.id,
				consultation_fee: doctor.consultation_fee,
			});
		} catch (error) {
			console.error("Get consultation fee error:", error);
			res.status(500).json({ error: "Failed to get consultation fee" });
		}
	}

	async setAvailability(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const doctor = this.model.findById(id);
			if (!doctor) {
				res.status(404).json({ error: "Doctor not found" });
				return;
			}

			const availability: DoctorAvailability[] =
				req.body.availability ?? doctor.availability;
			const consultationFee = req.body.consultation_fee;

			if (consultationFee !== undefined) {
				this.model.update(id, { consultation_fee: consultationFee });
			}

			const updatedDoctor = this.model.setAvailability(id, availability);
			res.status(200).json({
				message: "Availability updated successfully",
				doctor: updatedDoctor,
			});
		} catch (error) {
			console.error("Set availability error:", error);
			res.status(500).json({ error: "Failed to set availability" });
		}
	}
}
