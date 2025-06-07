import { type ResultAsync, err, ok } from "neverthrow";
import {
	type TrainerBasic,
	type TrainerDraft,
	type TrainerId,
	type TrainerPremium,
	type TrainerUpgradeCommand,
	createTrainerBasic,
	upgradeToPremiumTrainer,
} from "~/domain/trainer";
import type { DatabaseError } from "~/external/db";

type FindBasicTrainer = (
	trainerId: TrainerId,
) => ResultAsync<TrainerBasic, DatabaseError>;

type CurrentDateProvider = () => Date;

type SaveBasicTrainer = (
	tableName: string,
	data: TrainerBasic,
) => ResultAsync<void, DatabaseError>;

type SavePremiumTrainer = (
	tableName: string,
	data: TrainerPremium,
) => ResultAsync<void, DatabaseError>;

export function authorizeTrainer(saveTrainer: SaveBasicTrainer) {
	return (command: TrainerDraft) =>
		ok(command)
			.asyncAndThen((command) =>
				createTrainerBasic(command)
					.asyncAndThrough((trainer) => saveTrainer("trainers", trainer))
					.map(
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

export function upgradeTrainer(
	findTrainer: FindBasicTrainer,
	currentDateProvider: CurrentDateProvider,
	saveTrainer: SavePremiumTrainer,
) {
	return (command: TrainerUpgradeCommand) =>
		ok(command)
			.asyncAndThen((command) => findTrainer(command.trainerId))
			.andThen((basicTrainer) =>
				upgradeToPremiumTrainer(basicTrainer, currentDateProvider()),
			)
			.andThrough((premiumTrainer) => saveTrainer("trainers", premiumTrainer))
			.map(
				(premiumTrainer) =>
					({
						message: "Trainer upgraded to premium successfully",
						trainerId: premiumTrainer.id,
						expiresAt: premiumTrainer.expiresAt.toISOString(),
						timestamp: new Date().toISOString(),
					}) as const,
			);
}
