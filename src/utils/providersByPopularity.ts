import IListProvider from '../interfaces/listProvider';

export default function (providers: IListProvider[]) {
	return providers.filter(({popularity}) => popularity > 10);
}
