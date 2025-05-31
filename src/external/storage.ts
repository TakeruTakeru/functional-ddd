interface StorageInterface {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
	clear(): void;
}

class Storage implements StorageInterface {
	getItem(key: string): string | null {
		return localStorage.getItem(key);
	}

	setItem(key: string, value: string): void {
		localStorage.setItem(key, value);
	}
	removeItem(key: string): void {
		localStorage.removeItem(key);
	}
	clear(): void {
		localStorage.clear();
	}
}

export { type StorageInterface, Storage };
