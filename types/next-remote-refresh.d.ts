declare module "next-remote-refresh/hook" {
	export function useRemoteRefresh(options?: {
		shouldRefresh?: (path: string) => boolean;
	}): void;
}
