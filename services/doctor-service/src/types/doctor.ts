export interface Doctor {
	id: number;
	name: string;
	email: string;
	phone: string;
	specialization: string;
	license_number: string;
	years_of_experience: number;
	qualification: string;
	consultation_fee: number;
	availability: DoctorAvailability[];
	rating: number;
	created_at: string;
	updated_at: string;
}

export interface DoctorAvailability {
	day: string; // Monday, Tuesday, etc.
	start_time: string; // HH:MM format
	end_time: string; // HH:MM format
	is_available: boolean;
}
