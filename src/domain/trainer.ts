import { type Result, err, ok } from "neverthrow";
import { z } from "zod";
import {
	type CreatedAt,
	CreatedAtSchema,
	type UpdatedAt,
	UpdatedAtSchema,
	buildFromZodDefault,
} from "~/domain/shared";

export const TrainerIdSchema = z
	.string()
	.min(1, "TrainerId must not be empty")
	.max(100, "TrainerId must be less than 100 characters")
	.brand<"TrainerId">();

export const TrainerNameSchema = z
	.string()
	.min(1, "TrainerName must not be empty")
	.max(100, "TrainerName must be less than 100 characters")
	.brand<"TrainerName">();

export const TrainerExpiresAtSchema = z.date().brand<"ExpiredAt">();

export type TrainerId = z.infer<typeof TrainerIdSchema>;
export type TrainerName = z.infer<typeof TrainerNameSchema>;
export type ExpiredAt = z.infer<typeof TrainerExpiresAtSchema>;

export const TrainerBasicSchema = z.object({
	id: TrainerIdSchema,
	name: TrainerNameSchema,
	createdAt: CreatedAtSchema,
	updatedAt: UpdatedAtSchema,
});

export type TrainerBasic = z.infer<typeof TrainerBasicSchema>;

export const TrainerPremiumSchema = z.object({
	id: TrainerIdSchema,
	name: TrainerNameSchema,
	expiresAt: TrainerExpiresAtSchema,
});

export type TrainerPremium = z.infer<typeof TrainerPremiumSchema>;

export const TrainerDraftSchema = z.object({
	name: TrainerNameSchema,
});

export type TrainerDraft = z.infer<typeof TrainerDraftSchema>;

export function createTrainerBasic(
	draft: TrainerDraft,
): Result<TrainerBasic, Error> {
	const parsed = TrainerDraftSchema.safeParse(draft);

	if (!parsed.success) {
		return err(new Error(`Invalid TrainerId: ${parsed.error.message}`));
	}

	return ok({
		id: crypto.randomUUID() as TrainerId,
		name: parsed.data.name,
		createdAt: new Date() as CreatedAt,
		updatedAt: new Date() as UpdatedAt,
	} as TrainerBasic);
}

export const TrainerUpgradeCommandSchema = z.object({
	trainerId: TrainerIdSchema,
});

export type TrainerUpgradeCommand = z.infer<typeof TrainerUpgradeCommandSchema>;

export function upgradeToPremiumTrainer(
	trainer: TrainerBasic,
	currentDate: Date,
): Result<TrainerPremium, Error> {
	const expiresAt = new Date(currentDate);
	expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1年後に設定

	return buildFromZodDefault(
		TrainerPremiumSchema.safeParse({
			id: trainer.id,
			name: trainer.name,
			expiresAt: TrainerExpiresAtSchema.parse(expiresAt),
		}),
	);
}
