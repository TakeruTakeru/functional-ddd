import type { Brand } from "~/utils";
import type { CreatedAt, UpdatedAt } from "~/domain/shared";
import type { UserId } from "~/domain/user";
import type { TrainerId } from "~/domain/trainer";

type Payment = {
	id: PaymentId;
	amount: PaymentAmount;
	Payee: UserId;
	Recipient: TrainerId;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
};

type PaymentId = Brand<string, "PaymentId">;

type PaymentAmount = Brand<number, "PaymentAmount">;

function createPayment(
	paymentId: string,
	amount: number,
	payee: UserId,
	recipient: TrainerId,
): Payment {
	return {
		id: paymentId as PaymentId,
		amount: amount as PaymentAmount,
		Payee: payee,
		Recipient: recipient,
		createdAt: new Date() as CreatedAt,
		updatedAt: new Date() as UpdatedAt,
	} as Payment;
}

export type { Payment, PaymentId, PaymentAmount };
export { createPayment };
