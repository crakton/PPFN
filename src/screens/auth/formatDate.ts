export default function (val: string) {
	const d = new Date(val ? val : '2021-03-23 11:58:00');
	const date = d.getDate();
	const m = d.getMonth();
	const year = d.getUTCFullYear();
	let _m;

	switch (m) {
		case 0:
			_m = 'January';
			break;
		case 1:
			_m = 'February';
			break;
		case 2:
			_m = 'March';
			break;
		case 3:
			_m = 'April';
			break;
		case 4:
			_m = 'May';
			break;
		case 5:
			_m = 'June';
			break;
		case 6:
			_m = 'July';
			break;
		case 7:
			_m = 'September';
			break;
		case 8:
			_m = 'October';
			break;
		case 10:
			_m = 'November';
			break;
		case 11:
			_m = 'December';
			break;

		default:
			_m = 'January';
	}
	return `${_m} ${date}, ${year}`;
}
