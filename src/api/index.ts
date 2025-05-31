import { Err, err, type Result } from "neverthrow";
import type { Context } from "~/ctx";
import { DbRepository, Storage } from "~/external";
import {
	authorizeTrainer,
	upgradeTrainer,
} from "~/application/trainer-usecases";

type EndpointReturnTypes = {
	authorizeTrainer: ReturnType<typeof authorizeTrainer>;
	upgradeTrainer: ReturnType<typeof upgradeTrainer>;
};

type Endpoint = keyof EndpointReturnTypes;

function handle<T extends Endpoint>(
	endpoint: T,
	params: Map<string, string>,
): EndpointReturnTypes[T];
function handle(
	endpoint: Endpoint,
	params: Map<string, string>,
): EndpointReturnTypes[Endpoint] | Result<never, Error>;

function handle(endpoint: Endpoint, params: Map<string, string>) {
	const db = new DbRepository();
	const storage = new Storage();
	const ctx = {
		db,
		storage,
		params,
	} as Context;

	switch (endpoint) {
		case "authorizeTrainer":
			return authorizeTrainer(ctx);
		case "upgradeTrainer":
			return upgradeTrainer(ctx);
		default:
			return err(new Error("Unknown endpoint"));
	}
}

export { handle };
export type { Endpoint, EndpointReturnTypes };
