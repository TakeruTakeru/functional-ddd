import type { CreatedAt, UpdatedAt } from "~/domain/shared";
import type { Brand } from "~/utils";

type User = {
	id: UserId;
	name: UserName;
	gender: Gender;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
};

type UserId = Brand<string, "UserId">;
type UserName = Brand<string, "UserName">;
type Gender = "male" | "female";

function createUser(userId: string, name: string, gender: Gender): User {
	return {
		id: userId,
		name,
		gender,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as User;
}

export type { User, Gender, UserId, UserName };
export { createUser };
