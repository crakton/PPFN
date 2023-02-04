export default function convertToAge(dob: string | number | Date): string {
	const currentYear = new Date().getFullYear();
	const birthYear = new Date(dob).getFullYear();
	if (dob) {
		return (currentYear - birthYear).toString();
	}
	return '';
}
