import { customAlphabet } from 'nanoid';

export function nanoid(length = 8) {
	return customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length)();
}
