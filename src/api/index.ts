import { err, okAsync } from "neverthrow";
import {
	type TrainerBasic,
	TrainerDraftSchema,
	TrainerUpgradeCommandSchema,
} from "~/domain/trainer";
import { DbRepository } from "~/external";
import { getRequiredParam } from "~/infrastructure/params";
import { authorizeTrainer, upgradeTrainer } from "~/workflow/trainer-usecases";

type EndpointReturnTypes = {
	authorizeTrainer: ReturnType<typeof authorizeTrainer>;
	upgradeTrainer: ReturnType<typeof upgradeTrainer>;
};

type Endpoint = keyof EndpointReturnTypes;

function handle<T extends Endpoint>(
	endpoint: T,
	params: Map<string, string>,
): EndpointReturnTypes[T];
function handle(endpoint: Endpoint, params: Map<string, string>) {
	const db = new DbRepository();

	switch (endpoint) {
		case "authorizeTrainer":
			return getRequiredParam(params, TrainerDraftSchema).asyncAndThen(
				authorizeTrainer(db.insert),
			);
		case "upgradeTrainer":
			return getRequiredParam(params, TrainerUpgradeCommandSchema).asyncAndThen(
				(command) =>
					upgradeTrainer(
						(trainerId) => {
							return okAsync({
								id: command.trainerId,
								name: "hoge",
							} as TrainerBasic); // Adjust based on TrainerBasic structure
						},
						() => new Date(),
						db.update,
					)(command),
			);
		default:
			return err(new Error("Unknown endpoint"));
	}
}

export { handle };
export type { Endpoint, EndpointReturnTypes };
