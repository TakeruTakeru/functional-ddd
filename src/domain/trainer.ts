import { err, ok } from "neverthrow";
import { z } from "zod";
import type { CreatedAt, UpdatedAt } from "~/domain/shared";
import type { Brand } from "~/utils";

// ドメイン固有のZodスキーマ
export const TrainerIdSchema = z
	.string()
	.min(1, "TrainerId must not be empty")
	.regex(/^\d+$/, "TrainerId must contain only digits")
	.brand<"TrainerId">();

export const TrainerNameSchema = z
	.string()
	.min(1, "TrainerName must not be empty")
	.max(100, "TrainerName must be less than 100 characters")
	.brand<"TrainerName">();

// ブランド型定義（Zodと連携）
export type TrainerId = z.infer<typeof TrainerIdSchema>;
export type TrainerName = z.infer<typeof TrainerNameSchema>;
type ExpiredAt = Brand<Date, "ExpiredAt">;

type TrainerBasic = {
	id: TrainerId;
	name: TrainerName;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
};

type TrainerPremium = {
	id: TrainerId;
	name: TrainerName;
	expiresAt: ExpiredAt;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
};

const TrainerDraftSchema = z.object({
	id: TrainerIdSchema,
	name: TrainerNameSchema,
});
type TrainerDraft = z.infer<typeof TrainerDraftSchema>;

function createTrainerBasic(draft: TrainerDraft) {
	const parsed = TrainerDraftSchema.safeParse(draft);

	if (!parsed.success) {
		return err(new Error(`Invalid TrainerId: ${parsed.error.message}`));
	}

	return ok({
		id: parsed.data.id,
		name: parsed.data.name,
		createdAt: new Date() as CreatedAt,
		updatedAt: new Date() as UpdatedAt,
	} as TrainerBasic);
}

function upgrade(trainer: TrainerBasic, expiresAt: Date) {}

// バリデーション関数
export function isTrainerId(value: unknown): value is TrainerId {
	return TrainerIdSchema.safeParse(value).success;
}

export function createTrainerId(value: unknown): TrainerId | null {
	const result = TrainerIdSchema.safeParse(value);
	return result.success ? result.data : null;
}

export function trainerId(value: unknown): TrainerId {
	return TrainerIdSchema.parse(value);
}

export type { TrainerPremium, TrainerBasic, ExpiredAt };
export { createTrainerBasic, upgrade };
