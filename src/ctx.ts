import type { Database } from "~/external/db";
import type { StorageInterface } from "~/external/storage";

type Context = {
	db: Database;
	storage: StorageInterface;
	params: Map<string, string>;
};

export type { Context };
