import { publicLoad } from '$lib';

export async function load() {
	const data = await publicLoad()
	return {
		publicData: data.publicData
	};
}


