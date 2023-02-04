import IListProvider from '../interfaces/listProvider';

export default function(providers: IListProvider[], you: string) {
	return providers.filter(({ state }) => state === you);
}
