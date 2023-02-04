import {ReactNode} from "react";
import IListProvider from "./listProvider";

export interface DrawerScreenLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	rating?: null | number;
}
export interface DrawerScreenTopBarProps {
	title?: string;
	subtitle?: string;
	rating?: null | number;
}
export interface SearchBarProps {
	placeholder: string;
	value: string;
	handleChange: Function;
}
export interface SetFetchTypeProps {
	fetchTypes: string[];
	activeFetchType: string;
	setFetchType: Function;
}
export interface Doctor {
	name: string;
	experience: string;
	clinic: string;
	rating: number;
	online: boolean;
	picture: string;
	gender?: string;
	prospect?: string;
}
export interface IPatientBookings {
	name: string;
	clinic: string;
	info?: string;
	rating: number;
	picture: string;
}
export interface ScheduleSelectorProps {
	timeFrameList: string[];
	selectedTimeFrame: string;
	setSelectedTimeFrame: () => void;
}
export interface ScheduleElementProps {
	text: string;
	selected: boolean;
	setSelectedTimeFrame: (s: any) => void;
}
export interface ReportProps {
	name: string;
	date: string;
	clinic?: string;
	status?: string;
	rating: number;
}
export interface ProfileLayoutProps {
	children: ReactNode;
	profileImage: string | any;
	profileImageBtn?: ReactNode;
	showRegisteredDateAndName: boolean;
	edit: boolean;
	backBtn: boolean;
	userName: string;
	registeredDate: string | any;
	goBack: Function;
}
export interface INavigateProps {
	<RouteName extends string>(
		...args: RouteName extends unknown
			?
					| [screen: RouteName]
					| [screen: RouteName, params: object | undefined]
			: never
	): void;
	<RouteName extends string>(
		options: RouteName extends unknown
			?
					| {
							key: string;
							params?: object | undefined;
							merge?: boolean | undefined;
					  }
					| {
							name: RouteName;
							key?: string | undefined;
							params: object | undefined;
							merge?: boolean | undefined;
					  }
			: never,
	): void;
}
export interface INotifications {
	message: string;
	name: string;
	fullMsg?: string;
	time: string;
}
