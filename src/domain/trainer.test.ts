import {
	TrainerBasicSchema,
	TrainerDraftSchema,
	createTrainerBasic,
} from "~/domain/trainer";

test("Trainer creation success", () => {
	const draft = {
		id: "trainer-123",
		name: "John Doe",
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const draftValidated = TrainerDraftSchema.parse(draft);

	const trainer = createTrainerBasic(draftValidated);

	expect(trainer.isOk()).toBe(true);
	expect(TrainerBasicSchema.safeParse(trainer._unsafeUnwrap()).success).toBe(
		true,
	);
});
