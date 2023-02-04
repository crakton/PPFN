export default interface IListAppointment {
	id: string;
	prov_id: string;
	client_id: string;
	provider_name: string;
	facility: string;
	client_name: string;
	client_contact: string;
	start_time: string;
	end_time_actual: string;
	end_time_expected: string;
	service_name: string;
	price: string;
	discount: string;
	canceled: string;
	cancellation_reason: string;
	service_booked: string;
	service_provided: string;
	note_review: string;
	status: string;
	date_created: string;
}
