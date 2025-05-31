import { err, ok } from "neverthrow";
import type { Context } from "~/ctx";
import {
	createTrainerBasic,
	TrainerIdSchema,
	TrainerNameSchema,
	type TrainerId,
} from "~/domain/trainer";
import { getRequiredParam } from "~/infrastructure/params";

// ユースケース関数
function authorizeTrainer(ctx: Context) {
	return getRequiredParam(ctx.params, "trainerName", TrainerNameSchema)
		.andThen((name) =>
			createTrainerBasic({
				id: TrainerIdSchema.parse(crypto.randomUUID()),
				name,
			}).map(
				(trainer) =>
					({
						message: "Trainer authorized successfully",
						trainerId: trainer.id,
						timestamp: new Date().toISOString(),
					}) as const,
			),
		)
		.andThen((response) => ok(response))
		.orElse((error) => err(error));
}

function upgradeTrainer(ctx: Context) {
	const trainerIdResult = getRequiredParam(
		ctx.params,
		"trainerId",
		TrainerIdSchema,
	);

	if (trainerIdResult.isErr()) {
		return err(trainerIdResult.error);
	}

	const response = {
		message: "Trainer upgraded successfully",
		trainerId: trainerIdResult.value,
		timestamp: new Date().toISOString(),
	};

	return ok(response);
}

export { authorizeTrainer, upgradeTrainer };
export type { TrainerId };
