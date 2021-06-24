export function omitKeys<T, K extends keyof T>(obj: T, ...keys: K[]) {
	for (const key in keys) {
		delete obj[key];
	}

	return obj;
}

export function pickKeys<T, K extends keyof T>(obj: T, ...keys: K[]) {
	return keys.reduce((acc, cur) => {
		acc[cur] = obj[cur];
		return acc;
	}, {} as T);
}
