import { Doctor, DoctorAvailability } from "../types/doctor";

export class DoctorModel {
	private doctors: Doctor[] = [];
	private currentId: number = 1;

	create(data: Partial<Doctor>): Doctor {
		const doctor: Doctor = {
			id: this.currentId++,
			name: data.name!,
			email: data.email!,
			phone: data.phone!,
			specialization: data.specialization!,
			license_number: data.license_number!,
			years_of_experience: data.years_of_experience || 0,
			qualification: data.qualification || "",
			consultation_fee: data.consultation_fee || 0,
			availability: data.availability || [],
			rating: data.rating || 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		this.doctors.push(doctor);
		return doctor;
	}

	findById(id: number): Doctor | undefined {
		return this.doctors.find((doctor) => doctor.id === id);
	}

	findByEmail(email: string): Doctor | undefined {
		return this.doctors.find((doctor) => doctor.email === email);
	}

	getAll(): Doctor[] {
		return this.doctors;
	}

	update(id: number, data: Partial<Doctor>): Doctor | null {
		const doctor = this.findById(id);
		if (!doctor) return null;

		Object.assign(doctor, data, {
			id: doctor.id,
			created_at: doctor.created_at,
			updated_at: new Date().toISOString(),
		});

		return doctor;
	}

	delete(id: number): boolean {
		const index = this.doctors.findIndex((doctor) => doctor.id === id);
		if (index === -1) return false;

		this.doctors.splice(index, 1);
		return true;
	}

	setAvailability(
		id: number,
		availability: DoctorAvailability[],
	): Doctor | null {
		const doctor = this.findById(id);
		if (!doctor) return null;

		doctor.availability = availability;
		doctor.updated_at = new Date().toISOString();
		return doctor;
	}
}
