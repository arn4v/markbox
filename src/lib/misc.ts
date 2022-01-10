export function omitKeys<T, K extends keyof T>(
	obj: T,
	...keys: K[]
): Omit<T, K> {
	for (const key of keys) {
		delete obj[key];
	}

	return obj;
}

export function pickKeys<T, K extends keyof T>(
	obj: T,
	...keys: K[]
): Pick<T, K> {
	return keys.reduce((acc, cur) => {
		acc[cur] = obj[cur];
		return acc;
	}, {} as T);
}

export function getBaseUrl() {
	if (process.browser) {
		return "";
	}
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// // reference for render.com
	if (process.env.RENDER_INTERNAL_HOSTNAME) {
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	}

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
