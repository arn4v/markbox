import { isProd } from "~/config";

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

export function getDeploymentUrl() {
	switch (true) {
		case !!process.env.NEXT_PUBLIC_DEPLOYMENT_URL: {
			return process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
		}
		case isProd: {
			return "https://markbox.in";
		}
		default: {
			return "http://localhost:3000";
		}
	}
}
