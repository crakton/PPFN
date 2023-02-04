export default interface IReports {
	id: number;
	created_at: string;
	appointment_id: number;
	provider_id: number;
	beneficiary_id: number;
	title: string;
	status: string;
	file_path: string;
}
