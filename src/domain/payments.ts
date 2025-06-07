import { type Result, err, ok } from "neverthrow";
import { z } from "zod";
import {
	type CreatedAt,
	CreatedAtSchema,
	type UpdatedAt,
	UpdatedAtSchema,
} from "~/domain/shared";
import { TrainerIdSchema } from "~/domain/trainer";
import { UserIdSchema } from "~/domain/user";

export const PaymentIdSchema = z
	.string()
	.min(1, "PaymentId must not be empty")
	.max(100, "PaymentId must be less than 100 characters")
	.brand<"PaymentId">();

export const PaymentAmountSchema = z
	.number()
	.positive("Payment amount must be positive")
	.brand<"PaymentAmount">();

export type PaymentId = z.infer<typeof PaymentIdSchema>;
export type PaymentAmount = z.infer<typeof PaymentAmountSchema>;

export const PaymentSchema = z.object({
	id: PaymentIdSchema,
	amount: PaymentAmountSchema,
	payee: UserIdSchema,
	recipient: TrainerIdSchema,
	createdAt: CreatedAtSchema,
	updatedAt: UpdatedAtSchema,
});

export type Payment = z.infer<typeof PaymentSchema>;

export const PaymentDraftSchema = z.object({
	amount: PaymentAmountSchema,
	payee: UserIdSchema,
	recipient: TrainerIdSchema,
});

export type PaymentDraft = z.infer<typeof PaymentDraftSchema>;

export function createPayment(draft: PaymentDraft): Result<Payment, Error> {
	const parsed = PaymentDraftSchema.safeParse(draft);

	if (!parsed.success) {
		return err(new Error(`Invalid Payment: ${parsed.error.message}`));
	}

	return ok({
		id: crypto.randomUUID() as PaymentId,
		amount: parsed.data.amount,
		payee: parsed.data.payee,
		recipient: parsed.data.recipient,
		createdAt: new Date() as CreatedAt,
		updatedAt: new Date() as UpdatedAt,
	} as Payment);
}

// バリデーション関数
export function isPaymentId(value: unknown): value is PaymentId {
	return PaymentIdSchema.safeParse(value).success;
}

export function createPaymentId(value: unknown): PaymentId | null {
	const result = PaymentIdSchema.safeParse(value);
	return result.success ? result.data : null;
}

export function paymentId(value: unknown): PaymentId {
	return PaymentIdSchema.parse(value);
}

export function isPaymentAmount(value: unknown): value is PaymentAmount {
	return PaymentAmountSchema.safeParse(value).success;
}

export function createPaymentAmount(value: unknown): PaymentAmount | null {
	const result = PaymentAmountSchema.safeParse(value);
	return result.success ? result.data : null;
}

export function paymentAmount(value: unknown): PaymentAmount {
	return PaymentAmountSchema.parse(value);
}
