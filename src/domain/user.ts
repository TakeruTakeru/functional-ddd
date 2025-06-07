import { z } from "zod";
import { CreatedAtSchema, UpdatedAtSchema } from "~/domain/shared";

export const UserIdSchema = z
	.string()
	.min(1, "UserId must not be empty")
	.max(100, "UserId must be less than 100 characters")
	.brand<"UserId">();
export const UserNameSchema = z
	.string()
	.min(1, "UserName must not be empty")
	.max(100, "UserName must be less than 100 characters")
	.brand<"UserName">();
export const GenderSchema = z.enum(["male", "female"]);

export type UserId = z.infer<typeof UserIdSchema>;
export type UserName = z.infer<typeof UserNameSchema>;
export type Gender = z.infer<typeof GenderSchema>;

export const UserSchema = z.object({
	id: UserIdSchema,
	name: UserNameSchema,
	gender: GenderSchema,
	createdAt: CreatedAtSchema,
	updatedAt: UpdatedAtSchema,
});

export type User = z.infer<typeof UserSchema>;

export function createUser(userId: string, name: string, gender: Gender): User {
	return {
		id: userId,
		name,
		gender,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as User;
}
