export default interface IListProvider {
	readonly id: number | string | undefined;
	readonly title: string;
	readonly first_name: string;
	readonly last_name: string;
	readonly gender: string;
	readonly image: string;
	readonly photo_name: string;
	readonly phone_number: string;
	readonly date_of_birth: Date | string | number;
	readonly email: string;
	readonly next_of_kin: string;
	readonly relationship_with_nok: string;
	readonly address: string;
	readonly city: string;
	readonly state: string;
	readonly category: string;
	readonly facility: string;
	readonly experience: string;
	readonly rating: number;
	readonly popularity: number | string;
}
