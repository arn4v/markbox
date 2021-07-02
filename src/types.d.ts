export type ArgumentTypes<F extends Function> = F extends (
	...args: infer A
) => any
	? A
	: never;

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
